import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { ArrowLeft, Loader2, Pencil, Send, Trash2, Users, X } from 'lucide-react';

import messagingApi from '../../../api/messagingApi';
import { useAppContext } from '../../../context/AppContext';
import { mensajeDeError } from '../../../utils/apiError';
import EmployeeAvatar from '../../molecules/EmployeeAvatar';

/** Cada cuánto se sondean mensajes nuevos con el hilo abierto. */
const POLL_MS = 5000;

const fechaLarga = (v) =>
  new Date(v).toLocaleDateString('es-CR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

const hora = (v) =>
  new Date(v).toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit' });

/**
 * Hilo de una conversación: cabecera, mensajes y redactor. Sondea mensajes
 * nuevos mientras está montado y la pestaña visible.
 *
 * @param {number} conversationId
 * @param {()=>void} [onBack]    Volver a la lista (móvil).
 * @param {()=>void} [onChanged] Aviso al padre para refrescar la bandeja.
 */
const MessageThread = ({ conversationId, onBack, onChanged }) => {
  const { user } = useAppContext();
  const userId = user?.id;

  const [cabecera, setCabecera] = useState(null);
  const [mensajes, setMensajes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [texto, setTexto] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [editando, setEditando] = useState(null); // messageId

  const finRef = useRef(null);
  const scrollRef = useRef(null);
  const ultimoIdRef = useRef(0);
  const pegadoAbajoRef = useRef(true);

  const marcarLeido = useCallback(() => {
    if (userId) messagingApi.markRead(conversationId, userId).then(() => onChanged?.());
  }, [conversationId, userId, onChanged]);

  const cargarTodo = useCallback(async () => {
    setCargando(true);
    try {
      const [cRes, mRes] = await Promise.all([
        messagingApi.getConversation(conversationId, userId),
        messagingApi.getMessages(conversationId, { userId, take: 50 }),
      ]);
      setCabecera(cRes.data ?? null);
      const lista = Array.isArray(mRes.data) ? mRes.data : [];
      setMensajes(lista);
      ultimoIdRef.current = lista.length ? lista[lista.length - 1].messageId : 0;
      pegadoAbajoRef.current = true;
      marcarLeido();
    } catch (e) {
      console.error(e);
      toast.error(mensajeDeError(e, 'No se pudo abrir la conversación.'));
    } finally {
      setCargando(false);
    }
  }, [conversationId, userId, marcarLeido]);

  useEffect(() => {
    cargarTodo();
  }, [cargarTodo]);

  // Sondeo de mensajes nuevos + cambios (ediciones/borrados) del bloque visible.
  useEffect(() => {
    if (!userId) return undefined;

    const tick = async () => {
      if (document.hidden) return;
      try {
        const res = await messagingApi.getMessages(conversationId, {
          userId,
          afterId: ultimoIdRef.current,
        });
        const nuevos = Array.isArray(res.data) ? res.data : [];
        if (nuevos.length === 0) return;

        setMensajes((prev) => {
          const map = new Map(prev.map((m) => [m.messageId, m]));
          nuevos.forEach((m) => map.set(m.messageId, m));
          return [...map.values()].sort((a, b) => a.messageId - b.messageId);
        });
        const maxId = Math.max(...nuevos.map((m) => m.messageId));
        if (maxId > ultimoIdRef.current) ultimoIdRef.current = maxId;

        if (nuevos.some((m) => !m.mine)) marcarLeido();
      } catch {
        /* reintenta en el siguiente ciclo */
      }
    };

    const id = setInterval(tick, POLL_MS);
    return () => clearInterval(id);
  }, [conversationId, userId, marcarLeido]);

  // Autoscroll al fondo si el usuario ya estaba abajo.
  useLayoutEffect(() => {
    if (pegadoAbajoRef.current) {
      finRef.current?.scrollIntoView({ block: 'end' });
    }
  }, [mensajes]);

  const onScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    pegadoAbajoRef.current =
      el.scrollHeight - el.scrollTop - el.clientHeight < 80;
  };

  const enviar = async (e) => {
    e.preventDefault();
    const cuerpo = texto.trim();
    if (!cuerpo) return;

    setEnviando(true);
    try {
      if (editando) {
        await messagingApi.editMessage(editando, userId, cuerpo);
        setEditando(null);
      } else {
        await messagingApi.sendMessage(conversationId, userId, cuerpo);
      }
      setTexto('');
      pegadoAbajoRef.current = true;
      // Recoge de inmediato lo recién enviado (y ediciones).
      const res = await messagingApi.getMessages(conversationId, {
        userId,
        afterId: editando ? 0 : ultimoIdRef.current,
        take: 50,
      });
      const lista = Array.isArray(res.data) ? res.data : [];
      if (lista.length) {
        setMensajes((prev) => {
          const map = new Map(prev.map((m) => [m.messageId, m]));
          lista.forEach((m) => map.set(m.messageId, m));
          return [...map.values()].sort((a, b) => a.messageId - b.messageId);
        });
        ultimoIdRef.current = Math.max(
          ultimoIdRef.current,
          ...lista.map((m) => m.messageId)
        );
      }
      onChanged?.();
    } catch (err) {
      console.error(err);
      toast.error(mensajeDeError(err, 'No se pudo enviar el mensaje.'));
    } finally {
      setEnviando(false);
    }
  };

  const borrar = async (m) => {
    if (!window.confirm('¿Eliminar este mensaje?')) return;
    try {
      await messagingApi.deleteMessage(m.messageId, userId);
      setMensajes((prev) =>
        prev.map((x) =>
          x.messageId === m.messageId ? { ...x, deleted: true, body: null } : x
        )
      );
      onChanged?.();
    } catch (err) {
      console.error(err);
      toast.error(mensajeDeError(err, 'No se pudo eliminar.'));
    }
  };

  const empezarEdicion = (m) => {
    setEditando(m.messageId);
    setTexto(m.body ?? '');
  };

  return (
    <div className="flex h-full flex-col">
      {/* Cabecera */}
      <div className="flex items-center gap-3 border-b border-stroke-soft p-3">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            aria-label="Volver"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-md text-ink-muted hover:bg-canvas md:hidden"
          >
            <ArrowLeft size={18} />
          </button>
        )}
        {cabecera?.isGroup ? (
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-tint text-brand">
            <Users size={16} />
          </span>
        ) : (
          <EmployeeAvatar employee={cabecera?.other} size="sm" />
        )}
        <div className="min-w-0">
          <p className="truncate font-semibold text-ink">
            {cabecera?.title ?? 'Conversación'}
          </p>
          {cabecera?.isGroup && (
            <p className="text-xs text-ink-muted">
              {cabecera.participants?.length ?? 0} participantes
            </p>
          )}
        </div>
      </div>

      {/* Mensajes */}
      <div
        ref={scrollRef}
        onScroll={onScroll}
        className="min-h-0 flex-1 space-y-1 overflow-y-auto bg-canvas px-3 py-4 scrollbar-slim"
      >
        {cargando ? (
          <div className="flex h-full items-center justify-center text-ink-muted">
            <Loader2 size={20} className="animate-spin" />
          </div>
        ) : mensajes.length === 0 ? (
          <p className="py-10 text-center text-sm text-ink-muted">
            Aún no hay mensajes. Escribe el primero.
          </p>
        ) : (
          mensajes.map((m, i) => {
            const prev = mensajes[i - 1];
            const nuevoDia =
              !prev ||
              new Date(prev.createdAt).toDateString() !==
                new Date(m.createdAt).toDateString();

            return (
              <div key={m.messageId}>
                {nuevoDia && (
                  <p className="my-3 text-center text-[11px] font-medium uppercase tracking-wide text-ink-muted">
                    {fechaLarga(m.createdAt)}
                  </p>
                )}

                <div className={`flex ${m.mine ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`group max-w-[78%] rounded-2xl px-3 py-2 text-sm shadow-sm ${
                      m.mine
                        ? 'rounded-br-sm bg-brand text-white'
                        : 'rounded-bl-sm bg-surface text-ink'
                    }`}
                  >
                    {cabecera?.isGroup && !m.mine && (
                      <p className="mb-0.5 text-[11px] font-semibold text-brand">
                        {m.senderName}
                      </p>
                    )}

                    {m.deleted ? (
                      <p className="italic opacity-70">Mensaje eliminado</p>
                    ) : (
                      <p className="whitespace-pre-wrap break-words">{m.body}</p>
                    )}

                    <span
                      className={`mt-0.5 flex items-center gap-1.5 text-[10px] ${
                        m.mine ? 'text-white/70' : 'text-ink-muted'
                      }`}
                    >
                      {hora(m.createdAt)}
                      {m.editedAt && !m.deleted && <span>· editado</span>}
                      {m.mine && !m.deleted && (
                        <span className="ml-1 hidden gap-1 group-hover:flex">
                          <button
                            type="button"
                            onClick={() => empezarEdicion(m)}
                            aria-label="Editar"
                            className="hover:text-white"
                          >
                            <Pencil size={11} />
                          </button>
                          <button
                            type="button"
                            onClick={() => borrar(m)}
                            aria-label="Eliminar"
                            className="hover:text-white"
                          >
                            <Trash2 size={11} />
                          </button>
                        </span>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={finRef} />
      </div>

      {/* Redactor */}
      <form
        onSubmit={enviar}
        className="flex items-end gap-2 border-t border-stroke-soft p-3"
      >
        {editando && (
          <button
            type="button"
            onClick={() => {
              setEditando(null);
              setTexto('');
            }}
            aria-label="Cancelar edición"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-md text-ink-muted hover:bg-canvas"
          >
            <X size={16} />
          </button>
        )}
        <textarea
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              enviar(e);
            }
          }}
          rows={1}
          placeholder={editando ? 'Editar mensaje…' : 'Escribe un mensaje…'}
          className="max-h-32 flex-1 resize-none rounded-lg border border-stroke bg-surface px-3 py-2
                     text-sm text-ink placeholder:text-ink-muted focus:border-brand focus:outline-none"
        />
        <button
          type="submit"
          disabled={enviando || !texto.trim()}
          aria-label="Enviar"
          className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-brand text-white
                     transition-colors hover:bg-brand-hover disabled:opacity-50"
        >
          {enviando ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Send size={16} />
          )}
        </button>
      </form>
    </div>
  );
};

export default MessageThread;
