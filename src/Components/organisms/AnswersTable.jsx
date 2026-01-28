import { format } from "date-fns";
import { Pencil, Trash2, MessageSquare } from "lucide-react";

const formatDate = (date) => {
  if (!date) return "—";
  const d = new Date(date);
  if (isNaN(d)) return "—";
  return format(d, "dd/MM/yyyy");
};

const AnswersTable = ({ answers = [], onEdit, onDelete }) => {
  if (!answers.length) {
    return (
      <div className="bg-white border rounded-xl p-6 text-center text-gray-500">
        No hay respuestas registradas
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white border rounded-xl shadow-sm">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-800 text-white">
          <tr>
            <th className="px-4 py-3 text-left font-semibold flex items-center gap-2">
              <MessageSquare size={16} /> Respuesta
            </th>
            <th className="px-4 py-3 text-left font-semibold">
              Fecha
            </th>
            <th className="px-4 py-3 text-center font-semibold">
              Estado
            </th>
            <th className="px-4 py-3 text-center font-semibold">
              Acciones
            </th>
          </tr>
        </thead>

        <tbody className="divide-y">
          {answers.map((item) => (
            <tr key={item.answerId}>
              <td className="px-4 py-3 text-gray-700 max-w-md">
                <p className="line-clamp-2">{item.text || "—"}</p>
              </td>

              <td className="px-4 py-3 text-gray-600">
                {formatDate(item.createdAt)}
              </td>

              <td className="px-4 py-3 text-center">
                {item.deleted ? (
                  <span className="px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                    Eliminada
                  </span>
                ) : (
                  <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                    Activa
                  </span>
                )}
              </td>

              <td className="px-4 py-3">
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => onEdit?.(item)}
                    className="p-2 rounded-lg hover:bg-blue-50 text-blue-600"
                    title="Editar"
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    onClick={() => onDelete?.(item)}
                    className="p-2 rounded-lg hover:bg-red-50 text-red-600"
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
