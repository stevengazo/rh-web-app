import { motion } from 'framer-motion';
import { UserX } from 'lucide-react';

const formatDate = (date) => {
  if (!date || date.startsWith('0001-01-01')) return '—';
  return new Date(date).toLocaleDateString('es-CR');
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

const Field = ({ label, value }) => (
  <motion.div
    variants={itemVariants}
    whileHover={{ scale: 1.02 }}
    className="bg-canvas hover:bg-surface-alt
               transition-all rounded-xl p-4
               border border-stroke-soft"
  >
    <p className="text-xs uppercase tracking-wide text-ink-muted mb-1">
      {label}
    </p>
    <p className="text-sm font-medium text-ink break-words">
      {value ?? '—'}
    </p>
  </motion.div>
);

const EmployeeInfoCard = ({ employee }) => {
  if (!employee) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center
                   border border-dashed border-stroke
                   rounded-xl p-10 text-ink-muted bg-surface"
      >
        <UserX size={40} className="mb-3 text-ink-muted" />
        <p className="font-medium">No hay información del empleado</p>
        <p className="text-sm">Selecciona un empleado para ver sus datos</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-surface rounded-2xl shadow-md p-6"
    >
      {/* Header */}
      <div className="mb-6"></div>

      {/* Grid Info */}
      <motion.div
        variants={containerVariants}
        className="
          grid gap-4
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-3
        "
      >
        <Field
          label="Nombre completo"
          value={`${employee.firstName ?? ''} 
                  ${employee.middleName ?? ''} 
                  ${employee.lastName ?? ''} 
                  ${employee.secondLastName ?? ''}`.trim()}
        />

        <Field label="Usuario" value={employee.userName} />
        <Field label="Correo" value={employee.email} />
        <Field label="Teléfono" value={employee.phoneNumber} />
        <Field label="Cédula" value={employee.dni} />
        <Field label="Dirección" value={employee.address} />

        <Field label="Departamento" value={employee.departament?.name} />
        <Field label="Jornada" value={employee.journey} />

        <Field
          label="Fecha de nacimiento"
          value={formatDate(employee.birthDate)}
        />

        <Field
          label="Fecha de contratación"
          value={formatDate(employee.hiredDate)}
        />

        <Field
          label="Estado"
          value={
            employee.isActive ? (
              <span className="text-green-600 font-semibold">Activo</span>
            ) : (
              <span className="text-red-600 font-semibold">Inactivo</span>
            )
          }
        />

        <Field
          label="Última edición"
          value={formatDate(employee.lastEditedDate)}
        />
      </motion.div>
    </motion.div>
  );
};

export default EmployeeInfoCard;
