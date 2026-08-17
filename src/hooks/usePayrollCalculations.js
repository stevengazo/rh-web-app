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
  /* Los campos editables se siembran con lo que ya viene en `payrollData`.
     Antes arrancaban siempre en 0 y el efecto de sincronización devolvía esos
     ceros al padre, así que al reabrir una planilla guardada se borraban las
     horas extra, bonos y deducciones que se habían capturado. */
  const num = (valor) => Number(valor) || 0;

  const [extras, setExtras] = useState(() => num(payrollData?.overTimeHours));
  const [feriados, setFeriados] = useState(() =>
    num(payrollData?.holidayDaysWorked)
  );
  const [extrasFeriado, setExtrasFeriado] = useState(() =>
    num(payrollData?.holidayOvertimeHours)
  );
  const [retroactivo, setRetroactivo] = useState(() =>
    num(payrollData?.retroactivePay)
  );
  const [bonos, setBonos] = useState(() => num(payrollData?.bonus));
  const [comisiones, setComisiones] = useState(() =>
    num(payrollData?.comissions)
  );
  const [incCCSS, setIncCCSS] = useState(() => num(payrollData?.ccssDays));
  const [incINS, setIncINS] = useState(() => num(payrollData?.insDays));
  const [ausencias, setAusencias] = useState(() =>
    num(payrollData?.absenseTime)
  );
  const [pension, setPension] = useState(() => num(payrollData?.pension));
  const [garnishment, setGarnishment] = useState(() =>
    num(payrollData?.garnishment)
  );

  /* Aporte a la asociación: editable, porque no todos los colaboradores
     aportan. Si la fila no trae valor guardado se propone el 3% del salario
     de referencia. `PayrollRow` ya usaba este setter, que el hook no exponía:
     editar esa celda lanzaba "setter is not a function". */
  const [associationContribution, setAssociationContribution] = useState(() => {
    if (payrollData?.associationContribution !== undefined) {
      return num(payrollData.associationContribution);
    }
    return num(payrollData?.grossSalary ?? payrollData?.monthlySalary) * 0.03;
  });

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

  // --- Total deducciones ---
  const deducciones = useMemo(
    () =>
      (incCCSS + incINS + ausencias) * salarioDia +
      cCSSDeductionAmount +
      pension +
      garnishment +
      associationContribution,
    [
      incCCSS,
      incINS,
      ausencias,
      salarioDia,
      cCSSDeductionAmount,
      pension,
      garnishment,
      associationContribution,
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
      associationContribution,
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
      associationContribution,
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
    associationContribution,
    setAssociationContribution,
    montoExtras,
    montoFeriados,
    montoExtrasFeriado,
    deducciones,
    salarioBruto,
    netoPagar,
    buildRowData,
  };
};