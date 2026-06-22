import { motion } from 'framer-motion';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import EmployeeEdit from './EmployeeEdit';
import IconButton from '../IconButton';

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

const EmployeesTable = ({ employees = [], HandleShowEdit }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="bg-surface rounded-xl shadow-sm border border-stroke-soft"
    >
      <div className="overflow-x-auto">
        <motion.table
          variants={tableVariants}
          initial="hidden"
          animate="visible"
          className="w-full text-sm"
        >
          <thead className="bg-surface-alt text-ink-secondary text-sm">
            <tr>
              <th className="px-6 py-3 text-left font-medium">Nombre</th>
              <th className="px-6 py-3 text-left font-medium">Apellido</th>
              <th className="px-6 py-3 text-left font-medium">Email</th>
              <th className="px-6 py-3 text-left font-medium">Departamento</th>
              <th className="px-6 py-3 text-center font-medium">Acciones</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {employees.map((emp) => (
              <motion.tr
                key={emp.id}
                whileHover={{ backgroundColor: '#f8fafc' }}
                className="transition"
              >
                <td className="px-6 py-3 font-medium">{emp.firstName}</td>

                <td className="px-6 py-3">{emp.lastName}</td>

                <td className="px-6 py-3 text-ink-muted">{emp.email}</td>

                <td className="px-6 py-3 text-ink-muted">
                  {emp.departament?.name || '—'}
                </td>

                <td className="px-6 py-3">
                  <div className="flex justify-center gap-2">
                    <IconButton
                      icon={Eye}
                      onClick={() => navigate(`/manager/employees/${emp.id}`)}
                    />

                    <IconButton
                      icon={Edit}
                      variant="primary"
                      onClick={() =>
                        HandleShowEdit(
                          'Editar Usuario',
                          <EmployeeEdit employee={emp} />
                        )
                      }
                    />


                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </motion.table>
      </div>
    </motion.div>
  );
};

export default EmployeesTable;
