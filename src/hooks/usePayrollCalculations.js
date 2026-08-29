import { useState, useMemo, useCallback, useEffect, useRef } from 'react';

/**
 * Cálculos de nómina de un empleado.
 *
 * Las horas extra, las extras de feriado y el tiempo ausente pueden venir de
 * dos sitios:
 *
 * - **De los registros** (`liquidables`): las horas extra aprobadas y las
 *   ausencias del periodo que ninguna otra planilla pagó. Es el modo por
 *   defecto cuando hay registros, y los montos se toman tal cual quedaron
 *   aprobados, sin recalcular.
 * - **A mano**: quien edita puede desvincularse y teclear la cantidad, para
 *   casos excepcionales. Al volver al modo automático se recupera lo de los
 *   registros.
 *
 * Antes solo existía el modo a mano y no había forma de saber si unas horas
 * extra ya se habían pagado en otra planilla.
 */
export const usePayrollCalculations = ({
  employee,
  payrollData,
  isStatic = false,
  onChanged,
  typePayroll,
  liquidables,
  desdeRegistros = true,
}) => {
  /* Los campos editables se siembran con lo que ya viene en `payrollData`.
     Antes arrancaban siempre en 0 y el efecto de sincronización devolvía esos
     ceros al padre, así que al reabrir una planilla guardada se borraban las
     horas extra, bonos y deducciones que se habían capturado. */
  const num = (valor) => Number(valor) || 0;

  const hayRegistros = Boolean(
    liquidables &&
      (liquidables.extras.length ||
        liquidables.extrasFeriado.length ||
        liquidables.ausencias.length)
  );

  /* En modo automático estas tres no son estado: **son** los registros. Se
     derivan en cada render y el estado guarda solo lo tecleado a mano, que
     es lo que hay que recordar al alternar entre un modo y otro. */
  const [extrasManual, setExtras] = useState(() =>
    num(payrollData?.overTimeHours)
  );
  const [feriados, setFeriados] = useState(() =>
    num(payrollData?.holidayDaysWorked)
  );
  const [extrasFeriadoManual, setExtrasFeriado] = useState(() =>
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
  const [ausenciasManual, setAusencias] = useState(() =>
    num(payrollData?.absenceTime)
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

  const vinculado = desdeRegistros && hayRegistros;

  const extras = vinculado ? liquidables.horasExtra : extrasManual;
  const extrasFeriado = vinculado
    ? liquidables.horasExtraFeriado
    : extrasFeriadoManual;
  const ausencias = vinculado ? liquidables.diasAusencia : ausenciasManual;

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

  /* --- Montos adicionales ---

     Con registros vinculados se paga **el monto con el que se aprobó cada
     hora extra**, no una tarifa recalculada: si el salario subió después, la
     hora extra de hace tres semanas se paga como se aprobó. Es el mismo
     criterio con el que `Employee_Payroll` congela sus tarifas.

     Sin registros se cae al cálculo de siempre: horas × tarifa × recargo. */
  const montoExtras = vinculado
    ? liquidables.montoExtra
    : extras * salarioHora * 1.5;

  const montoFeriados = feriados * salarioHora * 8 * 2;

  const montoExtrasFeriado = vinculado
    ? liquidables.montoExtraFeriado
    : extrasFeriado * salarioHora * 2.5;

  /* La rebaja por ausencia también sale del registro cuando lo hay: allí se
     calculó con el salario vigente al momento de la ausencia. */
  const montoAusencias = vinculado
    ? liquidables.montoAusencia
    : ausencias * salarioDia;

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
      (incCCSS + incINS) * salarioDia +
      montoAusencias +
      cCSSDeductionAmount +
      pension +
      garnishment +
      associationContribution,
    [
      incCCSS,
      incINS,
      montoAusencias,
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
      absenceTime: ausencias,
      absenceAmount: montoAusencias,
      absenceRate: salarioDia,
      overTimeHourRate: salarioHora * 1.5,
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
      montoAusencias,
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
        'absenceTime',
        'absenceAmount',
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
    montoAusencias,
    deducciones,

    /* Vínculo con los registros: la fila lo usa para indicar de dónde salen
       las cifras y ofrecer el cambio a captura manual. */
    desdeRegistros: vinculado,
    hayRegistros,
    liquidables,

    /* Los setters de captura manual, para sembrarlos al desvincular. */
    aplicarManual: () => {
      if (!liquidables) return;
      setExtras(liquidables.horasExtra);
      setExtrasFeriado(liquidables.horasExtraFeriado);
      setAusencias(liquidables.diasAusencia);
    },
    salarioBruto,
    netoPagar,
    buildRowData,
  };
};