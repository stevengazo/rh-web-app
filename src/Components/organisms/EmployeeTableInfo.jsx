import { motion } from 'framer-motion';
import { UserX } from 'lucide-react';

const row = (label, value) => (
  <tr className="border-t">
    <td className="px-3 py-2 font-medium text-slate-600">{label}</td>
    <td className="px-3 py-2 text-slate-800">{value || '—'}</td>
  </tr>
);

const EmployeeTableInfo = ({ employee }) => {
  console.log('employee', employee);
  // 👉 Estado: sin datos
  if (!employee) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center
                   border border-dashed border-slate-300
                   rounded-lg p-8 text-slate-500 bg-white"
      >
        <UserX size={40} className="mb-3 text-slate-400" />
        <p className="font-medium">No hay información del empleado</p>
        <p className="text-sm">Selecciona un empleado para ver sus datos</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg shadow-sm overflow-hidden"
    >
      <table className="w-full border border-slate-200">
        <thead className="bg-slate-100">
          <tr>
            <th className="text-left px-3 py-2 text-slate-600">Campo</th>
            <th className="text-left px-3 py-2 text-slate-600">Valor</th>
          </tr>
        </thead>

        <tbody>
          {row(
            'Nombre',
            `${employee.firstName || ''} ${employee.middleName || ''}`.trim()
          )}

          {row(
            'Apellidos',
            `${employee.lastName || ''} ${employee.secondLastName || ''}`.trim()
          )}

          {row('Correo', employee.email)}
          {row('Cédula', employee.dni)}
          {row('Departamento', employee.departament?.name)}

          {row(
            'Fecha Contratación',
            employee.hiredDate
              ? new Date(employee.hiredDate).toLocaleDateString()
              : null
          )}

          {row('Estado', employee.isActive ? 'Activo' : 'Inactivo')}
        </tbody>
      </table>
    </motion.div>
  );
};

export default EmployeeTableInfo;
