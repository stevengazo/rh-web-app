import { motion } from 'framer-motion';
import { format } from 'date-fns';

const formatDate = (date) => {
  if (!date) return '';
  return format(new Date(date), 'dd/MM/yyyy');
};

import {
  BookOpen,
  Clock,
  School,
  MoreVertical,
  Pencil,
  Trash2,
} from 'lucide-react';

const tableVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.02 },
  },
};

const CourseTable = ({ courses = [], onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto">
      <motion.table
        variants={tableVariants}
        initial="hidden"
        animate="visible"
        className="min-w-full border border-gray-200 rounded-xl overflow-hidden shadow-sm"
      >
        <thead className="bg-slate-800 ">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold text-white flex items-center gap-2">
              <BookOpen size={16} /> Curso
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-white">
              <div className="flex items-center gap-2">
                <School size={16} /> Plataforma
              </div>
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-white">
              <div className="flex items-center gap-2">
                <Clock size={16} /> Duración
              </div>
            </th>
            <th className="px-4 py-3 text-center text-sm font-semibold text-white">
              Acciones
            </th>
          </tr>
        </thead>

        <motion.tbody className="divide-y">
          {courses.length === 0 && (
            <tr>
              <td
                colSpan={4}
                className="px-4 py-6 text-center text-sm text-gray-500"
              >
                No hay cursos registrados
              </td>
            </tr>
          )}

          {courses.map((item) => (
            <tr key={item.id} className="text-sm">
              <td className="px-4 py-3 font-medium text-gray-800">
                {item.name}
              </td>
              <td className="px-4 py-3 text-gray-600">{item.institution}</td>
              <td className="px-4 py-3 text-gray-600">
                {formatDate(item.start)} – {formatDate(item.end)}
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
        </motion.tbody>
      </motion.table>
    </div>
  );
};

export default CourseTable;
