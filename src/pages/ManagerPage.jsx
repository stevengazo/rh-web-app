import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Users, UserPlus, CalendarCheck, BarChart3 } from 'lucide-react';

import { useAppContext } from '../context/AppContext';
import { useManagerDashboard } from '../hooks/useManagerDashboard';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

import { GridStack } from 'gridstack';
import 'gridstack/dist/gridstack.min.css';

// Paleta de marca Fluent para la visualización de datos
const BRAND = '#0F6CBD';
const SUCCESS = '#16A34A';
const DANGER = '#EF4444';
const COLORS = [BRAND, SUCCESS, '#0EA5E9', DANGER, '#F59E0B', '#8B5CF6'];

const ManagerPage = () => {
  const { user } = useAppContext();
  const gridRef = useRef(null);

  const {
    loading,
    countEmployees,
    countActions,
    activityChart,
    birthdayChart,
    departamentChart,
    totalAbsences,
    totalExtras,
  } = useManagerDashboard(user);

  useEffect(() => {
    if (!gridRef.current) return;

    const grid = GridStack.init(
      {
        column: 12,
        cellHeight: 80,
        margin: 10,
        float: true,
      },
      gridRef.current
    );

    return () => grid.destroy(false);
  }, []);

  const today = new Date().toLocaleDateString('es-CR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const firstName = user?.firstName ?? user?.userName ?? 'Administrador';

  const cards = [
    {
      title: 'Empleados',
      value: countEmployees,
      icon: Users,
      fg: 'text-brand',
      chip: 'bg-brand-tint',
    },
    {
      title: 'Acciones',
      value: countActions,
      icon: UserPlus,
      fg: 'text-emerald-600',
      chip: 'bg-emerald-50',
    },
    {
      title: 'Ausencias',
      value: totalAbsences,
      icon: CalendarCheck,
      fg: 'text-amber-600',
      chip: 'bg-amber-50',
    },
    {
      title: 'Horas Extras',
      value: totalExtras,
      icon: BarChart3,
      fg: 'text-violet-600',
      chip: 'bg-violet-50',
    },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Encabezado de bienvenida */}
      <div className="mb-6 overflow-hidden rounded-xl border border-stroke-soft bg-linear-to-r from-brand to-accent p-6 text-white shadow-sm">
        <h1 className="text-2xl font-semibold">
          Hola, {firstName} 👋
        </h1>
        <p className="mt-1 text-sm text-white/80 capitalize">{today}</p>
        <p className="mt-3 text-sm text-white/90">
          Este es el resumen general del sistema de Recursos Humanos.
        </p>
      </div>

      <div className="grid-stack" ref={gridRef}>
        {/* CARDS */}
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div key={card.title} className="grid-stack-item" gs-w="3" gs-h="2">
              <div className="grid-stack-item-content flex items-center justify-between gap-4 rounded-xl border border-stroke-soft bg-surface p-6 shadow-sm transition-all duration-300 hover:border-brand hover:shadow-md">
                <div className="min-w-0">
                  <p className="text-sm text-ink-muted">{card.title}</p>
                  {loading ? (
                    <div className="mt-2 h-7 w-16 animate-pulse rounded-md bg-stroke-soft" />
                  ) : (
                    <h3 className="text-2xl font-semibold text-ink">
                      {card.value ?? 0}
                    </h3>
                  )}
                </div>

                <div
                  className={`grid h-12 w-12 shrink-0 place-items-center rounded-lg ${card.chip}`}
                >
                  <Icon className={card.fg} size={26} />
                </div>
              </div>
            </div>
          );
        })}

        {/* ACTIVIDAD */}
        <div className="grid-stack-item" gs-w="12" gs-h="5">
          <div className="grid-stack-item-content overflow-hidden rounded-xl border border-stroke-soft bg-surface p-6 shadow-sm transition-all duration-300 hover:border-brand hover:shadow-md">
            <h3 className="mb-4 font-semibold text-ink">Actividad mensual</h3>

            <div className="h-75">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={activityChart}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#616161' }} />
                  <YAxis tick={{ fontSize: 12, fill: '#616161' }} />
                  <Tooltip />
                  <Legend />
                  <Line
                    name="Acciones"
                    dataKey="actions"
                    stroke={BRAND}
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    name="Horas extras"
                    dataKey="extras"
                    stroke={SUCCESS}
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    name="Ausencias"
                    dataKey="absences"
                    stroke={DANGER}
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* CUMPLEAÑOS */}
        <div className="grid-stack-item" gs-w="6" gs-h="5">
          <div className="grid-stack-item-content overflow-hidden rounded-xl border border-stroke-soft bg-surface p-6 shadow-sm transition-all duration-300 hover:border-brand hover:shadow-md">
            <h3 className="mb-4 font-semibold text-ink">
              Cumpleaños del personal
            </h3>

            <div className="h-70">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={birthdayChart}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#616161' }} />
                  <YAxis tick={{ fontSize: 12, fill: '#616161' }} />
                  <Tooltip />
                  <Bar dataKey="cumpleanos" fill={BRAND} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* DEPARTAMENTOS */}
        <div className="grid-stack-item" gs-w="6" gs-h="5">
          <div className="grid-stack-item-content overflow-hidden rounded-xl border border-stroke-soft bg-surface p-6 shadow-sm transition-all duration-300 hover:border-brand hover:shadow-md">
            <h3 className="mb-4 font-semibold text-ink">
              Empleados por departamento
            </h3>

            <div className="h-70">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={departamentChart}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={90}
                    label
                  >
                    {departamentChart.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ManagerPage;
