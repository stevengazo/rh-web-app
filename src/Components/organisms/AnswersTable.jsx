import { format } from 'date-fns';
import { Pencil, Trash2, MessageSquare } from 'lucide-react';

const formatDate = (date) => {
  if (!date) return '—';
  const d = new Date(date);
  if (isNaN(d)) return '—';
  return format(d, 'dd/MM/yyyy');
};

const AnswersTable = ({ answers = [], onEdit, onDelete }) => {
  if (!answers.length) {
    return (
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-8 text-center text-gray-400">
        No hay respuestas registradas
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-gray-900 border border-gray-700 rounded-xl shadow-sm">
      <table className="min-w-full text-sm text-gray-300">
        <thead className="bg-gray-800 text-gray-200">
          <tr>
            <th className="px-4 py-3 text-left font-semibold flex items-center gap-2">
              <MessageSquare size={16} /> Respuesta
            </th>
            <th className="px-4 py-3 text-left font-semibold">Fecha</th>
            <th className="px-4 py-3 text-center font-semibold">Estado</th>
            <th className="px-4 py-3 text-center font-semibold">Acciones</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-800">
          {answers.map((item) => (
            <tr
              key={item.answerId}
              className="hover:bg-gray-800/50 transition"
            >
              <td className="px-4 py-3 text-gray-300 max-w-md">
                <p className="line-clamp-2">{item.text || '—'}</p>
              </td>

              <td className="px-4 py-3 text-gray-400">
                {formatDate(item.createdAt)}
              </td>

              <td className="px-4 py-3 text-center">
                {item.deleted ? (
                  <span className="px-2 py-1 rounded-full text-xs font-semibold bg-red-900/40 text-red-400 border border-red-800">
                    Eliminada
                  </span>
                ) : (
                  <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-900/40 text-green-400 border border-green-800">
                    Activa
                  </span>
                )}
              </td>

              <td className="px-4 py-3">
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => onEdit?.(item)}
                    className="p-2 rounded-lg hover:bg-blue-900/40 text-blue-400 transition"
                    title="Editar"
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    onClick={() => onDelete?.(item)}
                    className="p-2 rounded-lg hover:bg-red-900/40 text-red-400 transition"
                    title="Eliminar"
                  >
                    <Trash2 size={16} />
                  </button>
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