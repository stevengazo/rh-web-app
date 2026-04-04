import { useEffect, useState } from 'react';

import EmployeeApi from '../api/employeesApi';
import actionApi from '../api/actionApi';
import extrasApi from '../api/extrasApi';
import absencesApi from '../api/absencesApi';
import DepartamentApi from '../api/departamentApi';

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

export const useManagerDashboard = (user) => {
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
           DEPARTAMENTOS
        ============================= */

        const deptMap = {};

        employees.forEach((emp) => {
          const dept = emp?.departament?.name || 'Sin dept.';
          deptMap[dept] = (deptMap[dept] || 0) + 1;
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

    if (user) loadDashboardData();
  }, [user]);

  const totalAbsences = activityChart.reduce((a, b) => a + b.absences, 0);
  const totalExtras = activityChart.reduce((a, b) => a + b.extras, 0);

  return {
    loading,
    countEmployees,
    countActions,
    activityChart,
    birthdayChart,
    departamentChart,
    totalAbsences,
    totalExtras,
  };
};
