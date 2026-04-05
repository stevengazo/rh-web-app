import { useState, useMemo, useEffect } from 'react';

/**
 * Hook para calcular nómina de un empleado
 * @param {object} employee - Datos del empleado
 * @param {object} payrollData - Datos de salario base
 * @param {boolean} isStatic - Si es de solo lectura
 * @param {function} onChanged - Callback cuando cambian los cálculos
 */
export const usePayrollCalculations = ({ employee, payrollData, isStatic = false, onChanged }) => {
  if (!payrollData) {
    return { error: `${employee.firstName} ${employee.lastName} no tiene salario asignado` };
  }

  const salarioMensual = payrollData.monthlySalary;
  const salarioQuincenal = salarioMensual / 2;
  const salarioDia = salarioMensual / 30;
  const salarioHora = salarioDia / 8;

  // Estados de los campos variables
  const [extras, setExtras] = useState(0);
  const [feriados, setFeriados] = useState(0);
  const [extrasFeriado, setExtrasFeriado] = useState(0);
  const [retroactivo, setRetroactivo] = useState(0);
  const [bonos, setBonos] = useState(0);
  const [comisiones, setComisiones] = useState(0);
  const [incCCSS, setIncCCSS] = useState(0);
  const [incINS, setIncINS] = useState(0);
  const [ausencias, setAusencias] = useState(0);

  // Cálculos derivados
  const montoExtras = extras * (salarioHora * 1.5);
  const montoFeriados = feriados * salarioHora * 8 * 2;
  const montoExtrasFeriado = extrasFeriado * salarioHora * 2.5;
  const deducciones = (incCCSS + incINS + ausencias) * salarioDia;

  const salarioBruto = useMemo(() => 
    salarioMensual + montoExtras + montoFeriados + montoExtrasFeriado + retroactivo + bonos + comisiones,
    [salarioMensual, montoExtras, montoFeriados, montoExtrasFeriado, retroactivo, bonos, comisiones]
  );

  const netoPagar = salarioBruto - deducciones;

  const buildRowData = () => ({
    monthlySalary: salarioMensual,
    biweeklySalary: salarioQuincenal,
    dailySalary: salarioDia,
    hourlySalary: salarioHora,
    overTimeHours: extras,
    overtimeAmount: montoExtras,
    holidayDaysWorked: feriados,
    holidayAmount: montoFeriados,
    holidayOvertimeHours: extrasFeriado,
    holidayOvertimeAmount: montoExtrasFeriado,
    retroactivePay: retroactivo,
    bonus: bonos,
    comissions: comisiones,
    ccssDays: incCCSS,
    insDays: incINS,
    absenseTime: ausencias,
    grossSalary: salarioBruto,
    totalDeductions: deducciones,
    netAmount: netoPagar,
  });

  // Efecto para notificar cambios
  useEffect(() => {
    if (!isStatic) {
      onChanged(employee.id, buildRowData());
    }
  }, [extras, feriados, extrasFeriado, retroactivo, bonos, comisiones, incCCSS, incINS, ausencias, salarioBruto, deducciones, netoPagar]);

  return {
    salarioMensual,
    salarioQuincenal,
    salarioDia,
    salarioHora,
    extras, setExtras,
    feriados, setFeriados,
    extrasFeriado, setExtrasFeriado,
    retroactivo, setRetroactivo,
    bonos, setBonos,
    comisiones, setComisiones,
    incCCSS, setIncCCSS,
    incINS, setIncINS,
    ausencias, setAusencias,
    montoExtras,
    montoFeriados,
    montoExtrasFeriado,
    deducciones,
    salarioBruto,
    netoPagar,
    buildRowData,
  };
};