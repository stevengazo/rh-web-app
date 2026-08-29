import { useMemo } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { BarChart3, CalendarDays, TrendingUp, Users } from 'lucide-react';

import { ABSENCE_STATUS, diasDeAusencia, estadoDeAusencia } from '../../hooks/useAbsences';
import { formatMoney } from '../../utils/formatMoney';
import AiAssistPanel from './AiAssistPanel';
import { USO } from '../../data/modelosIa';
import { SISTEMA, promptAnalisisAusentismo } from '../../data/promptsIa';

/* Los gráficos no leen tokens CSS, así que el color va explícito. Se eligen
   los mismos que usan los distintivos de estado para que la lectura sea
   inmediata entre la tabla y las gráficas. */
const COLOR = {
  brand: '#0F6CBD',
  accent: '#7C3AED',
  aprobada: '#16A34A',
  pendiente: '#D97706',
  rechazada: '#DC2626',
  justificada: '#0F6CBD',
  injustificada: '#DC2626',
};

const MESES = [
  'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
  'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic',
];

const DIAS_SEMANA = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

const nombreDe = (user) =>
  [user?.firstName, user?.lastName].filter(Boolean).join(' ').trim() ||
  user?.userName ||
  user?.email ||
  'Sin asignar';

const fechaValida = (v) => {
  if (!v) return null;
  const f = new Date(v);
  return Number.isNaN(f.getTime()) || f.getFullYear() < 1900 ? null : f;
};

