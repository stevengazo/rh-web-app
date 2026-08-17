import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import toast from 'react-hot-toast';

import EmployeeApi from '../api/employeesApi';
import salaryApi from '../api/salaryApi';
import Employee_PayrollApi from '../api/Employee_PayrollApi';
import payrollApi from '../api/payrollApi';
import useLatestSalaryMap from './useLatestSalaryMap';

/** Días que abarca cada tipo de periodo. */
const DIAS_POR_TIPO = {
  Semanal: 7,
  Quincenal: 15,
  Mensual: 30,
};

const diasDelPeriodo = (tipo) => DIAS_POR_TIPO[tipo] ?? 15;

/** Estados en los que la planilla ya no admite cambios. */
const esEditable = (estado) => !estado || estado === 'Borrador';

/**
 * Construye la fila inicial de un empleado a partir de su salario vigente.
 * Solo son valores de arranque: la fila los recalcula al editarse.
 */
const filaNueva = (empleado, salarioEntry, payrollId, tipoPlanilla) => {
  const monthlySalary = Number(salarioEntry?.salaryAmount) || 0;
  const dailySalary = monthlySalary / 30;
  const hourlySalary = dailySalary / 8;
  const ccss = monthlySalary * 0.1067;

  return {
    // Sin `employee_PayrollId`: es una fila que todavía no existe en la base.
    userId: empleado.id,
    payrollId: Number(payrollId),
    workShift: empleado.jorney ?? '',
    daysWorked: diasDelPeriodo(tipoPlanilla),
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

    /* Deducciones: arrancan en cero salvo la CCSS obrera, que es de ley.
       Antes venían con 404 de relleno y eso se guardaba como dinero real. */
    cCSSDeductionAmount: ccss,
    garnishment: 0,
    pension: 0,
    associationContribution: 0,
    othersDeductions: 0,
    incomeTax: 0,

    grossSalary: monthlySalary,
    totalDeductions: ccss,
    netAmount: monthlySalary - ccss,
  };
};

/**
 * Estado de la pantalla de edición de una planilla.
 *
 * Carga la planilla con los detalles ya guardados, permite agregar y quitar
 * empleados, y al guardar sincroniza contra el servidor: crea los nuevos,
 * actualiza los existentes y borra los que se quitaron.
 *
 * @param {number|string} payrollId
 */
