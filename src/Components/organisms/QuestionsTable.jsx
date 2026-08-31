import { ListChecks, Pencil, Trash2, UserPlus } from 'lucide-react';

import RowActionButton from '../molecules/RowActionButton';

const EstadoBadge = ({ activo }) => (
  <span
    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
      activo
        ? 'border-green-200 bg-green-50 text-green-700'
        : 'border-stroke bg-surface-alt text-ink-secondary'
    }`}
  >
    {activo ? 'Activa' : 'Inactiva'}
  </span>
);

/**
 * Tabla de preguntas de desempeño.
 *
 * @param {Array} Questions
 * @param {(q:object)=>void} [onEdit]
 * @param {(q:object)=>void} [onDelete]
 * @param {(q:object)=>void} [onAssign]
 */
const QuestionsTable = ({ Questions = [], onEdit, onDelete, onAssign }) => {
  if (!Questions.length) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-stroke bg-surface-alt py-14 text-ink-muted">
        <ListChecks size={28} />
        <p className="text-sm font-medium">Aún no hay preguntas</p>
      </div>
    );
  }

  const conAcciones = Boolean(onEdit || onDelete || onAssign);

  return (
    <div className="overflow-x-auto rounded-xl border border-stroke-soft shadow-sm">
      <table className="min-w-full">
        <thead className="bg-surface-alt text-ink-secondary">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold">Pregunta</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Categoría</th>
            <th className="px-4 py-3 text-center text-sm font-semibold">Asignadas</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Estado</th>
            {conAcciones && (
              <th className="px-4 py-3 text-center text-sm font-semibold">Acciones</th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-stroke-soft bg-surface">
          {Questions.map((q) => (
            <tr key={q.questionId} className="transition-colors hover:bg-canvas">
              <td className="px-4 py-3 text-sm text-ink">{q.text}</td>
              <td className="px-4 py-3 text-sm text-ink-secondary">
                {q.questionCategory?.name ?? '—'}
              </td>
              <td className="px-4 py-3 text-center text-sm text-ink-secondary">
                {q.assignedCount ?? 0}
              </td>
              <td className="px-4 py-3">
                <EstadoBadge activo={q.isActive} />
              </td>
              {conAcciones && (
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-1">
                    {onAssign && (
                      <RowActionButton
                        icon={UserPlus}
                        label="Asignar a un colaborador"
                        tono="brand"
                        onClick={() => onAssign(q)}
                      />
                    )}
                    {onEdit && (
                      <RowActionButton
                        icon={Pencil}
                        label="Editar"
                        tono="brand"
                        onClick={() => onEdit(q)}
                      />
                    )}
                    {onDelete && (
                      <RowActionButton
                        icon={Trash2}
                        label="Eliminar"
                        tono="danger"
                        onClick={() => onDelete(q)}
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

export default QuestionsTable;