/** Tarjeta de una cifra destacada. */
const Cifra = ({ icon: Icon, label, valor, detalle, accent }) => (
  <div className="flex items-center gap-3 rounded-xl border border-stroke-soft bg-surface p-4 shadow-sm">
    <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-lg ${accent}`}>
      <Icon size={20} />
    </span>
    <div className="min-w-0">
      <p className="text-xl font-semibold leading-none text-ink">{valor}</p>
      <p className="mt-1 truncate text-sm text-ink-muted">{label}</p>
      {detalle && (
        <p className="mt-0.5 truncate text-xs text-ink-muted">{detalle}</p>
      )}
    </div>
  </div>
);

/** Contenedor uniforme para cada gráfica. */
const Panel = ({ title, subtitle, children, className = '' }) => (
  <div
    className={`rounded-xl border border-stroke-soft bg-surface p-5 shadow-sm ${className}`}
  >
    <h3 className="text-sm font-semibold text-ink">{title}</h3>
    {subtitle && <p className="mt-0.5 text-xs text-ink-muted">{subtitle}</p>}
    <div className="mt-4">{children}</div>
  </div>
);

const estiloTooltip = {
  backgroundColor: 'var(--color-surface)',
  border: '1px solid var(--color-stroke)',
  borderRadius: 8,
  color: 'var(--color-ink)',
  fontSize: 12,
};

/**
 * Estadísticas de ausentismo.
 *
 * Responde a lo que se pregunta al revisar ausencias: cuánto se está
 * perdiendo, en qué meses se concentra, qué día de la semana falla más,
 * quiénes acumulan más días y cuánto está justificado.
 *
 * Todo se calcula sobre las ausencias ya cargadas, sin pedir nada más a la
 * API; los gráficos se dibujan solo cuando hay datos que mostrar.
 *
 * @param {Array} absences  Listado completo, sin filtrar.
 */
const AbsenceStats = ({ absences = [] }) => {
  const datos = useMemo(() => {
    const aprobadas = absences.filter(
      (a) => estadoDeAusencia(a) === ABSENCE_STATUS.APPROVED
    );

    /* --- Totales ------------------------------------------------------ */
    const diasTotales = absences.reduce((t, a) => t + diasDeAusencia(a), 0);
    const diasAprobados = aprobadas.reduce((t, a) => t + diasDeAusencia(a), 0);
    const costo = absences.reduce((t, a) => t + (a.amount ?? 0), 0);

    const justificadas = absences.filter((a) => a.justified).length;

    /* --- Por estado --------------------------------------------------- */
    const porEstado = [
      {
        name: 'Aprobadas',
        value: absences.filter(
          (a) => estadoDeAusencia(a) === ABSENCE_STATUS.APPROVED
        ).length,
        color: COLOR.aprobada,
      },
      {
        name: 'Pendientes',
        value: absences.filter(
          (a) => estadoDeAusencia(a) === ABSENCE_STATUS.PENDING
        ).length,
        color: COLOR.pendiente,
      },
      {
        name: 'Rechazadas',
        value: absences.filter(
          (a) => estadoDeAusencia(a) === ABSENCE_STATUS.REJECTED
        ).length,
        color: COLOR.rechazada,
      },
    ].filter((d) => d.value > 0);

    /* --- Justificadas vs. injustificadas ------------------------------ */
    const porJustificacion = [
      {
        name: 'Justificadas',
        value: justificadas,
        color: COLOR.justificada,
      },
      {
        name: 'Injustificadas',
        value: absences.length - justificadas,
        color: COLOR.injustificada,
      },
    ].filter((d) => d.value > 0);

    /* --- Evolución mensual (últimos 12 meses) ------------------------- */
    const hoy = new Date();
    const meses = [];

    for (let i = 11; i >= 0; i -= 1) {
      const f = new Date(hoy.getFullYear(), hoy.getMonth() - i, 1);
      meses.push({
        clave: `${f.getFullYear()}-${f.getMonth()}`,
        mes: `${MESES[f.getMonth()]} ${String(f.getFullYear()).slice(2)}`,
        ausencias: 0,
        dias: 0,
      });
    }

    const indice = new Map(meses.map((m, i) => [m.clave, i]));

    absences.forEach((a) => {
      const f = fechaValida(a.startDate);
      if (!f) return;

      const pos = indice.get(`${f.getFullYear()}-${f.getMonth()}`);
      if (pos === undefined) return;

      meses[pos].ausencias += 1;
      meses[pos].dias += diasDeAusencia(a);
    });

    /* --- Día de la semana --------------------------------------------- */
    const porDia = DIAS_SEMANA.map((dia) => ({ dia, ausencias: 0 }));

    absences.forEach((a) => {
      const f = fechaValida(a.startDate);
      if (f) porDia[f.getDay()].ausencias += 1;
    });

    /* --- Colaboradores con más días ----------------------------------- */
    const acumulado = new Map();

    absences.forEach((a) => {
      const clave = a.userId ?? nombreDe(a.user);
      const previo = acumulado.get(clave) ?? {
        nombre: nombreDe(a.user),
        dias: 0,
        ausencias: 0,
      };

      previo.dias += diasDeAusencia(a);
      previo.ausencias += 1;
      acumulado.set(clave, previo);
    });

    const topEmpleados = [...acumulado.values()]
      .sort((a, b) => b.dias - a.dias)
      .slice(0, 8);

    return {
      diasTotales,
      diasAprobados,
      costo,
      justificadas,
      promedio: absences.length ? diasTotales / absences.length : 0,
      porEstado,
      porJustificacion,
      meses,
      porDia,
      topEmpleados,
      /* El día "pico" solo tiene sentido si alguna vez hubo una ausencia. */
      diaPico: porDia.reduce(
        (max, d) => (d.ausencias > max.ausencias ? d : max),
        porDia[0]
      ),
    };
  }, [absences]);

  if (absences.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-stroke bg-surface-alt py-16 text-ink-muted">
        <BarChart3 size={30} />
        <p className="text-sm font-medium">Todavía no hay datos que graficar</p>
        <p className="text-xs">
          Las estadísticas aparecen en cuanto se registre la primera ausencia.
        </p>
      </div>
    );
  }

  const porcentajeJustificadas = Math.round(
    (datos.justificadas / absences.length) * 100
  );

  return (
    <div className="space-y-4">
      <AiAssistPanel
        uso={USO.ANALISIS_AUSENTISMO}
        titulo="Análisis del ausentismo"
        descripcion="Interpreta estas cifras y señala lo que conviene revisar."
        sistema={SISTEMA.analisisAusentismo}
        construirPrompt={() =>
          promptAnalisisAusentismo({
            resumen: {
              total: absences.length,
              dias: datos.diasTotales,
              promedio: datos.promedio.toFixed(1),
              justificadas: datos.justificadas,
              costo: datos.costo,
            },
            porMes: datos.meses,
            porDia: datos.porDia,
            topEmpleados: datos.topEmpleados,
          })
        }
      />

      {/* Cifras de cabecera */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Cifra
          icon={CalendarDays}
          label="Días de ausencia"
          valor={datos.diasTotales}
          detalle={`${datos.diasAprobados} ya aprobados`}
          accent="bg-brand-tint text-brand"
        />
        <Cifra
          icon={TrendingUp}
          label="Duración promedio"
          valor={`${datos.promedio.toFixed(1)} d`}
          detalle={`${absences.length} registros`}
          accent="bg-accent-tint text-accent-strong"
        />
        <Cifra
          icon={BarChart3}
          label="Justificadas"
          valor={`${porcentajeJustificadas}%`}
          detalle={`${datos.justificadas} de ${absences.length}`}
          accent="bg-green-50 text-green-700"
        />
        <Cifra
          icon={Users}
          label="Costo registrado"
          valor={formatMoney(datos.costo)}
          detalle={
            datos.costo === 0
              ? 'Sin montos calculados'
              : 'Suma de las rebajas'
          }
          accent="bg-amber-50 text-amber-700"
        />
      </div>

      {/* Evolución mensual */}
      <Panel
        title="Evolución de los últimos 12 meses"
        subtitle="Número de ausencias y días perdidos por mes de inicio."
      >
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={datos.meses}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-stroke-soft)" />
            <XAxis
              dataKey="mes"
              tick={{ fontSize: 11, fill: 'var(--color-ink-muted)' }}
              stroke="var(--color-stroke)"
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 11, fill: 'var(--color-ink-muted)' }}
              stroke="var(--color-stroke)"
            />
            <Tooltip contentStyle={estiloTooltip} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Line
              type="monotone"
              dataKey="ausencias"
              name="Ausencias"
              stroke={COLOR.brand}
              strokeWidth={2}
              dot={{ r: 3 }}
            />
            <Line
              type="monotone"
              dataKey="dias"
              name="Días"
              stroke={COLOR.accent}
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Panel>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Estado */}
        <Panel
          title="Distribución por estado"
          subtitle="Cuántas solicitudes hay en cada punto del flujo."
        >
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={datos.porEstado}
                dataKey="value"
                nameKey="name"
                innerRadius={55}
                outerRadius={90}
                paddingAngle={2}
              >
                {datos.porEstado.map((d) => (
                  <Cell key={d.name} fill={d.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={estiloTooltip} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </Panel>

        {/* Justificación */}
        <Panel
          title="Justificadas vs. injustificadas"
          subtitle="Las injustificadas son las que se rebajan del salario."
        >
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={datos.porJustificacion}
                dataKey="value"
                nameKey="name"
                innerRadius={55}
                outerRadius={90}
                paddingAngle={2}
              >
                {datos.porJustificacion.map((d) => (
                  <Cell key={d.name} fill={d.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={estiloTooltip} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </Panel>

        {/* Día de la semana */}
        <Panel
          title="Ausencias por día de la semana"
          subtitle={
            datos.diaPico?.ausencias
              ? `El día con más ausencias es ${datos.diaPico.dia}.`
              : 'Según el día en que inicia la ausencia.'
          }
        >
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={datos.porDia}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-stroke-soft)" />
              <XAxis
                dataKey="dia"
                tick={{ fontSize: 11, fill: 'var(--color-ink-muted)' }}
                stroke="var(--color-stroke)"
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 11, fill: 'var(--color-ink-muted)' }}
                stroke="var(--color-stroke)"
              />
              <Tooltip contentStyle={estiloTooltip} />
              <Bar
                dataKey="ausencias"
                name="Ausencias"
                fill={COLOR.brand}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </Panel>

        {/* Colaboradores */}
        <Panel
          title="Colaboradores con más días"
          subtitle="Los ocho con mayor acumulado de días de ausencia."
        >
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={datos.topEmpleados} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-stroke-soft)" />
              <XAxis
                type="number"
                allowDecimals={false}
                tick={{ fontSize: 11, fill: 'var(--color-ink-muted)' }}
                stroke="var(--color-stroke)"
              />
              <YAxis
                type="category"
                dataKey="nombre"
                width={120}
                tick={{ fontSize: 11, fill: 'var(--color-ink-muted)' }}
                stroke="var(--color-stroke)"
              />
              <Tooltip contentStyle={estiloTooltip} />
              <Bar
                dataKey="dias"
                name="Días"
                fill={COLOR.accent}
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </Panel>
      </div>
    </div>
  );
};

export default AbsenceStats;
