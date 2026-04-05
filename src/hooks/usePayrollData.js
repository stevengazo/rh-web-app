import { useEffect, useState, useMemo } from 'react';
import toast from 'react-hot-toast';
import EmployeeApi from '../api/employeesApi';
import salaryApi from '../api/salaryApi';
import Employee_PayrollApi from '../api/Employee_PayrollApi';
import useLatestSalaryMap from './useLatestSalaryMap';
import payrollApi from '../api/payrollApi';

const usePayrollData = (payrollId) => {
  const [employees, setEmployees] = useState([]);
  const [salaries, setSalaries] = useState([]);
  const [payroll, setPayroll] = useState();
  const [payrollByEmployee, setPayrollByEmployee] = useState({});

  const salaryMap = useLatestSalaryMap(salaries);

  const GetPayrollAsync = async () => {
    try {
      const rest = await payrollApi.getPayrollById(payrollId);
      setPayroll(rest.data);
    } catch (error) {
      console.error(error);
    }
  };

  /** Carga inicial de empleados y salarios */
  useEffect(() => {
    const loadData = async () => {
      try {
        const [empRes, salRes] = await Promise.all([
          EmployeeApi.getAllEmployees(),
          salaryApi.getLatests(),
        ]);

        await GetPayrollAsync();

        setEmployees(empRes.data);
        setSalaries(salRes.data);
      } catch (error) {
        console.error('Error cargando datos de nómina:', error);
        toast.error('Error cargando empleados o salarios');
      }
    };
    loadData();
  }, []);

  /** Genera base de nómina por empleado */
  useEffect(() => {
    if (!employees.length || !salaryMap) return;

    const createPayrollEntry = (emp, salaryEntry) => {
      const monthlySalary = salaryEntry.salaryAmount;
      const dailySalary = monthlySalary / 30;
      const hourlySalary = dailySalary / 8;

      return {
        userId: emp.id,
        workShift: emp.workShift ?? '',
        daysWorked: 15,
        effectiveness: 100,
        payrollId,
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
    };

    const base = employees.reduce((acc, emp) => {
      const salaryEntry = salaryMap[emp.id];
      if (!salaryEntry) return acc;
      acc[emp.id] = createPayrollEntry(emp, salaryEntry);
      return acc;
    }, {});

    setPayrollByEmployee(base);
  }, [employees, salaryMap, payrollId]);

  /** Actualiza fila individual */
  const handleRowChange = (employeeId, rowData) => {
    setPayrollByEmployee((prev) => ({
      ...prev,
      [employeeId]: { ...prev[employeeId], ...rowData },
    }));
  };

  /** Guardar nómina al API */
  const handleSave = async () => {
    try {
      const payrollList = Object.values(payrollByEmployee);
      await Promise.all(
        payrollList.map((payroll) => Employee_PayrollApi.create(payroll))
      );
      toast.success('Nómina guardada exitosamente');
    } catch (error) {
      console.error('Error guardando nómina:', error);
      toast.error('Error al guardar la nómina');
    }
  };

  /** Resumen global de nómina */
  const payrollResume = useMemo(() => {
    return Object.values(payrollByEmployee).reduce(
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
        acc.association += emp.associationAmount || 0;
        acc.ccss += emp.ccssAmount || 0;
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

  return {
    employees,
    payrollByEmployee,
    handleRowChange,
    payroll,
    handleSave,
    payrollResume,
  };
};

export default usePayrollData;
