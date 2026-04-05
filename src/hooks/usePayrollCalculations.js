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
  const [extras, setExtras] = useState(0);
  const [feriados, setFeriados] = useState(0);
  const [extrasFeriado, setExtrasFeriado] = useState(0);
  const [retroactivo, setRetroactivo] = useState(0);
  const [bonos, setBonos] = useState(0);
  const [comisiones, setComisiones] = useState(0);
  const [incCCSS, setIncCCSS] = useState(0);
  const [incINS, setIncINS] = useState(0);
  const [ausencias, setAusencias] = useState(0);

  const salarioMensual = payrollData?.monthlySalary || 0;

  const salarioBase = useMemo(() => {
    switch (typePayroll) {
      case 'Semanal':
    //    console.log(typePayroll);
        return salarioMensual / 4;
      case 'Quincenal':
    //    console.log(typePayroll);
        return salarioMensual / 2;
      default:
    //    console.log(typePayroll);
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

  const netoPagar = salarioBruto - deducciones;

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
    ]
  );

  // --- Guardamos el último valor enviado para evitar bucle infinito ---
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
    montoExtras,
    montoFeriados,
    montoExtrasFeriado,
    deducciones,
    salarioBruto,
    netoPagar,
    buildRowData,
  };
};
