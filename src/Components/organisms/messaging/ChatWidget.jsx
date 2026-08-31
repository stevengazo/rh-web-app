import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Maximize2, MessagesSquare, Plus, X } from 'lucide-react';

import messagingApi from '../../../api/messagingApi';
import { useAppContext } from '../../../context/AppContext';
import useUnreadMessages from '../../../hooks/useUnreadMessages';

import ConversationList from './ConversationList';
import MessageThread from './MessageThread';
import NewConversationForm from './NewConversationForm';

const POLL_MS = 10000;

/**
 * Botón flotante de mensajería: siempre visible (salvo en la propia página de
 * mensajes), con el contador de no leídos, que despliega un panel compacto de
 * chat reutilizando los mismos componentes que `/messages`.
 */
const ChatWidget = () => {
  const { user } = useAppContext();
  const userId = user?.id;
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { total, refrescar } = useUnreadMessages();

  const [abierto, setAbierto] = useState(false);
  const [conversaciones, setConversaciones] = useState([]);
  const [activa, setActiva] = useState(null);
  const [nueva, setNueva] = useState(false);
  const cargadoRef = useRef(false);

  const cargar = useCallback(async () => {
    if (!userId) return;
    try {
      const res = await messagingApi.getConversations(userId);
      setConversaciones(Array.isArray(res.data) ? res.data : []);
      refrescar();
    } catch {
      /* reintenta en el siguiente ciclo */
    }
  }, [userId, refrescar]);

  useEffect(() => {
    if (!abierto) return undefined;
    if (!cargadoRef.current) {
      cargadoRef.current = true;
      cargar();
    }
    const id = setInterval(() => {
      if (!document.hidden) cargar();
    }, POLL_MS);
    return () => clearInterval(id);
  }, [abierto, cargar]);

  // Ocultar el widget en la página completa de mensajes y sin sesión.
  if (!userId || pathname === '/messages') return null;

  const conversacionActiva = conversaciones.find(
    (c) => c.conversationId === activa
  );

  const irACompleto = () => {
    setAbierto(false);
    navigate('/messages');
  };

  const tituloPanel = nueva
    ? 'Nuevo mensaje'
    : activa
      ? conversacionActiva?.title ?? 'Conversación'
      : 'Mensajes';

  return (
    <>
      {/* Botón flotante */}
      <button
        type="button"
        onClick={() => setAbierto((v) => !v)}
        aria-label={abierto ? 'Cerrar mensajería' : 'Abrir mensajería'}
        className="fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full
                   bg-linear-to-br from-brand to-accent text-white shadow-xl transition-transform
                   hover:scale-105 focus-visible:outline-none focus-visible:ring-2
                   focus-visible:ring-brand focus-visible:ring-offset-2"
      >
        {abierto ? <X size={22} /> : <MessagesSquare size={22} />}
        {!abierto && total > 0 && (
          <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full
                           border-2 border-canvas bg-red-500 px-1 text-[10px] font-bold text-white">
            {total > 99 ? '99+' : total}
          </span>
        )}
      </button>

      <AnimatePresence>
        {abierto && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="fixed bottom-24 right-5 z-50 flex h-[min(34rem,calc(100vh-8rem))]
                       w-[min(24rem,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-xl
                       border border-stroke-soft bg-surface shadow-2xl"
          >
            {/* Cabecera del panel */}
            <div className="flex items-center gap-2 bg-linear-to-r from-brand to-accent px-3 py-2.5 text-white">
              {(activa || nueva) && (
                <button
                  type="button"
                  onClick={() => (nueva ? setNueva(false) : setActiva(null))}
                  aria-label="Volver"
                  className="grid h-7 w-7 place-items-center rounded-md hover:bg-white/15"
                >
                  <ArrowLeft size={16} />
                </button>
              )}
              <p className="min-w-0 flex-1 truncate text-sm font-semibold">
                {tituloPanel}
              </p>
              {!activa && !nueva && (
                <button
                  type="button"
                  onClick={() => setNueva(true)}
                  aria-label="Nuevo mensaje"
                  className="grid h-7 w-7 place-items-center rounded-md hover:bg-white/15"
                >
                  <Plus size={16} />
                </button>
              )}
              <button
                type="button"
                onClick={irACompleto}
                aria-label="Abrir en pantalla completa"
                title="Abrir en pantalla completa"
                className="grid h-7 w-7 place-items-center rounded-md hover:bg-white/15"
              >
                <Maximize2 size={15} />
              </button>
              <button
                type="button"
                onClick={() => setAbierto(false)}
                aria-label="Cerrar"
                className="grid h-7 w-7 place-items-center rounded-md hover:bg-white/15"
              >
                <X size={16} />
              </button>
            </div>

            {/* Cuerpo */}
            <div className="min-h-0 flex-1">
              {nueva ? (
                <div className="h-full overflow-y-auto p-4 scrollbar-slim">
                  <NewConversationForm
                    onCreated={(convId) => {
                      setNueva(false);
                      setActiva(convId);
                      cargar();
                    }}
                    onCancel={() => setNueva(false)}
                  />
                </div>
              ) : activa ? (
                <MessageThread
                  key={activa}
                  conversationId={activa}
                  onBack={() => setActiva(null)}
                  onChanged={cargar}
                />
              ) : (
                <ConversationList
                  conversations={conversaciones}
                  activeId={null}
                  onSelect={setActiva}
                  onNew={() => setNueva(true)}
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatWidget;
