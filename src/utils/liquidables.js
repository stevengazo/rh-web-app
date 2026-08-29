/**
 * Horas extra y ausencias que una planilla liquida.
 *
 * El API (`GET /api/Payrolls/{id}/payable`) devuelve los registros aprobados
 * del periodo que ninguna otra planilla pagó. Aquí se agrupan por colaborador
 * y se convierten en las cifras que la fila de planilla necesita.
 *
 * Los montos salen **del registro**, no de un recálculo: la hora extra se
 * aprobó con un monto y ese es el que se paga, aunque el salario haya
 * cambiado después. Es el mismo criterio con el que `Employee_Payroll`
 * congela sus tarifas.
 */

/**
 * A partir de qué factor una hora extra cuenta como "de feriado".
 *
 * La planilla tiene dos casillas —extras normales y extras de feriado— y el
 * catálogo `ExtraType` tiene un factor libre. El corte en 2 separa el recargo
 * ordinario (1.5) del feriado (2 o 2.5), que es como se usa en la práctica.
 */
export const FACTOR_FERIADO = 2;

const suma = (registros, campo) =>
  registros.reduce((total, r) => total + (Number(r[campo]) || 0), 0);

const redondear = (n) => Math.round(n * 100) / 100;

/**
 * Agrupa por colaborador lo que la planilla puede liquidar.
 *
 * @param {{extras?: Array, absences?: Array}} payable Respuesta del API.
 * @returns {Object<string, {
 *   extras: Array, extrasFeriado: Array, ausencias: Array,
 *   horasExtra: number, montoExtra: number,
 *   horasExtraFeriado: number, montoExtraFeriado: number,
 *   diasAusencia: number, montoAusencia: number,
 * }>} Indexado por `userId`.
 */
export const agruparLiquidables = (payable) => {
  const porUsuario = {};

  const cubo = (userId) => {
    if (!porUsuario[userId]) {
      porUsuario[userId] = { extras: [], extrasFeriado: [], ausencias: [] };
    }
    return porUsuario[userId];
  };

  (payable?.extras ?? []).forEach((e) => {
    if (!e.userId) return;
    const destino = cubo(e.userId);

    if ((Number(e.factor) || 1) >= FACTOR_FERIADO) {
      destino.extrasFeriado.push(e);
    } else {
      destino.extras.push(e);
    }
  });

  (payable?.absences ?? []).forEach((a) => {
    // Una ausencia justificada no se rebaja, así que no entra en la planilla.
    if (!a.userId || a.justified) return;
    cubo(a.userId).ausencias.push(a);
  });

  Object.values(porUsuario).forEach((datos) => {
    datos.horasExtra = redondear(suma(datos.extras, 'hours'));
    datos.montoExtra = redondear(suma(datos.extras, 'amount'));

    datos.horasExtraFeriado = redondear(suma(datos.extrasFeriado, 'hours'));
    datos.montoExtraFeriado = redondear(suma(datos.extrasFeriado, 'amount'));

    /* La planilla mide la ausencia en días; el registro la guarda en horas
       sobre una jornada de 8. */
    datos.diasAusencia = redondear(suma(datos.ausencias, 'hours') / 8);
    datos.montoAusencia = redondear(suma(datos.ausencias, 'amount'));
  });

  return porUsuario;
};

/** Cubo vacío, para colaboradores sin nada que liquidar. */
export const SIN_LIQUIDABLES = Object.freeze({
  extras: [],
  extrasFeriado: [],
  ausencias: [],
  horasExtra: 0,
  montoExtra: 0,
  horasExtraFeriado: 0,
  montoExtraFeriado: 0,
  diasAusencia: 0,
  montoAusencia: 0,
});

/** ¿Hay algo que traer para este colaborador? */
export const tieneLiquidables = (datos) =>
  Boolean(
    datos &&
      (datos.extras.length ||
        datos.extrasFeriado.length ||
        datos.ausencias.length)
  );
