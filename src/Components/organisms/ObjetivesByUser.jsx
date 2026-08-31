import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Target, Trash2 } from 'lucide-react';

import RowActionButton from '../molecules/RowActionButton';

const nombreDe = (u, fallbackId) =>
  [u?.firstName, u?.lastName].filter(Boolean).join(' ').trim() ||
  u?.userName ||
  u?.email ||
  `Colaborador ${String(fallbackId ?? '').slice(0, 6)}`;

/**
 * Objetivos agrupados por colaborador.
 *
 * @param {Array} ObjetivesByUser  `User_Objetive[]` con `user` y `objetive` embebidos.
 * @param {Array} [Employees]      Respaldo para resolver nombres si falta `user`.
 * @param {(uo:object)=>void} [onDelete]  Quita la asignación.
 */
const ObjetivesByUser = ({ ObjetivesByUser = [], Employees = [], onDelete }) => {
  const navigate = useNavigate();

  const grupos = useMemo(() => {
    const mapa = new Map();
    for (const item of ObjetivesByUser) {
      const key = String(item.userId);
      if (!mapa.has(key)) mapa.set(key, []);
      mapa.get(key).push(item);
    }
    return [...mapa.entries()];
  }, [ObjetivesByUser]);

  const nombrePorId = useMemo(
    () => new Map(Employees.map((e) => [String(e.id), e])),
    [Employees]
  );

  if (!grupos.length) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-stroke bg-surface-alt py-14 text-ink-muted">
        <Target size={28} />
        <p className="text-sm font-medium">Nadie tiene objetivos asignados todavía</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {grupos.map(([userId, items]) => {
        const user = items[0]?.user ?? nombrePorId.get(userId);
        return (
          <section
            key={userId}
            className="overflow-hidden rounded-xl border border-stroke-soft bg-surface shadow-sm"
          >
            <button
              type="button"
              onClick={() => navigate(`/manager/performance/${userId}`)}
              className="flex w-full items-center justify-between gap-3 border-b border-stroke-soft bg-surface-alt px-4 py-3 text-left transition-colors hover:bg-canvas"
            >
              <span className="font-semibold text-ink">{nombreDe(user, userId)}</span>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand">
                Ver desempeño
                <ChevronRight size={14} />
              </span>
            </button>

            <ul className="divide-y divide-stroke-soft">
              {items.map((o) => (
                <li
                  key={o.user_ObjetiveId}
                  className="flex items-start justify-between gap-3 px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-ink">
                      {o.objetive?.title || 'Sin título'}
                    </p>
                    {o.objetive?.description && (
                      <p className="max-w-lg truncate text-xs text-ink-muted">
                        {o.objetive.description}
                      </p>
                    )}
                  </div>
                  {onDelete && (
                    <RowActionButton
                      icon={Trash2}
                      label="Quitar asignación"
                      tono="danger"
                      onClick={() => onDelete(o)}
                    />
                  )}
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
};

export default ObjetivesByUser;
