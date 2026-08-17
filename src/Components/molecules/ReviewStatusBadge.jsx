import { CheckCircle2, Clock, Wallet, XCircle } from 'lucide-react';

/**
 * Distintivo de estado para los módulos que se aprueban (acciones, ausencias,
 * préstamos). El backend usa género distinto según el módulo — "Aprobada" para
 * una ausencia, "Aprobado" para un préstamo — así que se normaliza el texto.
 */
const ESTILOS = {
  pendiente: {
    icon: Clock,
    clase: 'bg-amber-50 text-amber-800 border-amber-200',
    borde: 'border-l-amber-400',
  },
  aprobado: {
    icon: CheckCircle2,
    clase: 'bg-green-50 text-green-700 border-green-200',
    borde: 'border-l-green-500',
  },
  rechazado: {
    icon: XCircle,
    clase: 'bg-red-50 text-red-600 border-red-200',
    borde: 'border-l-red-500',
  },
  pagado: {
    icon: Wallet,
    clase: 'bg-brand-tint text-brand-700 border-brand-200',
    borde: 'border-l-brand',
  },
};

/** 'Aprobada' / 'Aprobado' → 'aprobado'. */
const normalizar = (estado) => {
  const texto = (estado ?? '').toLowerCase();
  if (texto.startsWith('aprobad')) return 'aprobado';
  if (texto.startsWith('rechazad')) return 'rechazado';
  if (texto.startsWith('pagad')) return 'pagado';
  return 'pendiente';
};

export const estiloDeEstado = (estado) => ESTILOS[normalizar(estado)];

/** Clase del borde lateral que colorea una tarjeta según su estado. */
export const bordeDeEstado = (estado) => estiloDeEstado(estado).borde;

/**
 * @param {string} status
 * @param {string} [fallback] Texto a mostrar si `status` viene vacío.
 */
const ReviewStatusBadge = ({ status, fallback = 'Pendiente', className = '' }) => {
  const etiqueta = status || fallback;
  const estilo = estiloDeEstado(etiqueta);
  const Icon = estilo.icon;

  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-0.5
                  text-xs font-semibold ${estilo.clase} ${className}`}
    >
      <Icon size={13} />
      {etiqueta}
    </span>
  );
};

export default ReviewStatusBadge;
