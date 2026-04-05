import { useState, useMemo, useCallback, useEffect, useRef } from 'react';

/**
 * Hook para cálculos de nómina de un empleado
 */
export const usePayrollCalculations = ({
  employee,
  payrollData,
  isStatic = false,
  onChanged,
  typePayroll,
}) => {
  // --- Estados de campos editables ---
  const [extras, setExtras] = useState(0);
  const [feriados, setFeriados] = useState(0);
  const [extrasFeriado, setExtrasFeriado] = useState(0);
  const [retroactivo, setRetroactivo] = useState(0);
  const [bonos, setBonos] = useState(0);
  const [comisiones, setComisiones] = useState(0);
  const [incCCSS, setIncCCSS] = useState(0);
  const [incINS, setIncINS] = useState(0);
  const [ausencias, setAusencias] = useState(0);
  const [pension, setPension] = useState(0);
  const [garnishment, setGarnishment] = useState(0);

  // --- Salario base del empleado ---
  const salarioMensual = payrollData?.monthlySalary || 0;

  const salarioBase = useMemo(() => {
    switch (typePayroll) {
      case 'Semanal':
        return salarioMensual / 4;
      case 'Quincenal':
        return salarioMensual / 2;
      default:
        return salarioMensual;
    }
  }, [salarioMensual, typePayroll]);

  const diasPeriodo = useMemo(() => {
    switch (typePayroll) {
      case 'Semanal':
        return 7;
      case 'Quincenal':
        return 15;
      default:
        return 30;
    }
  }, [typePayroll]);

  const salarioDia = salarioBase / diasPeriodo;
  const salarioHora = salarioDia / 8;

  // --- Cálculos de montos adicionales ---
  const montoExtras = extras * salarioHora * 1.5;
  const montoFeriados = feriados * salarioHora * 8 * 2;
  const montoExtrasFeriado = extrasFeriado * salarioHora * 2.5;

  // --- Salario bruto ---
  const salarioBruto = useMemo(
    () =>
      salarioBase +
      montoExtras +
      montoFeriados +
      montoExtrasFeriado +
      retroactivo +
      bonos +
      comisiones,
    [
      salarioBase,
      montoExtras,
      montoFeriados,
      montoExtrasFeriado,
      retroactivo,
      bonos,
      comisiones,
    ]
  );

  // --- Deducciones calculadas automáticamente ---
  const cCSSDeductionAmount = useMemo(() => salarioBruto * 0.1067, [salarioBruto]); // 10.67%
  const associationContributionAmount = useMemo(() => salarioBruto * 0.03, [salarioBruto]); // 3%

  // --- Total deducciones ---
  const deducciones = useMemo(
    () =>
      (incCCSS + incINS + ausencias) * salarioDia +
      cCSSDeductionAmount +
      pension +
      garnishment +
      associationContributionAmount,
    [
      incCCSS,
      incINS,
      ausencias,
      salarioDia,
      cCSSDeductionAmount,
      pension,
      garnishment,
      associationContributionAmount,
    ]
  );

  // --- Neto a pagar ---
  const netoPagar = salarioBruto - deducciones;

  // --- Construcción de datos para fila ---
  const buildRowData = useCallback(
    () => ({
      payrollType: typePayroll,
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
      cCSSDeductionAmount,
      pension,
      garnishment,
      associationContribution: associationContributionAmount,
      netAmount: netoPagar,
    }),
    [
      typePayroll,
      salarioBase,
      salarioMensual,
      salarioDia,
      salarioHora,
      extras,
      montoExtras,
      feriados,
      montoFeriados,
      extrasFeriado,
      montoExtrasFeriado,
      retroactivo,
      bonos,
      comisiones,
      incCCSS,
      incINS,
      ausencias,
      salarioBruto,
      deducciones,
      netoPagar,
      cCSSDeductionAmount,
      pension,
      garnishment,
      associationContributionAmount,
    ]
  );

  // --- Previene bucles infinitos al enviar cambios ---
  const lastSentRef = useRef(null);
  const currentData = useMemo(() => buildRowData(), [buildRowData]);

  useEffect(() => {
    if (!isStatic && payrollData) {
      const lastData = lastSentRef.current;
      const keysToCompare = [
        'grossSalary',
        'netAmount',
        'overtimeAmount',
        'holidayAmount',
        'holidayOvertimeAmount',
        'retroactivePay',
        'bonus',
        'comissions',
        'ccssDays',
        'insDays',
        'absenseTime',
        'pension',
        'garnishment',
        'associationContribution',
      ];

      const hasChanged = keysToCompare.some(
        (k) => lastData?.[k] !== currentData[k]
      );

      if (hasChanged) {
        onChanged(employee.id, currentData);
        lastSentRef.current = currentData;
      }
    }
  }, [currentData, employee.id, isStatic, payrollData, onChanged]);

  if (!payrollData) {
    return {
      error: `${employee.firstName} ${employee.lastName} no tiene salario asignado`,
    };
  }

  return {
    salarioMensual,
    salarioBase,
    salarioDia,
    salarioHora,
    extras,
    setExtras,
    feriados,
    setFeriados,
    extrasFeriado,
    setExtrasFeriado,
    retroactivo,
    setRetroactivo,
    bonos,
    setBonos,
    comisiones,
    setComisiones,
    incCCSS,
    setIncCCSS,
    incINS,
    setIncINS,
    ausencias,
    setAusencias,
    pension,
    setPension,
    garnishment,
    setGarnishment,
    cCSSDeductionAmount,
    associationContributionAmount,
    montoExtras,
    montoFeriados,
    montoExtrasFeriado,
    deducciones,
    salarioBruto,
    netoPagar,
    buildRowData,
  };
};