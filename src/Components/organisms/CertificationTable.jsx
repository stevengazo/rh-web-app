import { motion } from "framer-motion";
import { Award, Calendar, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";

const formatDate = (dateString) => {
  if (!dateString) return "—";
  return format(new Date(dateString), "dd/MM/yyyy");
};

const tableVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.05 },
  },
};

const CertificationTable = ({ certifications = [], onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto">
      <motion.table
        variants={tableVariants}
        initial="hidden"
        animate="visible"
        className="min-w-full border border-gray-200 rounded-xl overflow-hidden shadow-sm"
      >
        <thead className="bg-slate-800">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold text-white flex items-center gap-2">
              <Award size={16} /> Certificación
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-white">
              Título
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-white">
              <div className="flex items-center gap-2">
                <Calendar size={16} /> Expira
              </div>
            </th>
            <th className="px-4 py-3 text-center text-sm font-semibold text-white">
              Acciones
            </th>
          </tr>
        </thead>

        <motion.tbody className="divide-y">
          {certifications.length === 0 && (
            <tr>
              <td
                colSpan={4}
                className="px-4 py-6 text-center text-sm text-gray-500"
              >
                No hay certificaciones registradas
              </td>
            </tr>
          )}

          {certifications.map((item) => (
            <tr
              key={item.id}
             
              className="text-sm"
            >
              <td className="px-4 py-3 font-medium text-gray-800">
                {item.name}
              </td>
              <td className="px-4 py-3 text-gray-600">
                {item.title}
              </td>
              <td className="px-4 py-3 text-gray-600">
                {formatDate(item.expirationDate)}
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

export default CertificationTable;