import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';

const formatDate = (dateString) => {
  if (!dateString) return '—';

  return new Date(dateString).toLocaleDateString('es-CR', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });
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

const AwardTable = ({ awards = [] }) => {
  if (!awards.length) {
    return (
      <p className="text-center text-ink-muted py-6">
        No hay reconocimientos registrados.
      </p>
    );
  }

  return (
    <motion.table
      variants={tableVariants}
      initial="hidden"
      animate="visible"
      className="min-w-full border border-stroke-soft rounded-xl overflow-hidden shadow-sm"
    >
      <thead className="bg-surface-alt text-ink-secondary text-sm">
        <tr>
          <th className="p-3 text-left">Título</th>
          <th className="p-3 text-left">Descripción</th>
          <th className="p-3 text-left">Fecha</th>
          <th className="p-3 text-left">Creado por</th>
        </tr>
      </thead>

      <motion.tbody variants={tableVariants} className="text-sm">
        {awards.map((award) => (
          <motion.tr
            key={award.awardId}
            variants={rowVariants}
            whileHover={{ backgroundColor: '#f8fafc' }}
            className="border-b"
          >
            <td className="p-3 font-medium text-ink">{award.title}</td>

            <td className="p-3 text-ink-muted">{award.description || '—'}</td>

            <td className="p-3 flex items-center gap-2 text-ink-muted whitespace-nowrap">
              <Calendar size={14} />
              {formatDate(award.createdAt)}
            </td>

            <td className="p-3 text-ink-muted">{award.createdBy || '—'}</td>
          </motion.tr>
        ))}
      </motion.tbody>
    </motion.table>
  );
};

export default AwardTable;
