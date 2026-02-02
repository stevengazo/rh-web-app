import { motion } from 'framer-motion';
import { UserX } from 'lucide-react';

const formatDate = (date) => {
  if (!date || date.startsWith('0001-01-01')) return '—';
  return new Date(date).toLocaleDateString('es-CR');
};

const tableVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.04,
    },
  },
};

const rowVariants = {
  hidden: { opacity: 0, y: 6 },
  visible: { opacity: 1, y: 0 },
};

const Row = ({ label, value }) => (
  <motion.tr
    variants={rowVariants}
    whileHover={{ backgroundColor: '#f8fafc' }}
    className="border-t"
  >
    <td className="px-3 py-2 font-medium text-slate-600">
      {label}
    </td>
    <td className="px-3 py-2 text-slate-800">
      {value ?? '—'}
    </td>
  </motion.tr>
);

const EmployeeTableInfo = ({ employee }) => {
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
    <motion.table
      variants={tableVariants}
      initial="hidden"
      animate="visible"
      className="w-full border-collapse rounded-xl overflow-hidden shadow-sm bg-white"
    >
      <thead className="bg-slate-800 text-white text-sm">
        <tr>
          <th className="text-left px-3 py-2">Campo</th>
          <th className="text-left px-3 py-2">Valor</th>
        </tr>
      </thead>

      <motion.tbody variants={tableVariants} className="text-sm">
        <Row
          label="Nombre completo"
          value={`${employee.firstName ?? ''} ${employee.middleName ?? ''} ${employee.lastName ?? ''} ${employee.secondLastName ?? ''}`.trim()}
        />

        <Row label="Usuario" value={employee.userName} />
        <Row label="Correo" value={employee.email} />
        <Row label="Teléfono" value={employee.phoneNumber} />
        <Row label="Cédula" value={employee.dni} />
        <Row label="Dirección" value={employee.address} />

        <Row label="Departamento" value={employee.departament?.name} />
        <Row label="Jornada" value={employee.jorney} />

        <Row label="Fecha de nacimiento" value={formatDate(employee.birthDate)} />
        <Row label="Fecha de contratación" value={formatDate(employee.hiredDate)} />

        <Row
          label="Estado"
          value={
            employee.isActive ? (
              <span className="text-green-600 font-medium">Activo</span>
            ) : (
              <span className="text-red-600 font-medium">Inactivo</span>
            )
          }
        />

        <Row label="Última edición" value={formatDate(employee.lastEditedDate)} />
      </motion.tbody>
    </motion.table>
  );
};

export default EmployeeTableInfo;
