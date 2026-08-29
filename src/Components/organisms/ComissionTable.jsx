import { motion } from 'framer-motion';
import { Calendar, CheckCircle, XCircle } from 'lucide-react';
import RowActionButton from '../molecules/RowActionButton';
import { Eye } from 'lucide-react';

const formatDate = (date) => {
  if (!date) return '—';
  if (date.startsWith('0001-01-01')) return '—';
  return new Date(date).toLocaleDateString('es-CR');
};

const tableVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.03,
    },
  },
};

const rowVariants = {
  hidden: { opacity: 0, y: 6 },
  visible: { opacity: 1, y: 0 },
};

const ComissionTable = ({ comissions = [], onView }) => {
  if (!comissions.length) {
    return (
      <p className="text-ink-muted text-sm text-center">
        No hay comisiones registradas.
      </p>
    );
  }

  return (
    <motion.table
      variants={tableVariants}
      initial="hidden"
      animate="visible"
      className="mx-auto w-full max-w-6xl border-collapse rounded-xl overflow-hidden shadow"
    >
      <thead className="bg-surface-alt text-ink-secondary text-sm">
        <tr>
          <th className="p-3 text-left">ID</th>
          <th className="p-3 text-left">Fecha</th>
          <th className="p-3 text-left">Monto</th>
          <th className="p-3 text-left">Descripción</th>
          <th className="p-3 text-center">Estado</th>
          <th className="p-3 text-left">Creado por</th>
          <th className="p-3 text-left">Última edición</th>
          <th className="p-3 text-center">Acciones</th>
        </tr>
      </thead>

      <motion.tbody variants={tableVariants} className="text-sm">
        {comissions.map((c) => (
          <tr
            key={c.comissionId}
            variants={rowVariants}
            className="border-b border-stroke-soft transition-colors hover:bg-canvas"
          >
            <td className="p-3">{c.comissionId}</td>

            <td className="p-3 flex items-center gap-2">
              <Calendar size={14} />
              {formatDate(c.date)}
            </td>

            <td className="p-3 font-medium">
              ₡{Number(c.amount).toLocaleString('es-CR')}
            </td>

            <td className="p-3">{c.description || '—'}</td>

            <td className="p-3 text-center">
              {c.draft ? (
                <XCircle size={18} className="text-yellow-500 mx-auto" />
              ) : (
                <CheckCircle size={18} className="text-green-600 mx-auto" />
              )}
            </td>

            <td className="p-3">{c.createdBy || '—'}</td>

            <td className="p-3">{formatDate(c.lastEditedAt)}</td>

            <td className="p-3">
              <div className="flex justify-center">
                <RowActionButton
                  icon={Eye}
                  label="Ver detalle"
                  tono="brand"
                  onClick={() => onView?.(c)}
                />
              </div>
            </td>
          </tr>
        ))}
      </motion.tbody>
    </motion.table>
  );
};

export default ComissionTable;
