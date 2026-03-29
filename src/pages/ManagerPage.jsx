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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <SectionTitle>Resumen general del sistema</SectionTitle>

      {/* CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => {
          const Icon = card.icon;

          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="rounded-xl shadow-sm p-6 flex justify-between"
            >
              <div>
                <p className="text-sm text-slate-500">{card.title}</p>
                <h3 className="text-2xl font-bold text-slate-800">
                  {loading ? '...' : card.value}
                </h3>
              </div>

              <Icon className={card.color} size={32} />
            </motion.div>
          );
        })}
      </div>

      {/* ACTIVIDAD */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="font-semibold mb-4">Actividad mensual</h3>

        <div className="h-72">
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

      {/* GRAFICOS */}
      <div className="grid md:grid-cols-2 gap-6">
        
        {/* CUMPLEAÑOS */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="font-semibold mb-4">Cumpleaños del personal</h3>

          <div className="h-72">
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
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="font-semibold mb-4">Empleados por departamento</h3>

          <div className="h-72">
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