// Libraries
import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';

// Api Imports
import EmployeeApi from '../api/employeesApi';
import salaryApi from '../api/salaryApi';

// Generic components
import PageTitle from '../Components/PageTitle';
import SectionTitle from '../Components/SectionTitle';
import PrimaryButton from '../Components/PrimaryButton';
import SecondaryButton from '../Components/SecondaryButton';

// Complex components
import PayrollRow from '../Components/atoms/PayrollRow';
import PayrollResumeTable from '../Components/organisms/PayrollResumeTable';
import TablePayrollHeader from '../Components/molecules/tablePayrollHeader';

// Hooks
import useLatestSalaryMap from '../hooks/useLatestSalaryMap';

/* COMPONENTE PRINCIPAL */
const NewPayrollPage = () => {
  const [employees, setEmployees] = useState([]);
  const [salaries, setSalaries] = useState([]);

  // Registro completo por empleado (DTO backend)
  const [payrollByEmployee, setPayrollByEmployee] = useState({});

  // Asignación de salarios
  const salaryMap = useLatestSalaryMap(salaries);

  /*CARGA DE DATOS*/
  useEffect(() => {
    const loadData = async () => {
      const emp = await EmployeeApi.getAllEmployees();
      const sal = await salaryApi.getLatests();
      setEmployees(emp.data);
      setSalaries(sal.data);
    };
    loadData();
  }, []);
  /*
  useEffect(() => {
    console.log(salaryMap);
  }, [salaryMap]);
*/
  /*   REGISTRO BASE POR EMPLEADO */
  /* REGISTRO BASE POR EMPLEADO */
  useEffect(() => {
    if (!employees?.length || !salaryMap) return;

    const base = {};

    employees.forEach((emp) => {
      const salaryEntry = salaryMap[emp.id];

      // Si el empleado no tiene salario asignado, se omite
      if (!salaryEntry) return;

      const monthlySalary = salaryEntry.salaryAmount;

      const dailySalary = monthlySalary / 30;
      const hourlySalary = dailySalary / 8;

      base[emp.id] = {
        userId: emp.id,
        workShift: emp.workShift ?? null,

        daysWorked: 15,
        effectiveness: 100,

        monthlySalary,
        biweeklySalary: monthlySalary / 2,
        dailySalary,
        hourlySalary,

        regularHourRate: hourlySalary,
        overTimeHourRate: hourlySalary * 1.5,

        overTimeHours: 0,
        overtimeAmount: 0,

        holiDayRate: hourlySalary * 2,
        holidayDaysWorked: 0,
        holidayAmount: 0,

        holidayHourRate: hourlySalary * 2.5,
        holidayOvertimeHours: 0,
        holidayOvertimeAmount: 0,

        retroactivePay: 0,
        bonus: 0,
        comissions: 0,

        ccssDays: 0,
        insDays: 0,

        unPaidLeaveHours: 0,
        unPaidLeaveAmount: 0,

        medicalLeaveHours: 0,
        medicalLeaveAmount: 0,

        absenseTime: 0,
        absenceAmount: 0,

        grossSalary: monthlySalary,
        totalDeductions: 0,
        netAmount: monthlySalary,
      };
    });
    /*
    console.group('🧾 Payroll base generado');
    console.table(base);
    console.groupEnd();
    */

    setPayrollByEmployee(base);
  }, [employees, salaryMap]);

  /*ACTUALIZACIÓN DESDE LA FILA */
  const handleRowChange = (employeeId, rowData) => {
    setPayrollByEmployee((prev) => ({
      ...prev,
      [employeeId]: {
        ...prev[employeeId],
        ...rowData,
      },
    }));
  };

  /* GUARDAR (SOLO CONSOLA)*/
  const handleSave = () => {
    console.clear();
    console.table(
      Object.values(payrollByEmployee).map((p) => ({
        userId: p.userId,
        grossSalary: p.grossSalary,
        totalDeductions: p.totalDeductions,
        netAmount: p.netAmount,
      }))
    );
  };

  /*  RENDER */
  return (
    <motion.div className="space-y-10">
      <PageTitle>Generar Nueva Planilla</PageTitle>

      <div className="bg-white rounded-xl shadow">
        <SectionTitle>Detalle Completo de Planilla</SectionTitle>

        <div className="max-h-[70vh] overflow-x-auto overflow-y-auto">
          <table className="min-w-[2400px] text-xs border-collapse">
            <TablePayrollHeader />

            <tbody>
              {Object.values(payrollByEmployee).map((payroll, index) => (
                <PayrollRow
                  employee={employees.find((e) => e.id === payroll.userId)}
                  key={payroll.userId ?? index}
                  PayrollData={payroll}
                />
              ))}
            </tbody>
          </table>
        </div>

        <SectionTitle>Resumen</SectionTitle>
        <PayrollResumeTable />
      </div>

      <div className="flex gap-4">
        <PrimaryButton onClick={handleSave}>Guardar Planilla</PrimaryButton>
        <SecondaryButton>Cancelar</SecondaryButton>
      </div>
    </motion.div>
  );
};

export default NewPayrollPage;
