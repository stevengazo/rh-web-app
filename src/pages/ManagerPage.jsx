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
} from 'recharts';

import { GridStack } from 'gridstack';
import 'gridstack/dist/gridstack.min.css';

import SectionTitle from '../Components/SectionTitle';

const COLORS = [
  '#6366f1',
  '#22c55e',
  '#3b82f6',
  '#ef4444',
  '#f59e0b',
  '#8b5cf6',
];

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

  const cards = [
    {
      title: 'Empleados',
      value: countEmployees,
      icon: Users,
      color: 'text-indigo-600',
    },
    {
      title: 'Acciones',
      value: countActions,
      icon: UserPlus,
      color: 'text-emerald-600',
    },
    {
      title: 'Ausencias',
      value: totalAbsences,
      icon: CalendarCheck,
      color: 'text-blue-600',
    },
    {
      title: 'Horas Extras',
      value: totalExtras,
      icon: BarChart3,
      color: 'text-purple-600',
    },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <SectionTitle>Resumen general del sistema</SectionTitle>

      <div className="grid-stack" ref={gridRef}>
        {/* CARDS */}
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div key={card.title} className="grid-stack-item" gs-w="3" gs-h="2">
              <div className="grid-stack-item-content bg-white rounded-xl border-2 border-slate-300 shadow-md hover:border-indigo-500 hover:shadow-lg transition-all duration-300 p-6 flex justify-between">
                <div>
                  <p className="text-sm text-slate-500">{card.title}</p>
                  <h3 className="text-2xl font-bold text-slate-800">
                    {loading ? '...' : card.value}
                  </h3>
                </div>

                <Icon className={card.color} size={32} />
              </div>
            </div>
          );
        })}

        {/* ACTIVIDAD */}
        <div className="grid-stack-item" gs-w="12" gs-h="4">
          <div className="grid-stack-item-content bg-white p-6 rounded-xl border-2 border-slate-300 shadow-md hover:border-indigo-500 hover:shadow-lg transition-all duration-300">
            <h3 className="font-semibold mb-4">Actividad mensual</h3>

            <div className="h-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={activityChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />

                  <Line dataKey="actions" stroke="#6366f1" strokeWidth={2} />
                  <Line dataKey="extras" stroke="#22c55e" strokeWidth={2} />
                  <Line dataKey="absences" stroke="#ef4444" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* CUMPLEAÑOS */}
        <div className="grid-stack-item" gs-w="6" gs-h="4">
          <div className="grid-stack-item-content bg-white p-6 rounded-xl border-2 border-slate-300 shadow-md hover:border-indigo-500 hover:shadow-lg transition-all duration-300">
            <h3 className="font-semibold mb-4">Cumpleaños del personal</h3>

            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={birthdayChart}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="cumpleanos" fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* DEPARTAMENTOS */}
        <div className="grid-stack-item" gs-w="6" gs-h="4">
          <div className="grid-stack-item-content bg-white p-6 rounded-xl border-2 border-slate-300 shadow-md hover:border-indigo-500 hover:shadow-lg transition-all duration-300">
            <h3 className="font-semibold mb-4">Empleados por departamento</h3>

            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={departamentChart}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  label
                >
                  {departamentChart.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>

                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ManagerPage;