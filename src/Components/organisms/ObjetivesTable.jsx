import { Pencil, Target, Trash2 } from 'lucide-react';

import RowActionButton from '../molecules/RowActionButton';

const EstadoBadge = ({ activo }) => (
  <span
    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
      activo
        ? 'border-green-200 bg-green-50 text-green-700'
        : 'border-stroke bg-surface-alt text-ink-secondary'
    }`}
  >
    {activo ? 'Activo' : 'Inactivo'}
  </span>
);

/**
 * Tabla de objetivos (KPIs).
 *
 * @param {Array} objetives
 * @param {(o:object)=>void} [onEdit]
 * @param {(o:object)=>void} [onDelete]
 * @param {(o:object)=>void} [onAssign]
 */
const ObjetivesTable = ({ objetives = [], onEdit, onDelete, onAssign }) => {
  if (!objetives.length) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-stroke bg-surface-alt py-14 text-ink-muted">
        <Target size={28} />
        <p className="text-sm font-medium">Aún no hay objetivos</p>
      </div>
    );
  }

  const conAcciones = Boolean(onEdit || onDelete || onAssign);

  return (
    <div className="overflow-x-auto rounded-xl border border-stroke-soft shadow-sm">
      <table className="min-w-full">
        <thead className="bg-surface-alt text-ink-secondary">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold">Objetivo</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Categoría</th>
            <th className="px-4 py-3 text-center text-sm font-semibold">Asignados</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Estado</th>
            {conAcciones && (
              <th className="px-4 py-3 text-center text-sm font-semibold">Acciones</th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-stroke-soft bg-surface">
          {objetives.map((o) => (
            <tr key={o.objetiveId} className="transition-colors hover:bg-canvas">
              <td className="px-4 py-3 text-sm">
                <p className="font-medium text-ink">{o.title}</p>
                {o.description && (
                  <p className="max-w-md truncate text-xs text-ink-muted">
                    {o.description}
                  </p>
                )}
              </td>
              <td className="px-4 py-3 text-sm text-ink-secondary">
                {o.category?.name ?? '—'}
              </td>
              <td className="px-4 py-3 text-center text-sm text-ink-secondary">
                {o.assignedCount ?? 0}
              </td>
              <td className="px-4 py-3">
                <EstadoBadge activo={o.isActive} />
              </td>
              {conAcciones && (
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-1">
                    {onAssign && (
                      <RowActionButton
                        icon={Target}
                        label="Asignar a un colaborador"
                        tono="brand"
                        onClick={() => onAssign(o)}
                      />
                    )}
                    {onEdit && (
                      <RowActionButton
                        icon={Pencil}
                        label="Editar"
                        tono="brand"
                        onClick={() => onEdit(o)}
                      />
                    )}
                    {onDelete && (
                      <RowActionButton
                        icon={Trash2}
                        label="Eliminar"
                        tono="danger"
                        onClick={() => onDelete(o)}
                      />
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ObjetivesTable;
