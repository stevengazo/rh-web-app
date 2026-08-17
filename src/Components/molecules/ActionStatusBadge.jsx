import { CheckCircle2, Clock, XCircle } from 'lucide-react';

/** Estados de una acción de personal. */
export const ACTION_STATUS = {
  PENDING: 'Pendiente',
  APPROVED: 'Aprobada',
  REJECTED: 'Rechazada',
};

const ESTILOS = {
  [ACTION_STATUS.PENDING]: {
    icon: Clock,
    clase: 'bg-amber-50 text-amber-800 border-amber-200',
    borde: 'border-l-amber-400',
  },
  [ACTION_STATUS.APPROVED]: {
    icon: CheckCircle2,
    clase: 'bg-green-50 text-green-700 border-green-200',
    borde: 'border-l-green-500',
  },
  [ACTION_STATUS.REJECTED]: {
    icon: XCircle,
    clase: 'bg-red-50 text-red-600 border-red-200',
    borde: 'border-l-red-500',
  },
};

/**
 * Estado efectivo de una acción.
 *
 * Las acciones creadas antes de que existiera el campo `status` no lo traen;
 * en ese caso se deduce de `approvedBy`, igual que hace el backend.
 */
export const estadoDeAccion = (accion) => {
  if (accion?.status) return accion.status;
  return accion?.approvedBy ? ACTION_STATUS.APPROVED : ACTION_STATUS.PENDING;
};

/** Clase del borde lateral que colorea la tarjeta según el estado. */
export const bordeDeEstado = (estado) =>
  (ESTILOS[estado] ?? ESTILOS[ACTION_STATUS.PENDING]).borde;

const ActionStatusBadge = ({ status, className = '' }) => {
  const estado = status || ACTION_STATUS.PENDING;
  const estilo = ESTILOS[estado] ?? ESTILOS[ACTION_STATUS.PENDING];
  const Icon = estilo.icon;

  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-0.5
                  text-xs font-semibold ${estilo.clase} ${className}`}
    >
      <Icon size={13} />
      {estado}
    </span>
  );
};

export default ActionStatusBadge;
