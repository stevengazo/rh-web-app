import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { BookOpen, Clock, School, Pencil, Trash2 } from 'lucide-react';

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

const CourseTable = ({ courses = [], OnEdit, onDelete }) => {

 // console.log(courses)
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
      <motion.table
        variants={tableVariants}
        initial="hidden"
        animate="visible"
        className="min-w-[600px] w-full bg-white"
      >
        <thead className="bg-slate-800">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold text-white">
              <div className="flex items-center gap-2">
                <BookOpen size={16} />
                Curso
              </div>
            </th>

            <th className="px-4 py-3 text-left text-sm font-semibold text-white">
              <div className="flex items-center gap-2">
                <School size={16} />
                Plataforma
              </div>
            </th>

            <th className="px-4 py-3 text-left text-sm font-semibold text-white">
              <div className="flex items-center gap-2">
                <Clock size={16} />
                Duración
              </div>
            </th>

            <th className="px-4 py-3 text-center text-sm font-semibold text-white">
              Acciones
            </th>
          </tr>
        </thead>

        <tbody className="divide-y">
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

          {courses.map((item, index) => (
            <motion.tr
              key={index}
              className="text-sm hover:bg-gray-50 transition"
            >
              <td className="px-4 py-3 font-medium text-gray-800">
                {item.name}
              </td>

              <td className="px-4 py-3 text-gray-600">{item.institution}</td>

              <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                {formatDate(item.start)} – {formatDate(item.end)}
              </td>

              <td className="px-4 py-3">
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => OnEdit?.(item)}
                    className="p-2 rounded-lg hover:bg-blue-50 text-blue-600"
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    onClick={() => onDelete?.(item)}
                    className="p-2 rounded-lg hover:bg-red-50 text-red-600"
                  >
                    <Trash2 size={16} />
                  </button>
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
