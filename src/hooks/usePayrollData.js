import { useEffect, useState, useMemo } from 'react';
import toast from 'react-hot-toast';
import EmployeeApi from '../api/employeesApi';
import salaryApi from '../api/salaryApi';
import Employee_PayrollApi from '../api/Employee_PayrollApi';
import payrollApi from '../api/payrollApi';
import useLatestSalaryMap from './useLatestSalaryMap';

const usePayrollData = (payrollId) => {
  const [employees, setEmployees] = useState([]);
  const [salaries, setSalaries] = useState([]);
  const [payroll, setPayroll] = useState({});
  const [payrollByEmployee, setPayrollByEmployee] = useState({});

  const salaryMap = useLatestSalaryMap(salaries);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [empRes, salRes] = await Promise.all([
          EmployeeApi.getAllEmployees(),
          salaryApi.getLatests(),
        ]);

        const payrollRes = await payrollApi.getPayrollById(payrollId);

        setEmployees(empRes.data);
        setSalaries(salRes.data);
        setPayroll(payrollRes.data);
      } catch (error) {
        console.error(error);
        toast.error('Error cargando la nómina o salarios');
      }
    };

    loadData();
  }, [payrollId]);

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
      cCSSDeductionAmount: monthlySalary *0.1067,
      garnishment:404,
      pension:404,
      associationContribution:404,
      absenseTime: 0,
      absenceAmount: 0,
      grossSalary: monthlySalary,
      totalDeductions: 0,
      netAmount: monthlySalary,
    };
  };

  // Inicialización segura usando useMemo
  const memoizedPayrollByEmployee = useMemo(() => {
    if (!employees.length || !salaryMap) return {};
    return employees.reduce((acc, emp) => {
      const salaryEntry = salaryMap[emp.id];
      if (!salaryEntry) return acc;
      acc[emp.id] = createPayrollEntry(emp, salaryEntry);
      return acc;
    }, {});
  }, [employees, salaryMap, payrollId]);

  // Solo establecemos estado si aún no hay datos
  useEffect(() => {
    if (Object.keys(payrollByEmployee).length === 0 && Object.keys(memoizedPayrollByEmployee).length > 0) {
      setPayrollByEmployee(memoizedPayrollByEmployee);
    }
  }, [memoizedPayrollByEmployee, payrollByEmployee]);

  const handleRowChange = (employeeId, rowData) => {
    setPayrollByEmployee((prev) => {
      const prevRow = prev[employeeId] || {};
      const hasChanged = Object.keys(rowData).some(
        (key) => prevRow[key] !== rowData[key]
      );
      if (!hasChanged) return prev;

      return {
        ...prev,
        [employeeId]: { ...prevRow, ...rowData },
      };
    });
  };

  const handleSave = async () => {
    try {
      const payrollList = Object.values(payrollByEmployee);
      await Promise.all(
        payrollList.map((payroll) => Employee_PayrollApi.create(payroll))
      );
      toast.success('Nómina guardada exitosamente');
    } catch (error) {
      console.error(error);
      toast.error('Error al guardar la nómina');
    }
  };

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