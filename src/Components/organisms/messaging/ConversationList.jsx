import { useMemo, useState } from 'react';
import { Plus, Search, Users } from 'lucide-react';

import EmployeeAvatar from '../../molecules/EmployeeAvatar';
import { fieldClasses } from '../../atoms/fieldClasses';

const horaCorta = (v) => {
  if (!v) return '';
  const f = new Date(v);
  if (Number.isNaN(f.getTime())) return '';
  const hoy = new Date();
  const mismoDia = f.toDateString() === hoy.toDateString();
  return mismoDia
    ? f.toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit' })
    : f.toLocaleDateString('es-CR', { day: '2-digit', month: 'short' });
};

/**
 * Bandeja de conversaciones.
 *
 * @param {Array} conversations
 * @param {number|null} activeId
 * @param {(id:number)=>void} onSelect
 * @param {()=>void} onNew
 */
const ConversationList = ({ conversations = [], activeId, onSelect, onNew }) => {
  const [q, setQ] = useState('');

  const filtradas = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return conversations;
    return conversations.filter((c) =>
      (c.title ?? '').toLowerCase().includes(t)
    );
  }, [conversations, q]);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-stroke-soft p-3">
        <div className="relative flex-1">
          <Search
            size={15}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
          />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar conversación…"
            className={fieldClasses({ className: 'h-9 pl-9' })}
          />
        </div>
        <button
          type="button"
          onClick={onNew}
          aria-label="Nuevo mensaje"
          title="Nuevo mensaje"
          className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-brand text-white
                     transition-colors hover:bg-brand-hover"
        >
          <Plus size={17} />
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto scrollbar-slim">
        {filtradas.length === 0 ? (
          <p className="p-6 text-center text-sm text-ink-muted">
            {conversations.length === 0
              ? 'No tienes conversaciones. Empieza una con el botón +.'
              : 'Sin coincidencias.'}
          </p>
        ) : (
          <ul className="divide-y divide-stroke-soft">
            {filtradas.map((c) => {
              const activa = c.conversationId === activeId;
              const preview = c.lastMessage
                ? c.lastMessage.deleted
                  ? 'Mensaje eliminado'
                  : `${c.lastMessage.mine ? 'Tú: ' : ''}${c.lastMessage.body ?? ''}`
                : 'Sin mensajes todavía';

              return (
                <li key={c.conversationId}>
                  <button
                    type="button"
                    onClick={() => onSelect(c.conversationId)}
                    className={`flex w-full items-center gap-3 px-3 py-3 text-left transition-colors
                                ${activa ? 'bg-brand-tint' : 'hover:bg-canvas'}`}
                  >
                    {c.isGroup ? (
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-tint text-brand">
                        <Users size={18} />
                      </span>
                    ) : (
                      <EmployeeAvatar employee={c.other} size="sm" />
                    )}

                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-2">
                        <span className="truncate text-sm font-semibold text-ink">
                          {c.title || 'Conversación'}
                        </span>
                        <span className="shrink-0 text-[11px] text-ink-muted">
                          {horaCorta(c.lastMessageAt)}
                        </span>
                      </span>
                      <span className="mt-0.5 flex items-center justify-between gap-2">
                        <span className="truncate text-xs text-ink-muted">
                          {preview}
                        </span>
                        {c.unread > 0 && (
                          <span className="grid h-5 min-w-5 shrink-0 place-items-center rounded-full bg-brand px-1 text-[11px] font-bold text-white">
                            {c.unread > 99 ? '99+' : c.unread}
                          </span>
                        )}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ConversationList;
