import { useMemo, useState } from 'react';
import {
  Award,
  Banknote,
  Briefcase,
  CalendarDays,
  Clock,
  FileText,
  GraduationCap,
  History,
  Percent,
  Plane,
  ShieldCheck,
} from 'lucide-react';

import { formatMoney } from '../../utils/formatMoney';

/* ------------------------------------------------------------------
   Utilidades
   ------------------------------------------------------------------ */

const fechaValida = (v) => {
  if (!v) return null;
  const f = new Date(v);
  return Number.isNaN(f.getTime()) || f.getFullYear() < 1900 ? null : f;
};

const formatFecha = (f) =>
  f.toLocaleDateString('es-CR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

/** "hace 3 días", "hace 2 meses"… para dar contexto sin hacer cuentas. */
const haceCuanto = (f) => {
  const dias = Math.floor((Date.now() - f.getTime()) / 86400000);

  if (dias < 0) return 'próximamente';
  if (dias === 0) return 'hoy';
  if (dias === 1) return 'ayer';
  if (dias < 30) return `hace ${dias} días`;

  const meses = Math.floor(dias / 30);
  if (meses < 12) return `hace ${meses} ${meses === 1 ? 'mes' : 'meses'}`;

  const anios = Math.floor(meses / 12);
  return `hace ${anios} ${anios === 1 ? 'año' : 'años'}`;
};

/** Estado efectivo de los registros que se aprueban. */
const estado = (r) => r?.status || (r?.approvedBy ? 'Aprobada' : 'Pendiente');

/* Estilo por tipo de suceso. */
const TIPOS = {
  ingreso: { icon: ShieldCheck, color: 'bg-brand-tint text-brand', label: 'Ingreso' },
  accion: { icon: Briefcase, color: 'bg-brand-tint text-brand', label: 'Acción' },
  salario: { icon: Banknote, color: 'bg-green-50 text-green-700', label: 'Salario' },
  vacacion: { icon: Plane, color: 'bg-accent-tint text-accent-strong', label: 'Vacaciones' },
  ausencia: { icon: CalendarDays, color: 'bg-red-50 text-red-600', label: 'Ausencia' },
  extra: { icon: Clock, color: 'bg-amber-50 text-amber-700', label: 'Extra' },
  comision: { icon: Percent, color: 'bg-green-50 text-green-700', label: 'Comisión' },
  curso: { icon: GraduationCap, color: 'bg-brand-tint text-brand', label: 'Formación' },
  reconocimiento: { icon: Award, color: 'bg-accent-tint text-accent-strong', label: 'Reconocimiento' },
  planilla: { icon: FileText, color: 'bg-surface-alt text-ink-secondary', label: 'Planilla' },
};

/* ------------------------------------------------------------------
   Componente
   ------------------------------------------------------------------ */

/**
 * Historial del colaborador en orden cronológico.
 *
 * Mezcla en una sola línea de tiempo todo lo que le ha ocurrido —ingreso,
 * acciones, cambios de salario, vacaciones, ausencias, extras, comisiones,
 * formación y reconocimientos— que hasta ahora sólo se podía reconstruir
 * saltando entre pestañas.
 */
const EmployeeTimeline = ({
  employee,
  actions = [],
  salaries = [],
  vacations = [],
  absences = [],
  extras = [],
  comissions = [],
  courses = [],
  certifications = [],
  awards = [],
}) => {
  const [filtro, setFiltro] = useState('todos');

  const sucesos = useMemo(() => {
    const lista = [];

    const agregar = (tipo, fecha, titulo, detalle, extraInfo) => {
      const f = fechaValida(fecha);
      if (!f) return;
      lista.push({ tipo, fecha: f, titulo, detalle, extra: extraInfo });
    };

    agregar(
      'ingreso',
      employee?.hiredDate,
      'Ingreso a la empresa',
      employee?.departament?.name
        ? `Se incorporó a ${employee.departament.name}`
        : null
    );

    actions.forEach((a) =>
      agregar(
        'accion',
        a.actionDate,
        a.actionType?.name || 'Acción de personal',
        a.description,
        estado(a)
      )
    );

    salaries.forEach((s) =>
      agregar(
        'salario',
        s.effectiveDate,
        'Salario actualizado',
        `${formatMoney(s.salaryAmount)}${s.type ? ` · ${s.type}` : ''}`
      )
    );

    vacations.forEach((v) =>
      agregar(
        'vacacion',
        v.startDate,
        'Vacaciones',
        v.reason || 'Solicitud de vacaciones',
        estado(v)
      )
    );

    absences.forEach((a) =>
      agregar('ausencia', a.startDate, a.title || 'Ausencia', a.reason, estado(a))
    );

    extras.forEach((e) =>
      agregar(
        'extra',
        e.start,
        e.extraType?.name || 'Horas extra',
        formatMoney(e.amount),
        e.isApproved ? 'Aprobada' : 'Pendiente'
      )
    );

    comissions.forEach((c) =>
      agregar('comision', c.date, 'Comisión', formatMoney(c.amount))
    );

    courses.forEach((c) =>
      agregar('curso', c.end || c.start, `Curso: ${c.name}`, c.institution)
    );

    certifications.forEach((c) =>
      agregar(
        'curso',
        c.emissionDate,
        `Certificación: ${c.name}`,
        c.institution
      )
    );

    awards.forEach((a) =>
      agregar('reconocimiento', a.createdAt, a.title, a.description)
    );

    return lista.sort((a, b) => b.fecha - a.fecha);
  }, [
    employee,
    actions,
    salaries,
    vacations,
    absences,
    extras,
    comissions,
    courses,
    certifications,
    awards,
  ]);

  const visibles =
    filtro === 'todos' ? sucesos : sucesos.filter((s) => s.tipo === filtro);

  /* Solo se ofrecen filtros de los tipos que realmente ocurrieron. */
  const tiposPresentes = useMemo(() => {
    const set = new Set(sucesos.map((s) => s.tipo));
    return Object.keys(TIPOS).filter((t) => set.has(t));
  }, [sucesos]);

  if (sucesos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-xl
                      border border-dashed border-stroke bg-surface-alt py-14 text-ink-muted">
        <History size={28} />
        <p className="text-sm font-medium">Sin movimientos registrados</p>
        <p className="text-xs">
          Aquí aparecerá todo lo que ocurra con este colaborador.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Filtros */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setFiltro('todos')}
          className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors
            ${
              filtro === 'todos'
                ? 'border-brand bg-brand-tint text-brand-700'
                : 'border-stroke-soft bg-surface text-ink-muted hover:border-brand hover:text-brand'
            }`}
        >
          Todo
          <span className="ml-1.5 opacity-70">{sucesos.length}</span>
        </button>

        {tiposPresentes.map((t) => {
          const cuenta = sucesos.filter((s) => s.tipo === t).length;

          return (
            <button
              key={t}
              type="button"
              onClick={() => setFiltro(t)}
              className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors
                ${
                  filtro === t
                    ? 'border-brand bg-brand-tint text-brand-700'
                    : 'border-stroke-soft bg-surface text-ink-muted hover:border-brand hover:text-brand'
                }`}
            >
              {TIPOS[t].label}
              <span className="ml-1.5 opacity-70">{cuenta}</span>
            </button>
          );
        })}
      </div>

      {/* Línea de tiempo */}
      <ol className="relative space-y-1">
        {/* Riel vertical que une los hitos */}
        <span
          aria-hidden="true"
          className="absolute bottom-4 left-[19px] top-4 w-px bg-stroke-soft"
        />

        {visibles.map((s, i) => {
          const { icon: Icon, color, label } = TIPOS[s.tipo] ?? TIPOS.accion;

          return (
            <li key={`${s.tipo}-${i}`} className="relative flex gap-4 py-2">
              <span
                className={`z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full
                            ring-4 ring-surface ${color}`}
              >
                <Icon size={17} />
              </span>

              <div className="min-w-0 flex-1 pt-0.5">
                <div className="flex flex-wrap items-baseline gap-x-2">
                  <p className="font-medium text-ink">{s.titulo}</p>

                  {s.extra && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-semibold
                        ${
                          s.extra === 'Aprobada' || s.extra === 'Aprobado'
                            ? 'bg-green-50 text-green-700'
                            : s.extra === 'Rechazada' || s.extra === 'Rechazado'
                              ? 'bg-red-50 text-red-600'
                              : 'bg-amber-50 text-amber-800'
                        }`}
                    >
                      {s.extra}
                    </span>
                  )}
                </div>

                {s.detalle && (
                  <p className="mt-0.5 line-clamp-2 text-sm text-ink-muted">
                    {s.detalle}
                  </p>
                )}

                <p className="mt-1 text-xs text-ink-muted">
                  <span className="font-medium text-ink-secondary">{label}</span>
                  {' · '}
                  {formatFecha(s.fecha)}
                  {' · '}
                  {haceCuanto(s.fecha)}
                </p>
              </div>
            </li>
          );
        })}
      </ol>

      {visibles.length === 0 && (
        <p className="py-8 text-center text-sm text-ink-muted">
          No hay movimientos de ese tipo.
        </p>
      )}
    </div>
  );
};

export default EmployeeTimeline;
