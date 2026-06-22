import { format } from 'date-fns';
import { Pencil, Trash2, MessageSquare } from 'lucide-react';
import IconButton from '../IconButton';

const formatDate = (date) => {
  if (!date) return '—';
  const d = new Date(date);
  if (isNaN(d)) return '—';
  return format(d, 'dd/MM/yyyy');
};

const AnswersTable = ({ answers = [], onEdit, onDelete }) => {
  if (!answers.length) {
    return (
      <div className="bg-surface border border-stroke-soft rounded-xl p-8 text-center text-ink-muted">
        No hay respuestas registradas
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-surface border border-stroke-soft rounded-xl shadow-sm">
      <table className="min-w-full text-sm">
        <thead className="bg-surface-alt text-ink-secondary">
          <tr>
            <th className="px-4 py-3 text-left font-semibold flex items-center gap-2">
              <MessageSquare size={16} /> Respuesta
            </th>
            <th className="px-4 py-3 text-left font-semibold">Fecha</th>
            <th className="px-4 py-3 text-center font-semibold">Estado</th>
            <th className="px-4 py-3 text-center font-semibold">Acciones</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-stroke-soft">
          {answers.map((item) => (
            <tr
              key={item.answerId}
              className="hover:bg-canvas transition-colors"
            >
              <td className="px-4 py-3 text-ink max-w-md">
                <p className="line-clamp-2">{item.text || '—'}</p>
              </td>

              <td className="px-4 py-3 text-ink-muted">
                {formatDate(item.createdAt)}
              </td>

              <td className="px-4 py-3 text-center">
                {item.deleted ? (
                  <span className="px-2 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700">
                    Eliminada
                  </span>
                ) : (
                  <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700">
                    Activa
                  </span>
                )}
              </td>

              <td className="px-4 py-3">
                <div className="flex justify-center gap-2">
                  <IconButton
                    icon={Pencil}
                    variant="primary"
                    size={16}
                    onClick={() => onEdit?.(item)}
                    title="Editar"
                  />

                  <IconButton
                    icon={Trash2}
                    variant="danger"
                    size={16}
                    onClick={() => onDelete?.(item)}
                    title="Eliminar"
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AnswersTable;