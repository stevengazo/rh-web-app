import { Ban, CheckCircle2, FileEdit, Wallet } from 'lucide-react';

/**
 * Estados de una planilla y su presentación.
 * El backend los guarda como texto; `Borrador` es el valor por omisión.
 */
export const PAYROLL_STATUS = {
  DRAFT: 'Borrador',
  APPROVED: 'Aprobada',
  PAID: 'Pagada',
  VOIDED: 'Anulada',
};

const ESTILOS = {
  [PAYROLL_STATUS.DRAFT]: {
    icon: FileEdit,
    clase: 'bg-surface-alt text-ink-secondary border-stroke',
    punto: 'bg-ink-muted',
  },
  [PAYROLL_STATUS.APPROVED]: {
    icon: CheckCircle2,
    clase: 'bg-brand-tint text-brand-700 border-brand-200',
    punto: 'bg-brand',
  },
  [PAYROLL_STATUS.PAID]: {
    icon: Wallet,
    clase: 'bg-green-50 text-green-700 border-green-200',
    punto: 'bg-green-500',
  },
  [PAYROLL_STATUS.VOIDED]: {
    icon: Ban,
    clase: 'bg-red-50 text-red-600 border-red-200',
    punto: 'bg-red-500',
  },
};

/** Una planilla solo se edita mientras es borrador. */
export const esPlanillaEditable = (status) =>
  !status || status === PAYROLL_STATUS.DRAFT;

/**
 * Distintivo del estado de una planilla.
 *
 * @param {string} status
 * @param {boolean} [conIcono]
 */
const PayrollStatusBadge = ({ status, conIcono = true, className = '' }) => {
  const estado = status || PAYROLL_STATUS.DRAFT;
  const estilo = ESTILOS[estado] ?? ESTILOS[PAYROLL_STATUS.DRAFT];
  const Icon = estilo.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5
                  text-xs font-semibold ${estilo.clase} ${className}`}
    >
      {conIcono ? (
        <Icon size={13} />
      ) : (
        <span className={`h-1.5 w-1.5 rounded-full ${estilo.punto}`} />
      )}
      {estado}
    </span>
  );
};

export default PayrollStatusBadge;
