import { motion } from 'framer-motion';
import { Users, UserPlus, CalendarCheck, BarChart3 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

import PageTitle from '../Components/PageTitle';
import SectionTitle from '../Components/SectionTitle';

/* Cards data */
const cards = [
  {
    title: 'Empleados',
    value: '128',
    icon: Users,
    color: 'text-indigo-600',
  },
  {
    title: 'Nuevos ingresos',
    value: '5',
    icon: UserPlus,
    color: 'text-emerald-600',
  },
  {
    title: 'Asistencias',
    value: '96%',
    icon: CalendarCheck,
    color: 'text-blue-600',
  },
  {
    title: 'Reportes',
    value: '12',
    icon: BarChart3,
    color: 'text-purple-600',
  },
];

/* Chart data */
const chartData = [
  { name: 'Ene', empleados: 120, planilla: 240 },
  { name: 'Feb', empleados: 130, planilla: 260 },
  { name: 'Mar', empleados: 128, planilla: 250 },
  { name: 'Abr', empleados: 135, planilla: 270 },
  { name: 'May', empleados: 140, planilla: 290 },
];

const ManagerPage = () => {
  const { user } = useAppContext();

  console.log('Usuario en ManagerPage:', user);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      {/* Titles */}
      <div>
        <SectionTitle>Resumen general del sistema</SectionTitle>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm p-5 flex items-center justify-between"
            >
              <div>
                <p className="text-sm text-slate-500">{card.title}</p>
                <h3 className="text-2xl font-bold text-slate-800">
                  {card.value}
                </h3>
              </div>
              <div className={card.color}>
                <Icon size={32} />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Chart */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-sm font-semibold text-slate-700 mb-4">
          Evolución de empleados y planilla
        </h3>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="empleados"
                stroke="#6366f1"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="planilla"
                stroke="#22c55e"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
};

export default ManagerPage;
