import { motion } from 'framer-motion';
import {
  UserX,
  Mail,
  Phone,
  Building2,
  Fingerprint,
  MapPin,
  Clock,
  Cake,
  CalendarDays,
  History,
} from 'lucide-react';

const formatDate = (date) => {
  if (!date || date.startsWith('0001-01-01')) return '—';
  return new Date(date).toLocaleDateString('es-CR');
};

const getInitials = (employee) =>
  `${employee.firstName?.[0] ?? ''}${employee.lastName?.[0] ?? ''}`.toUpperCase() ||
  '—';

const InfoItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3 rounded-lg border border-stroke-soft bg-surface-alt p-3">
    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand-tint text-brand">
      <Icon size={16} />
    </div>
    <div className="min-w-0">
      <p className="text-xs text-ink-muted">{label}</p>
      <p className="truncate text-sm font-medium text-ink">{value || '—'}</p>
    </div>
  </div>
);

const EmployeeTableInfo = ({ employee }) => {
  if (!employee || !employee.firstName) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center
                   border border-dashed border-stroke
                   rounded-xl p-8 text-ink-muted bg-surface"
      >
        <UserX size={40} className="mb-3 text-ink-muted" />
        <p className="font-medium">No hay información del empleado</p>
        <p className="text-sm">Selecciona un empleado para ver sus datos</p>
      </motion.div>
    );
  }

  const fullName = `${employee.firstName ?? ''} ${employee.middleName ?? ''} ${employee.lastName ?? ''} ${employee.secondLastName ?? ''}`
    .replace(/\s+/g, ' ')
    .trim();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="overflow-hidden rounded-xl border border-stroke-soft bg-surface shadow-sm"
    >
      {/* Banner */}
      <div className="h-24 bg-linear-to-r from-brand to-accent" />

      {/* Cabecera */}
      <div className="px-6 pb-5">
        <div className="-mt-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-end gap-4">
            <div className="grid h-20 w-20 shrink-0 place-items-center rounded-full border-4 border-surface bg-brand-tint text-2xl font-semibold text-brand shadow-sm">
              {getInitials(employee)}
            </div>
            <div className="pb-1">
              <h3 className="text-lg font-semibold text-ink">{fullName}</h3>
              <p className="text-sm text-ink-muted">
                @{employee.userName ?? '—'}
                {employee.departament?.name && (
                  <> · {employee.departament.name}</>
                )}
              </p>
            </div>
          </div>

          <span
            className={`inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
              employee.isActive
                ? 'bg-green-50 text-green-700'
                : 'bg-red-50 text-red-600'
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                employee.isActive ? 'bg-green-500' : 'bg-red-500'
              }`}
            />
            {employee.isActive ? 'Activo' : 'Inactivo'}
          </span>
        </div>

        {/* Chips de contacto */}
        <div className="mt-4 flex flex-wrap gap-2">
          {employee.email && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-alt px-3 py-1 text-xs text-ink-secondary">
              <Mail size={13} /> {employee.email}
            </span>
          )}
          {employee.phoneNumber && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-alt px-3 py-1 text-xs text-ink-secondary">
              <Phone size={13} /> {employee.phoneNumber}
            </span>
          )}
        </div>

        {/* Grilla de datos */}
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <InfoItem
            icon={Building2}
            label="Departamento"
            value={employee.departament?.name}
          />
          <InfoItem icon={Clock} label="Jornada" value={employee.jorney} />
          <InfoItem icon={Fingerprint} label="Cédula" value={employee.dni} />
          <InfoItem icon={MapPin} label="Dirección" value={employee.address} />
          <InfoItem
            icon={Cake}
            label="Fecha de nacimiento"
            value={formatDate(employee.birthDate)}
          />
          <InfoItem
            icon={CalendarDays}
            label="Fecha de contratación"
            value={formatDate(employee.hiredDate)}
          />
          <InfoItem
            icon={History}
            label="Última edición"
            value={formatDate(employee.lastEditedDate)}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default EmployeeTableInfo;
