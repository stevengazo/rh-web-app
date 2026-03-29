import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, UserPlus, CalendarCheck, BarChart3 } from 'lucide-react';

import { useAppContext } from '../context/AppContext';
import EmployeeApi from '../api/employeesApi';
import actionApi from '../api/actionApi';
import extrasApi from '../api/extrasApi';
import absencesApi from '../api/absencesApi';
import DepartamentApi from '../api/departamentApi';

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

const months = [
  'Ene',
  'Feb',
  'Mar',
  'Abr',
  'May',
  'Jun',
  'Jul',
  'Ago',
  'Sep',
  'Oct',
  'Nov',
  'Dic',
];

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

  const [countEmployees, setCountEmployees] = useState(0);
  const [countActions, setCountActions] = useState(0);

  const [activityChart, setActivityChart] = useState([]);
  const [birthdayChart, setBirthdayChart] = useState([]);
  const [departamentChart, setDepartamentChart] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [
          employeesRes,
          actionsRes,
          extrasRes,
          absencesRes,
          departamentsRes,
        ] = await Promise.all([
          EmployeeApi.getAllEmployees(),
          actionApi.getAllActions(),
          extrasApi.getAllExtras(),
          absencesApi.getAllAbsences(),
          DepartamentApi.getAllDepartaments(),
        ]);

        const employees = employeesRes?.data || [];
        const actions = actionsRes?.data || [];
        const extras = extrasRes?.data || [];
        const absences = absencesRes?.data || [];
        const departaments = departamentsRes?.data || [];

        setCountEmployees(employees.length);
        setCountActions(actions.length);

        /* =============================
           ACTIVIDAD MENSUAL
        ============================= */

        const monthly = months.map((m) => ({
          name: m,
          actions: 0,
          extras: 0,
          absences: 0,
        }));

        actions.forEach((a) => {
          if (!a.actionDate) return;
          const month = new Date(a.actionDate).getMonth();
          monthly[month].actions++;
        });

        extras.forEach((e) => {
          if (!e.start) return;
          const month = new Date(e.start).getMonth();
          monthly[month].extras++;
        });

        absences.forEach((a) => {
          if (!a.startDate) return;
          const month = new Date(a.startDate).getMonth();
          monthly[month].absences++;
        });

        setActivityChart(monthly);

        /* =============================
           CUMPLEAÑOS
        ============================= */

        const birthdays = months.map((m) => ({
          name: m,
          cumpleanos: 0,
        }));

        employees.forEach((emp) => {
          if (!emp.birthDate) return;

          const month = new Date(emp.birthDate).getMonth();
          birthdays[month].cumpleanos++;
        });

        setBirthdayChart(birthdays);

        /* =============================
           EMPLEADOS POR DEPARTAMENTO
        ============================= */

        const deptMap = {};

        employees.forEach((emp) => {
          const dept = emp?.departament?.name || 'Sin dept.';

          if (!deptMap[dept]) {
            deptMap[dept] = 0;
          }

          deptMap[dept]++;
        });

        const deptChart = Object.keys(deptMap).map((key) => ({
          name: key,
          value: deptMap[key],
        }));

        setDepartamentChart(deptChart);
      } catch (error) {
        console.error('Error cargando dashboard', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [user]);

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
      value: activityChart.reduce((a, b) => a + b.absences, 0),
      icon: CalendarCheck,
      color: 'text-blue-600',
    },
    {
      title: 'Horas Extras',
      value: activityChart.reduce((a, b) => a + b.extras, 0),
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
              className=" rounded-xl shadow-sm p-6 flex justify-between"
            >
              <div>
                <p className="text-sm text-slate-500">{card.title}</p>

                <h3 className="text-2xl font-bold text-slate-800 ">
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

      {/* GRAFICOS EXTRA */}

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
