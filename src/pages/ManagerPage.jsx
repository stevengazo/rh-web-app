import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  Banknote,
  Briefcase,
  Cake,
  CalendarDays,
  ChevronRight,
  Clock,
  FileText,
  PartyPopper,
  RefreshCw,
  TrendingUp,
  Users,
  Wallet,
} from 'lucide-react';

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

import { useAppContext } from '../context/AppContext';
import { useManagerDashboard } from '../hooks/useManagerDashboard';
import { formatMoney } from '../utils/formatMoney';

import SectionTitle from '../Components/SectionTitle';
import SecondaryButton from '../Components/SecondaryButton';
import HelpButton from '../Components/molecules/HelpButton';

/* Paleta de marca para la visualización de datos. */
const BRAND = '#0F6CBD';
const ACCENT = '#7C3AED';
const SUCCESS = '#16A34A';
const DANGER = '#EF4444';
const WARN = '#F59E0B';
const COLORS = [BRAND, ACCENT, SUCCESS, WARN, '#0EA5E9', DANGER];

/** Miles abreviados para los ejes: 1 200 000 → 1.2 M */
const abreviar = (v) => {
  if (Math.abs(v) >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (Math.abs(v) >= 1_000) return `${Math.round(v / 1_000)}k`;
  return `${v}`;
};

/* ------------------------------------------------------------------
   Piezas
   ------------------------------------------------------------------ */

/** Tarjeta de indicador. Si recibe `to`, es un acceso directo. */
const Indicador = ({ icon: Icon, label, valor, detalle, accent, to, alerta }) => {
  const contenido = (
    <>
      <div className="flex items-start justify-between gap-3">
        <span className={`grid h-11 w-11 place-items-center rounded-lg ${accent}`}>
          <Icon size={20} />
        </span>

        {to && (
          <ChevronRight
            size={16}
            className="text-ink-muted transition-transform group-hover:translate-x-0.5"
          />
        )}
      </div>

      <p className="mt-3 text-2xl font-bold leading-none text-ink">{valor}</p>
      <p className="mt-1 text-sm text-ink-muted">{label}</p>

      {detalle && (
        <p
          className={`mt-1 text-xs ${alerta ? 'font-semibold text-amber-700' : 'text-ink-muted'}`}
        >
          {detalle}
        </p>
      )}
    </>
  );

  const clases = `flex flex-col rounded-xl border bg-surface p-4 shadow-sm transition-all
    ${
      to
        ? 'group cursor-pointer hover:-translate-y-0.5 hover:border-brand hover:shadow-md'
        : ''
    }
    ${alerta ? 'border-amber-300' : 'border-stroke-soft'}`;

  return to ? (
    <Link to={to} className={clases}>
      {contenido}
    </Link>
  ) : (
    <div className={clases}>{contenido}</div>
  );
};

/** Contenedor de gráfico o listado. */
const Panel = ({ title, subtitle, action, children, className = '' }) => (
  <div
    className={`rounded-xl border border-stroke-soft bg-surface p-5 shadow-sm ${className}`}
  >
    <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
      <div>
        <h3 className="font-semibold text-ink">{title}</h3>
        {subtitle && <p className="text-xs text-ink-muted">{subtitle}</p>}
      </div>
      {action}
    </div>

    {children}
  </div>
);

/** Estado vacío dentro de un panel. */
const Vacio = ({ icon: Icon, mensaje }) => (
  <div className="flex flex-col items-center justify-center gap-2 py-10 text-ink-muted">
    <Icon size={26} />
    <p className="text-sm">{mensaje}</p>
  </div>
);

/** Tooltip con los colores del sistema. */
const tooltipProps = {
  contentStyle: {
    background: 'var(--color-surface)',
    border: '1px solid var(--color-stroke-soft)',
    borderRadius: 8,
    fontSize: 12,
    color: 'var(--color-ink)',
  },
  labelStyle: { color: 'var(--color-ink-secondary)', fontWeight: 600 },
};

const ejeProps = {
  tick: { fontSize: 11, fill: 'var(--color-ink-muted)' },
  axisLine: { stroke: 'var(--color-stroke-soft)' },
  tickLine: false,
};

/* ------------------------------------------------------------------
   Página
   ------------------------------------------------------------------ */

const ManagerPage = () => {
  const { user } = useAppContext();
  const {
    loading,
    error,
    recargar,
    resumen,
    actividadMensual,
    costoPlanillas,
    porDepartamento,
    porJornada,
    cumpleanosDelMes,
    aniversarios,
  } = useManagerDashboard(user);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-56 animate-pulse rounded bg-stroke-soft" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-xl bg-surface-alt" />
          ))}
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="h-80 animate-pulse rounded-xl bg-surface-alt lg:col-span-2" />
          <div className="h-80 animate-pulse rounded-xl bg-surface-alt" />
        </div>
      </div>
    );
  }

  const { pendientes } = resumen;

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Encabezado */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <SectionTitle className="mb-0">Panel de Recursos Humanos</SectionTitle>
            <HelpButton area="dashboard" />
          </div>
          <p className="text-sm text-ink-muted">
            Estado del personal, la planilla y lo que espera tu aprobación.
          </p>
        </div>

        <SecondaryButton onClick={recargar}>
          <RefreshCw size={15} />
          Actualizar
        </SecondaryButton>
      </div>

      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <AlertTriangle size={18} className="mt-0.5 shrink-0 text-amber-700" />
          <p className="text-sm text-amber-800">{error}</p>
        </div>
      )}

      {/* Indicadores */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <Indicador
          icon={Users}
          label="Colaboradores activos"
          valor={resumen.activos}
          detalle={
            resumen.inactivos > 0 ? `${resumen.inactivos} inactivos` : 'Toda la planilla al día'
          }
          accent="bg-brand-tint text-brand"
          to="/manager/employees"
        />

        <Indicador
          icon={Wallet}
          label="Masa salarial mensual"
          valor={formatMoney(resumen.masaSalarial)}
          detalle={`Promedio ${formatMoney(resumen.salarioPromedio)}`}
          accent="bg-green-50 text-green-700"
        />

        <Indicador
          icon={Clock}
          label="Esperan aprobación"
          valor={pendientes.total}
          detalle={
            pendientes.total > 0
              ? `${pendientes.acciones} acciones · ${pendientes.ausencias} ausencias · ${pendientes.prestamos} préstamos`
              : 'Nada pendiente'
          }
          accent="bg-amber-50 text-amber-700"
          alerta={pendientes.total > 0}
          to="/manager/actions"
        />

        <Indicador
          icon={FileText}
          label="Última planilla"
          valor={
            resumen.ultimaPlanilla
              ? formatMoney(resumen.ultimaPlanilla.totalAmount)
              : '—'
          }
          detalle={
            resumen.ultimaPlanilla
              ? `${resumen.ultimaPlanilla.status} · ${resumen.ultimaPlanilla.employeeCount} personas`
              : 'Sin planillas generadas'
          }
          accent="bg-accent-tint text-accent-strong"
          to="/manager/payroll"
        />

        <Indicador
          icon={Banknote}
          label="Préstamos por cobrar"
          valor={formatMoney(resumen.saldoPrestamos)}
          detalle={`${resumen.prestamosVigentes} vigentes`}
          accent="bg-brand-tint text-brand"
          to="/manager/loans"
        />

        <Indicador
          icon={CalendarDays}
          label="Ausencias del mes"
          valor={resumen.ausenciasMes}
          detalle={`${resumen.diasAusenciaMes} días aprobados`}
          accent="bg-red-50 text-red-600"
          to="/manager/absences"
        />
      </div>

      {/* Aviso: gente sin salario no entra en planilla */}
      {resumen.sinSalario > 0 && (
        <Link
          to="/manager/employees"
          className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4
                     transition-colors hover:bg-amber-100"
        >
          <AlertTriangle size={18} className="mt-0.5 shrink-0 text-amber-700" />
          <p className="text-sm text-amber-800">
            <strong>{resumen.sinSalario}</strong> colaborador
            {resumen.sinSalario === 1 ? '' : 'es'} activo
            {resumen.sinSalario === 1 ? '' : 's'} sin salario vigente: no
            aparecerá{resumen.sinSalario === 1 ? '' : 'n'} al generar la
            planilla. Regístraselo desde su expediente.
          </p>
        </Link>
      )}

      {/* Costo de planilla + distribución */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Panel
          title="Costo de planilla por periodo"
          subtitle="Bruto, deducciones y neto de las últimas planillas"
          className="lg:col-span-2"
        >
          {costoPlanillas.length === 0 ? (
            <Vacio icon={FileText} mensaje="Todavía no hay planillas generadas." />
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={costoPlanillas}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--color-stroke-soft)"
                  vertical={false}
                />
                <XAxis dataKey="name" {...ejeProps} />
                <YAxis tickFormatter={abreviar} {...ejeProps} />
                <Tooltip
                  {...tooltipProps}
                  formatter={(v, n) => [formatMoney(v), n]}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="bruto" name="Bruto" fill={BRAND} radius={[4, 4, 0, 0]} />
                <Bar dataKey="deducciones" name="Deducciones" fill={DANGER} radius={[4, 4, 0, 0]} />
                <Bar dataKey="neto" name="Neto" fill={SUCCESS} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Panel>

        <Panel title="Personal por departamento" subtitle="Colaboradores activos">
          {porDepartamento.length === 0 ? (
            <Vacio icon={Users} mensaje="Sin personal asignado a departamentos." />
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={porDepartamento}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={55}
                  outerRadius={95}
                  paddingAngle={2}
                >
                  {porDepartamento.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip {...tooltipProps} formatter={(v) => [`${v} personas`, '']} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </Panel>
      </div>

      {/* Actividad + jornada */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Panel
          title="Movimientos del año"
          subtitle="Acciones de personal, ausencias y extras por mes"
          className="lg:col-span-2"
        >
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={actividadMensual}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--color-stroke-soft)"
                vertical={false}
              />
              <XAxis dataKey="name" {...ejeProps} />
              <YAxis allowDecimals={false} {...ejeProps} />
              <Tooltip {...tooltipProps} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line
                type="monotone"
                dataKey="acciones"
                name="Acciones"
                stroke={BRAND}
                strokeWidth={2}
                dot={{ r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="ausencias"
                name="Ausencias"
                stroke={DANGER}
                strokeWidth={2}
                dot={{ r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="extras"
                name="Extras"
                stroke={WARN}
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Reparto por jornada" subtitle="Colaboradores activos">
          {porJornada.length === 0 ? (
            <Vacio icon={Clock} mensaje="Sin jornadas registradas." />
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={porJornada} layout="vertical">
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--color-stroke-soft)"
                  horizontal={false}
                />
                <XAxis type="number" allowDecimals={false} {...ejeProps} />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={80}
                  {...ejeProps}
                />
                <Tooltip {...tooltipProps} formatter={(v) => [`${v} personas`, '']} />
                <Bar dataKey="value" name="Personas" radius={[0, 4, 4, 0]}>
                  {porJornada.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </Panel>
      </div>

      {/* Pendientes + efemérides */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Panel
          title="Pendientes de aprobación"
          subtitle="Lo que está esperando una decisión"
        >
          {pendientes.total === 0 && pendientes.planillas === 0 ? (
            <Vacio icon={PartyPopper} mensaje="Todo al día, no hay pendientes." />
          ) : (
            <ul className="space-y-2">
              {[
                {
                  label: 'Acciones de personal',
                  n: pendientes.acciones,
                  to: '/manager/actions',
                  icon: Briefcase,
                },
                {
                  label: 'Ausencias',
                  n: pendientes.ausencias,
                  to: '/manager/absences',
                  icon: CalendarDays,
                },
                {
                  label: 'Préstamos',
                  n: pendientes.prestamos,
                  to: '/manager/loans',
                  icon: Banknote,
                },
                {
                  label: 'Planillas en borrador',
                  n: pendientes.planillas,
                  to: '/manager/payroll',
                  icon: FileText,
                },
              ]
                .filter((p) => p.n > 0)
                .map(({ label, n, to, icon: Icon }) => (
                  <li key={label}>
                    <Link
                      to={to}
                      className="flex items-center justify-between gap-3 rounded-lg border
                                 border-stroke-soft bg-surface-alt p-3 transition-colors
                                 hover:border-brand hover:bg-brand-tint"
                    >
                      <span className="flex items-center gap-2.5 text-sm text-ink-secondary">
                        <Icon size={16} className="text-ink-muted" />
                        {label}
                      </span>

                      <span className="flex items-center gap-2">
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-800">
                          {n}
                        </span>
                        <ChevronRight size={15} className="text-ink-muted" />
                      </span>
                    </Link>
                  </li>
                ))}
            </ul>
          )}
        </Panel>

        <Panel title="Cumpleaños del mes" subtitle="Para no dejar pasar la fecha">
          {cumpleanosDelMes.length === 0 ? (
            <Vacio icon={Cake} mensaje="Nadie cumple años este mes." />
          ) : (
            <ul className="space-y-2">
              {cumpleanosDelMes.map((c) => (
                <li
                  key={c.id}
                  className="flex items-center gap-3 rounded-lg border border-stroke-soft
                             bg-surface-alt p-2.5"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-accent-tint text-sm font-bold text-accent-strong">
                    {c.dia}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-ink">
                      {c.nombre}
                    </span>
                    {c.departamento && (
                      <span className="block truncate text-xs text-ink-muted">
                        {c.departamento}
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="Aniversarios de ingreso" subtitle="Años cumplidos en la empresa">
          {aniversarios.length === 0 ? (
            <Vacio icon={TrendingUp} mensaje="Sin aniversarios este mes." />
          ) : (
            <ul className="space-y-2">
              {aniversarios.map((a) => (
                <li
                  key={a.id}
                  className="flex items-center gap-3 rounded-lg border border-stroke-soft
                             bg-surface-alt p-2.5"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand-tint text-sm font-bold text-brand">
                    {a.dia}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-ink">
                      {a.nombre}
                    </span>
                    <span className="block text-xs text-ink-muted">
                      {a.anios} {a.anios === 1 ? 'año' : 'años'}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </motion.div>
  );
};

export default ManagerPage;
