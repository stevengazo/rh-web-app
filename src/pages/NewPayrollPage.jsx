// Libraries
import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import Employee_PayrollApi from '../api/Employee_PayrollApi';

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
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

/* COMPONENTE PRINCIPAL */
const NewPayrollPage = () => {
  const { id } = useParams();
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
        workShift: emp.workShift ?? '',

        daysWorked: 15,
        effectiveness: 100,

        payrollId: id,
        payrollData: null,

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

  /* GUARDAR (ENVÍO AL API) */
  const handleSave = async () => {
    try {
      console.table(payrollByEmployee);

      const payrollList = Object.values(payrollByEmployee);

      for (const payroll of payrollList) {
        await Employee_PayrollApi.create(payroll);
      }

      toast.success('Agregado al API');
    } catch (error) {
      console.error('Error guardando nómina:', error);
      toast.error('Error al guardar la nómina');
    }
  };

  /* RESUMEN GLOBAL */
  const payrollResume = useMemo(() => {
    const payrollList = Object.values(payrollByEmployee);

    return payrollList.reduce(
      (acc, emp) => {
        acc.totalExtras +=
          (emp.overtimeAmount || 0) +
          (emp.holidayAmount || 0) +
          (emp.holidayOvertimeAmount || 0);

        acc.totalDeductions +=
          (emp.totalDeductions || 0) +
          (emp.unPaidLeaveAmount || 0) +
          (emp.medicalLeaveAmount || 0) +
          (emp.absenceAmount || 0);

        acc.association += emp.associationAmount || 0; // si lo agregas luego
        acc.ccss += emp.ccssAmount || 0; // si lo agregas luego

        acc.totalToPay += emp.netAmount || 0;

        return acc;
      },
      {
        totalExtras: 0,
        totalDeductions: 0,
        association: 0,
        ccss: 0,
        totalToPay: 0,
      }
    );
  }, [payrollByEmployee]);

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
                  onChanged={handleRowChange}
                />
              ))}
            </tbody>
          </table>
        </div>

        <SectionTitle>Resumen</SectionTitle>
        <PayrollResumeTable resume={payrollResume} />
      </div>

      <div className="flex gap-4">
        <PrimaryButton onClick={handleSave}>Guardar Planilla</PrimaryButton>
        <SecondaryButton>Cancelar</SecondaryButton>
      </div>
    </motion.div>
  );
};

export default NewPayrollPage;
