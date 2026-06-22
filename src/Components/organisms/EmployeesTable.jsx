import { motion } from 'framer-motion';
import { Eye, Edit, Users } from 'lucide-react';
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

const rowVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0 },
};

const EmployeesTable = ({ employees = [], HandleShowEdit }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="overflow-hidden rounded-xl border border-stroke-soft bg-surface shadow-sm"
    >
      <div className="overflow-x-auto">
        <motion.table
          variants={tableVariants}
          initial="hidden"
          animate="visible"
          className="w-full text-sm"
        >
          <thead className="border-b border-stroke-soft bg-surface-alt text-ink-secondary">
            <tr>
              <th className="px-6 py-3 text-left font-semibold">Empleado</th>
              <th className="px-6 py-3 text-left font-semibold">Departamento</th>
              <th className="px-6 py-3 text-left font-semibold">Estado</th>
              <th className="px-6 py-3 text-center font-semibold">Acciones</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-stroke-soft">
            {employees.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-ink-muted">
                  <div className="flex flex-col items-center gap-2">
                    <Users size={28} />
                    <span>No se encontraron empleados.</span>
                  </div>
                </td>
              </tr>
            ) : (
              employees.map((emp) => {
                const initials =
                  `${emp.firstName?.[0] ?? ''}${emp.lastName?.[0] ?? ''}`.toUpperCase();

                return (
                  <motion.tr
                    key={emp.id}
                    variants={rowVariants}
                    className="transition-colors hover:bg-canvas"
                  >
                    {/* Empleado: avatar + nombre + email */}
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-tint text-xs font-semibold text-brand">
                          {initials || '—'}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-medium text-ink">
                            {emp.firstName} {emp.lastName}
                          </p>
                          <p className="truncate text-xs text-ink-muted">
                            {emp.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-3 text-ink-muted">
                      {emp.departament?.name || '—'}
                    </td>

                    <td className="px-6 py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-semibold ${
                          emp.isActive
                            ? 'bg-green-50 text-green-700'
                            : 'bg-red-50 text-red-600'
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            emp.isActive ? 'bg-green-500' : 'bg-red-500'
                          }`}
                        />
                        {emp.isActive ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>

                    <td className="px-6 py-3">
                      <div className="flex justify-center gap-2">
                        <IconButton
                          icon={Eye}
                          onClick={() =>
                            navigate(`/manager/employees/${emp.id}`)
                          }
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
                );
              })
            )}
          </tbody>
        </motion.table>
      </div>
    </motion.div>
  );
};

export default EmployeesTable;
