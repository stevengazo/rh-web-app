import { useState, useMemo, useEffect } from 'react';

export const usePayrollCalculations = ({
  employee,
  payrollData,
  isStatic = false,
  onChanged,
  type = 'Mensual',
}) => {
  // --- Estados de ajustes y deducciones ---
  const [extras, setExtras] = useState(0);
  const [feriados, setFeriados] = useState(0);
  const [extrasFeriado, setExtrasFeriado] = useState(0);
  const [retroactivo, setRetroactivo] = useState(0);
  const [bonos, setBonos] = useState(0);
  const [comisiones, setComisiones] = useState(0);
  const [incCCSS, setIncCCSS] = useState(0);
  const [incINS, setIncINS] = useState(0);
  const [ausencias, setAusencias] = useState(0);

  // --- Salario mensual por defecto ---
  const salarioMensual = payrollData?.monthlySalary || 0;

  // --- Salario base según tipo ---
  const salarioBase = useMemo(() => {
    switch (type) {
      case 'Semanal': return salarioMensual / 4;
      case 'Quincenal': return salarioMensual / 2;
      default: return salarioMensual;
    }
  }, [salarioMensual, type]);

  const diasPeriodo = useMemo(() => {
    switch (type) {
      case 'Semanal': return 7;
      case 'Quincenal': return 15;
      default: return 30;
    }
  }, [type]);

 

  const salarioDia = salarioBase / diasPeriodo;
  const salarioHora = salarioDia / 8;

  // --- Montos adicionales ---
  const montoExtras = extras * salarioHora * 1.5;
  const montoFeriados = feriados * salarioHora * 8 * 2;
  const montoExtrasFeriado = extrasFeriado * salarioHora * 2.5;

  const deducciones = (incCCSS + incINS + ausencias) * salarioDia;

  const salarioBruto = useMemo(
    () =>
      salarioBase +
      montoExtras +
      montoFeriados +
      montoExtrasFeriado +
      retroactivo +
      bonos +
      comisiones,
    [salarioBase, montoExtras, montoFeriados, montoExtrasFeriado, retroactivo, bonos, comisiones]
  );

  const netoPagar = salarioBruto - deducciones;

  const buildRowData = () => ({
    payrollType: type,
    salarioBase,
    weeklySalary: salarioMensual / 4,
    biweeklySalary: salarioMensual / 2,
    monthlySalary: salarioMensual,
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

  // --- Efecto para actualizar fila ---
  useEffect(() => {
    if (!isStatic && payrollData) {
      onChanged(employee.id, buildRowData());
    }
  }, [
    extras,
    feriados,
    extrasFeriado,
    retroactivo,
    bonos,
    comisiones,
    incCCSS,
    incINS,
    ausencias,
    salarioBruto,
    deducciones,
    netoPagar,
    type,
    payrollData,
  ]);

  // --- Retorno ---
  if (!payrollData) {
    return { error: `${employee.firstName} ${employee.lastName} no tiene salario asignado` };
  }

  return {
    salarioMensual,
    salarioBase,
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