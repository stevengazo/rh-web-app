import { motion } from 'framer-motion';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import EmployeeEdit from './EmployeeEdit';

const tableVariants = {
  hidden: { opacity: 0, y: 12 },
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

const EmployeesTable = ({ employees = [], HandleShowEdit }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="bg-white rounded-xl shadow-sm border border-slate-200"
    >
      <div className="overflow-x-auto">
        <motion.table
          variants={tableVariants}
          initial="hidden"
          animate="visible"
          className="w-full text-sm"
        >
          <thead className="bg-slate-800 text-white text-sm">
            <tr>
              <th className="px-6 py-3 text-left font-medium">Nombre</th>
              <th className="px-6 py-3 text-left font-medium">Apellido</th>
              <th className="px-6 py-3 text-left font-medium">Email</th>
              <th className="px-6 py-3 text-left font-medium">Departamento</th>
              <th className="px-6 py-3 text-center font-medium">Acciones</th>
            </tr>
          </thead>

          <motion.tbody
            variants={tableVariants}
            className="divide-y"
          >
            {employees.map((emp) => (
              <motion.tr
                key={emp.id}
                variants={rowVariants}
                whileHover={{ backgroundColor: '#f8fafc' }}
                className="transition"
              >
                <td className="px-6 py-3 font-medium">
                  {emp.firstName}
                </td>

                <td className="px-6 py-3">
                  {emp.lastName}
                </td>

                <td className="px-6 py-3 text-slate-600">
                  {emp.email}
                </td>

                <td className="px-6 py-3 text-slate-600">
                  {emp.departament?.name || '—'}
                </td>

                <td className="px-6 py-3">
                  <div className="flex justify-center gap-2">
                    <button
                      className="p-1.5 rounded hover:bg-slate-200"
                      onClick={() =>
                        navigate(`/manager/employees/${emp.id}`)
                      }
                    >
                      <Eye size={16} />
                    </button>

                    <button
                      className="p-1.5 rounded hover:bg-slate-200"
                      onClick={() =>
                        HandleShowEdit(
                          'Editar Usuario',
                          <EmployeeEdit employee={emp} />
                        )
                      }
                    >
                      <Edit size={16} />
                    </button>

                    <button
                      className="p-1.5 rounded text-red-500 hover:bg-red-100"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </motion.tbody>
        </motion.table>
      </div>
    </motion.div>
  );
};

export default EmployeesTable;
