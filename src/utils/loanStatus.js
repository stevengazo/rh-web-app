/**
 * Estado de un préstamo.
 *
 * Estaba copiado literalmente en `LoansPage`, `MyLoansPage` y `ViewLoanPage`;
 * al necesitarlo también en el expediente del colaborador se centralizó aquí
 * para que las cuatro pantallas lean el mismo criterio.
 */

/** Estados tal como los guarda el backend en `state`. */
export const LOAN_STATUS = {
  PENDING: 'Pendiente',
  APPROVED: 'Aprobado',
  REJECTED: 'Rechazado',
  PAID: 'Pagado',
};

/** Estado efectivo, tolerando préstamos viejos con `state` vacío o libre. */
export const estadoDePrestamo = (l) => {
  if (Object.values(LOAN_STATUS).includes(l?.state)) return l.state;
  return l?.approvedBy ? LOAN_STATUS.APPROVED : LOAN_STATUS.PENDING;
};

/** Saldo pendiente, calculado si la API no lo envía. */
export const saldoDePrestamo = (l) =>
  l?.balance ?? (l?.amount ?? 0) - (l?.paidAmount ?? 0);

/** Un préstamo solo se edita mientras está pendiente de aprobación. */
export const puedeEditarPrestamo = (l) =>
  estadoDePrestamo(l) === LOAN_STATUS.PENDING;

/** Avance de pago en porcentaje (0–100). */
export const progresoDePrestamo = (l) => {
  const monto = l?.amount ?? 0;
  const abonado = l?.paidAmount ?? 0;
  return monto > 0 ? Math.min(100, (abonado / monto) * 100) : 0;
};
