import { CheckCircle2, ClipboardCheck, Clock, PlayCircle } from 'lucide-react';

import { PSYCH_STATUS, estadoDeAplicacion } from '../../utils/psychometricStatus';

const ESTILOS = {
  [PSYCH_STATUS.ASSIGNED]: {
    icon: Clock,
    clase: 'bg-amber-50 text-amber-800 border-amber-200',
  },
  [PSYCH_STATUS.IN_PROGRESS]: {
    icon: PlayCircle,
    clase: 'bg-brand-tint text-brand-700 border-brand-200',
  },
  [PSYCH_STATUS.COMPLETED]: {
    icon: CheckCircle2,
    clase: 'bg-green-50 text-green-700 border-green-200',
  },
  [PSYCH_STATUS.REVIEWED]: {
    icon: ClipboardCheck,
    clase: 'bg-violet-50 text-violet-700 border-violet-200',
  },
};

/**
 * Distintivo del estado de una aplicación psicométrica.
 *
 * @param {object|string} value  La aplicación, o el string de estado.
 */
const PsychometricStatusBadge = ({ value, className = '' }) => {
  const estado =
    typeof value === 'string' ? value : estadoDeAplicacion(value);
  const estilo = ESTILOS[estado] ?? ESTILOS[PSYCH_STATUS.ASSIGNED];
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

export default PsychometricStatusBadge;
