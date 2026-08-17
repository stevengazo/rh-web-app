import { useMemo } from 'react';
import { CalendarCheck, CalendarClock, CalendarDays } from 'lucide-react';

/** Días naturales que abarca una solicitud (ambos extremos incluidos). */
const diasDeSolicitud = (vacacion) => {
  const inicio = new Date(vacacion?.startDate);
  const fin = new Date(vacacion?.endDate);

  if (Number.isNaN(inicio.getTime()) || Number.isNaN(fin.getTime())) return 0;

  const dias = Math.floor((fin - inicio) / 86400000) + 1;
  return dias > 0 ? dias : 0;
};

const Tarjeta = ({ icon: Icon, label, valor, detalle, acento }) => (
  <div className="rounded-xl border border-stroke-soft bg-surface p-4 shadow-sm">
    <div className="flex items-center gap-2">
      <span className={`grid h-8 w-8 place-items-center rounded-lg ${acento}`}>
        <Icon size={16} />
      </span>
      <p className="text-xs font-medium uppercase tracking-wide text-ink-muted">
        {label}
      </p>
    </div>

    <p className="mt-3 text-2xl font-bold text-ink">{valor}</p>
    <p className="mt-0.5 text-xs text-ink-muted">{detalle}</p>
  </div>
);

/**
 * Resumen de vacaciones a partir de las solicitudes del colaborador.
 *
 * Cuenta días naturales, no hábiles: la API guarda solo fecha de inicio y
 * fin, sin calendario de feriados.
 *
 * @param {Array} vacations
 */
const VacationsSummary = ({ vacations = [] }) => {
  const resumen = useMemo(() => {
    const activas = vacations.filter((v) => !v?.deleted);

    const acumular = (estado) =>
      activas
        .filter((v) => v?.status === estado)
        .reduce((total, v) => total + diasDeSolicitud(v), 0);

    const aprobados = acumular('Aprobado');
    const pendientes = acumular('Pendiente');

    return {
      aprobados,
      pendientes,
      solicitudes: activas.length,
      pendientesCount: activas.filter((v) => v?.status === 'Pendiente').length,
    };
  }, [vacations]);

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <Tarjeta
        icon={CalendarCheck}
        label="Días aprobados"
        valor={resumen.aprobados}
        detalle="Días naturales ya autorizados"
        acento="bg-green-50 text-green-700"
      />

      <Tarjeta
        icon={CalendarClock}
        label="Días pendientes"
        valor={resumen.pendientes}
        detalle={
          resumen.pendientesCount === 1
            ? '1 solicitud por aprobar'
            : `${resumen.pendientesCount} solicitudes por aprobar`
        }
        acento="bg-amber-50 text-amber-800"
      />

      <Tarjeta
        icon={CalendarDays}
        label="Solicitudes"
        valor={resumen.solicitudes}
        detalle="Registradas en el sistema"
        acento="bg-brand-tint text-brand"
      />
    </div>
  );
};

export default VacationsSummary;
