import { motion } from 'framer-motion';
import { Calendar, CheckCircle, XCircle } from 'lucide-react';

const formatDate = (date) => {
  if (!date) return '—';
  if (date.startsWith('0001-01-01')) return '—';
  return new Date(date).toLocaleDateString('es-CR');
};

const ExtraTable = ({ extras = [] }) => {
  if (!extras.length) {
    return (
      <p className="text-gray-500 text-sm text-center">
        No hay extras registrados.
      </p>
    );
  }

  return (
    <motion.table
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mx-auto w-full max-w-6xl border-collapse rounded-xl overflow-hidden shadow"
    >
      <thead className="bg-slate-800 text-white text-sm">
        <tr>
          <th className="p-3 text-left">ID</th>
          <th className="p-3 text-left">Tipo</th>
          <th className="p-3 text-left">Inicio</th>
          <th className="p-3 text-left">Fin</th>
          <th className="p-3 text-left">Monto</th>
          <th className="p-3 text-left">Notas</th>
          <th className="p-3 text-center">Estado</th>
          <th className="p-3 text-left">Creado por</th>
          <th className="p-3 text-left">Última edición</th>
        </tr>
      </thead>

      <tbody className="text-sm">
        {extras.map((e) => (
          <motion.tr
            key={e.extraId}
            whileHover={{ backgroundColor: '#f8fafc' }}
            className={`border-b ${
              e.isDeleted ? 'opacity-50' : ''
            }`}
          >
            <td className="p-3">{e.extraId}</td>

            <td className="p-3">
              {e.extraType?.name || '—'}
            </td>

            <td className="p-3 flex items-center gap-2">
              <Calendar size={14} />
              {formatDate(e.start)}
            </td>

            <td className="p-3 flex items-center gap-2">
              <Calendar size={14} />
              {formatDate(e.end)}
            </td>

            <td className="p-3 font-medium">
              ₡{Number(e.amount).toLocaleString('es-CR')}
            </td>

            <td className="p-3">
              {e.notes || '—'}
            </td>

            <td className="p-3 text-center">
              {e.isAproved ? (
                <CheckCircle
                  size={18}
                  className="text-green-600 mx-auto"
                />
              ) : (
                <XCircle
                  size={18}
                  className="text-yellow-500 mx-auto"
                />
              )}
            </td>

            <td className="p-3">
              {e.createdBy || '—'}
            </td>

            <td className="p-3">
              {formatDate(e.updatedAt)}
            </td>
          </motion.tr>
        ))}
      </tbody>
    </motion.table>
  );
};

export default ExtraTable;
