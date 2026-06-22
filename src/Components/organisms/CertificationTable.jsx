import { motion } from 'framer-motion';
import { Award, Calendar, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import IconButton from '../IconButton';

const formatDate = (dateString) => {
  if (!dateString) return '—';
  return format(new Date(dateString), 'dd/MM/yyyy');
};

const tableVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.05 },
  },
};

const CertificationTable = ({ certifications = [], OnEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto">
      <motion.table
        variants={tableVariants}
        initial="hidden"
        animate="visible"
        className="min-w-full border border-stroke-soft rounded-xl overflow-hidden shadow-sm"
      >
        <thead className="bg-surface-alt text-ink-secondary">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold text-ink-secondary flex items-center gap-2">
              <Award size={16} /> Certificación
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-ink-secondary">
              Título
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-ink-secondary">
              <div className="flex items-center gap-2">
                <Calendar size={16} /> Expira
              </div>
            </th>
            <th className="px-4 py-3 text-center text-sm font-semibold text-ink-secondary">
              Acciones
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-stroke-soft">
          {certifications.length === 0 && (
            <tr>
              <td
                colSpan={4}
                className="px-4 py-6 text-center text-sm text-ink-muted"
              >
                No hay certificaciones registradas
              </td>
            </tr>
          )}

          {certifications.map((item, index) => (
            <tr key={index} className="text-sm hover:bg-canvas transition-colors">
              <td className="px-4 py-3 font-medium text-ink">
                {item.name}
              </td>
              <td className="px-4 py-3 text-ink-muted">{item.title}</td>
              <td className="px-4 py-3 text-ink-muted">
                {formatDate(item.expirationDate)}
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-center gap-2">
                  <IconButton
                    icon={Pencil}
                    onClick={() => OnEdit?.(item)}
                    variant="primary"
                    size={16}
                    title="Editar"
                  />
                  <IconButton
                    icon={Trash2}
                    onClick={() => onDelete?.(item)}
                    variant="danger"
                    size={16}
                    title="Eliminar"
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </motion.table>
    </div>
  );
};

export default CertificationTable;