const usePayrollData = (payrollId) => {
  const [employees, setEmployees] = useState([]);
  const [salaries, setSalaries] = useState([]);
  const [payroll, setPayroll] = useState({});

  /** Filas visibles, indexadas por `userId`. */
  const [payrollByEmployee, setPayrollByEmployee] = useState({});
  /** Ids de `Employee_Payroll` que había en la base y el usuario quitó. */
  const [removedRowIds, setRemovedRowIds] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  /* Cada fila emite una primera sincronización al montarse (los cálculos
     derivados del salario). Esa no cuenta como edición del usuario; si
     contara, la planilla se marcaría como "con cambios" nada más abrirla. */
  const filasSincronizadas = useRef(new Set());

  const salaryMap = useLatestSalaryMap(salaries);

  const readOnly = !esEditable(payroll?.status);

  /* ------------------------------------------------------------------
     Carga
     ------------------------------------------------------------------ */
  const cargar = useCallback(async () => {
    if (!payrollId) return;

    setLoading(true);

    try {
      const [empRes, salRes, payrollRes] = await Promise.all([
        EmployeeApi.getAllEmployees(),
        salaryApi.getLatests(),
        payrollApi.getPayrollById(payrollId),
      ]);

      const listaEmpleados = empRes?.data ?? [];
      const planilla = payrollRes?.data ?? {};

      setEmployees(listaEmpleados);
      setSalaries(salRes?.data ?? []);
      setPayroll(planilla);

      // Las filas ya guardadas mandan sobre cualquier valor por defecto.
      const guardadas = planilla.payrolls ?? [];

      setPayrollByEmployee(
        guardadas.reduce((acc, fila) => {
          if (fila?.userId) acc[fila.userId] = fila;
          return acc;
        }, {})
      );

      setRemovedRowIds([]);
      setDirty(false);
      filasSincronizadas.current = new Set();
    } catch (error) {
      console.error(error);
      toast.error('No se pudo cargar la planilla');
    } finally {
      setLoading(false);
    }
  }, [payrollId]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  /* ------------------------------------------------------------------
     Empleados elegibles
     ------------------------------------------------------------------ */

  /** Activos, con salario vigente y que no estén ya en la planilla. */
  const availableEmployees = useMemo(() => {
    if (!employees.length) return [];

    return employees
      .filter((e) => e.isActive && !e.deleted)
      .filter((e) => salaryMap?.[e.id])
      .filter((e) => !payrollByEmployee[e.id]);
  }, [employees, salaryMap, payrollByEmployee]);

  /** Activos con salario pero sin fila: sirve para el aviso de "faltan". */
  const employeesWithoutSalary = useMemo(() => {
    if (!employees.length) return [];
    return employees.filter(
      (e) => e.isActive && !e.deleted && !salaryMap?.[e.id]
    );
  }, [employees, salaryMap]);

  /* ------------------------------------------------------------------
     Alta / baja de empleados
     ------------------------------------------------------------------ */

  /** Agrega uno o varios empleados a la planilla (solo en memoria). */
  const addEmployees = useCallback(
    (ids) => {
      const lista = Array.isArray(ids) ? ids : [ids];

      setPayrollByEmployee((prev) => {
        const siguiente = { ...prev };
        let agregados = 0;

        lista.forEach((id) => {
          if (siguiente[id]) return;

          const empleado = employees.find((e) => e.id === id);
          const salario = salaryMap?.[id];
          if (!empleado || !salario) return;

          siguiente[id] = filaNueva(
            empleado,
            salario,
            payrollId,
            payroll?.payrollType
          );
          agregados++;
        });

        if (agregados > 0) setDirty(true);
        return siguiente;
      });
    },
    [employees, salaryMap, payrollId, payroll?.payrollType]
  );

  /** Quita un empleado. Si su fila ya existía en la base, la marca para borrar. */
  const removeEmployee = useCallback((userId) => {
    setPayrollByEmployee((prev) => {
      const fila = prev[userId];
      if (!fila) return prev;

      if (fila.employee_PayrollId) {
        setRemovedRowIds((ids) => [...ids, fila.employee_PayrollId]);
      }

      const siguiente = { ...prev };
      delete siguiente[userId];
      return siguiente;
    });

    setDirty(true);
  }, []);

  /** Precarga a todos los elegibles que aún no estén incluidos. */
  const addAllAvailable = useCallback(() => {
    addEmployees(availableEmployees.map((e) => e.id));
  }, [addEmployees, availableEmployees]);

  /* ------------------------------------------------------------------
     Edición de filas
     ------------------------------------------------------------------ */
  const handleRowChange = useCallback((employeeId, rowData) => {
    const esPrimeraSincronizacion =
      !filasSincronizadas.current.has(employeeId);
    filasSincronizadas.current.add(employeeId);

    setPayrollByEmployee((prev) => {
      const prevRow = prev[employeeId];
      if (!prevRow) return prev;

      const hasChanged = Object.keys(rowData).some(
        (key) => prevRow[key] !== rowData[key]
      );
      if (!hasChanged) return prev;

      if (!esPrimeraSincronizacion) setDirty(true);

      return {
        ...prev,
        [employeeId]: { ...prevRow, ...rowData },
      };
    });
  }, []);

  /* ------------------------------------------------------------------
     Guardado
     ------------------------------------------------------------------ */
  const handleSave = useCallback(async () => {
    if (readOnly) {
      toast.error('La planilla está aprobada; reábrela para editarla.');
      return false;
    }

    setSaving(true);

    const filas = Object.values(payrollByEmployee);
    const nuevas = filas.filter((f) => !f.employee_PayrollId);
    const existentes = filas.filter((f) => f.employee_PayrollId);

    try {
      /* Se distingue crear de actualizar. Antes todo era POST, así que
         guardar dos veces duplicaba la planilla completa. */
      const resultados = await Promise.allSettled([
        ...nuevas.map((f) =>
          Employee_PayrollApi.create({ ...f, payrollId: Number(payrollId) })
        ),
        ...existentes.map((f) =>
          Employee_PayrollApi.update(f.employee_PayrollId, {
            ...f,
            payrollId: Number(payrollId),
          })
        ),
        ...removedRowIds.map((id) => Employee_PayrollApi.delete(id)),
      ]);

      const fallidos = resultados.filter((r) => r.status === 'rejected');

      if (fallidos.length > 0) {
        console.error('Errores al guardar la planilla:', fallidos);
        toast.error(
          `Se guardaron ${resultados.length - fallidos.length} de ${resultados.length} cambios. Revisa los que fallaron.`
        );
      } else {
        toast.success('Planilla guardada');
      }

      // Recargar para recuperar los ids reales de las filas recién creadas.
      await cargar();
      return fallidos.length === 0;
    } catch (error) {
      console.error(error);
      toast.error('Error al guardar la planilla');
      return false;
    } finally {
      setSaving(false);
    }
  }, [payrollByEmployee, removedRowIds, payrollId, readOnly, cargar]);

  /* ------------------------------------------------------------------
     Totales
     ------------------------------------------------------------------ */
  const payrollResume = useMemo(() => {
    return Object.values(payrollByEmployee).reduce(
      (acc, emp) => {
        acc.empleados += 1;
        acc.totalBruto += emp.grossSalary || 0;
        acc.totalExtras +=
          (emp.overtimeAmount || 0) +
          (emp.holidayAmount || 0) +
          (emp.holidayOvertimeAmount || 0);
        acc.totalDeductions += emp.totalDeductions || 0;
        acc.ccss += emp.cCSSDeductionAmount || 0;
        acc.association += emp.associationContribution || 0;
        acc.totalToPay += emp.netAmount || 0;
        return acc;
      },
      {
        empleados: 0,
        totalBruto: 0,
        totalExtras: 0,
        totalDeductions: 0,
        ccss: 0,
        association: 0,
        totalToPay: 0,
      }
    );
  }, [payrollByEmployee]);

  return {
    // datos
    employees,
    payroll,
    payrollByEmployee,
    payrollResume,
    availableEmployees,
    employeesWithoutSalary,

    // estado
    loading,
    saving,
    dirty,
    readOnly,
    pendingRemovals: removedRowIds.length,

    // acciones
    handleRowChange,
    handleSave,
    addEmployees,
    addAllAvailable,
    removeEmployee,
    reload: cargar,
  };
};

export default usePayrollData;
