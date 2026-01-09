import { motion } from 'framer-motion';
import { Calendar, CheckCircle, XCircle, Pencil, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

const formatDate = (dateString) => {
  if (!dateString) return '—';
  return format(new Date(dateString), 'dd/MM/yyyy');
};

const ActionTable = ({ actions = [], onEdit, onDelete }) => {
  return (
    <motion.table
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mx-auto w-full max-w-5xl border-collapse rounded-xl overflow-hidden shadow"
    >
      <thead className="bg-slate-800 text-white">
        <tr>
          <th className="p-3 text-left">Fecha</th>
          <th className="p-3 text-left">Tipo</th>
          <th className="p-3 text-center">Aprobado</th>
          <th className="p-3 text-left">Creado</th>
          <th className="p-3 text-center">Acciones</th>
        </tr>
      </thead>

      <tbody>
        {actions.length === 0 && (
          <tr>
            <td colSpan={5} className="p-4 text-center text-slate-500">
              No hay acciones registradas
            </td>
          </tr>
        )}

        {actions.map((item) => (
          <motion.tr
            key={item.actionId}
            whileHover={{ backgroundColor: '#f8fafc' }}
            className="border-b"
          >
            <td className="p-3 flex items-center gap-2">
              <Calendar size={16} />
              {formatDate(item.actionDate)}
            </td>

            <td className="p-3">{item.actionType?.name || '—'}</td>

            <td className="p-3 text-center">
              {item.approvedBy ? (
                <CheckCircle className="text-green-600 mx-auto" size={18} />
              ) : (
                <XCircle className="text-red-500 mx-auto" size={18} />
              )}
            </td>

            <td className="p-3">{formatDate(item.createdDate)}</td>

            <td className="p-3">
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => onEdit?.(item)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() => onDelete?.(item)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </td>
          </motion.tr>
        ))}
      </tbody>
    </motion.table>
  );
};

export default ActionTable;
