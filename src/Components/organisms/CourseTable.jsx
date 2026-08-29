import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { BookOpen, Clock, School, Pencil, Trash2 } from 'lucide-react';
import IconButton from '../IconButton';
import RowActionButton from '../molecules/RowActionButton';
import { Eye } from 'lucide-react';

const formatDate = (date) => {
  if (!date) return '';
  return format(new Date(date), 'dd/MM/yyyy');
};

const tableVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.04 },
  },
};

const CourseTable = ({ courses = [], OnEdit, onDelete, onView }) => {

 // console.log(courses)
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-stroke-soft shadow-sm">
      <motion.table
        variants={tableVariants}
        initial="hidden"
        animate="visible"
        className="min-w-[600px] w-full bg-surface"
      >
        <thead className="bg-surface-alt text-ink-secondary">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold text-ink-secondary">
              <div className="flex items-center gap-2">
                <BookOpen size={16} />
                Curso
              </div>
            </th>

            <th className="px-4 py-3 text-left text-sm font-semibold text-ink-secondary">
              <div className="flex items-center gap-2">
                <School size={16} />
                Plataforma
              </div>
            </th>

            <th className="px-4 py-3 text-left text-sm font-semibold text-ink-secondary">
              <div className="flex items-center gap-2">
                <Clock size={16} />
                Duración
              </div>
            </th>

            <th className="px-4 py-3 text-center text-sm font-semibold text-ink-secondary">
              Acciones
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-stroke-soft">
          {courses.length === 0 && (
            <tr>
              <td
                colSpan={4}
                className="px-4 py-6 text-center text-sm text-ink-muted"
              >
                No hay cursos registrados
              </td>
            </tr>
          )}

          {courses.map((item, index) => (
            <motion.tr
              key={index}
              className="text-sm hover:bg-canvas transition-colors"
            >
              <td className="px-4 py-3 font-medium text-ink">
                {item.name}
              </td>

              <td className="px-4 py-3 text-ink-muted">{item.institution}</td>

              <td className="px-4 py-3 text-ink-muted whitespace-nowrap">
                {formatDate(item.start)} – {formatDate(item.end)}
              </td>

              <td className="px-4 py-3">
                <div className="flex justify-center gap-1">
                  <RowActionButton
                    icon={Eye}
                    label="Ver detalle"
                    tono="brand"
                    onClick={() => onView?.(item)}
                  />

                  <IconButton
                    icon={Pencil}
                    onClick={() => OnEdit?.(item)}
                    variant="primary"
                    size={16}
                  />

                  <IconButton
                    icon={Trash2}
                    onClick={() => onDelete?.(item)}
                    variant="danger"
                    size={16}
                  />
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </motion.table>
    </div>
  );
};

export default CourseTable;
