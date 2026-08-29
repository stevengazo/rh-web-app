/**
 * Tarifas derivadas del salario mensual.
 *
 * Las usan el registro de horas extra (para calcular el recargo) y el de
 * ausencias (para calcular la rebaja). Viven aquí para que ambos apliquen
 * exactamente el mismo criterio: si mañana la jornada deja de ser de 8 horas,
 * se cambia en un solo lugar.
 */

/** Jornada ordinaria con la que se derivan las tarifas. */
export const DIAS_MES = 30;
export const HORAS_DIA = 8;

/** Tarifa por día. `null` si no hay salario con el que calcular. */
export const tarifaDiaria = (salarioMensual) =>
  salarioMensual ? salarioMensual / DIAS_MES : null;

/** Tarifa por hora. `null` si no hay salario con el que calcular. */
export const tarifaPorHora = (salarioMensual) =>
  salarioMensual ? salarioMensual / DIAS_MES / HORAS_DIA : null;

/**
 * Salario vigente del colaborador: el más reciente por fecha de vigencia.
 *
 * @param {Array} salarios  Respuesta de `salaryApi.getSalariesByUser`.
 * @returns {number|null}
 */
export const salarioVigente = (salarios = []) => {
  const vigente = [...salarios]
    .filter((s) => s?.salaryAmount)
    .sort((a, b) => new Date(b.effectiveDate) - new Date(a.effectiveDate))[0];

  return vigente?.salaryAmount ?? null;
};
