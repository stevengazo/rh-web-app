/**
 * Estado y duración de una solicitud de vacaciones.
 *
 * Se separa del componente para que la tabla exporte solo el componente
 * (requisito de Fast Refresh) y para que el mismo criterio lo puedan usar el
 * expediente, el perfil del colaborador y la línea de tiempo.
 */

/** Estados tal como los guarda el backend en `status`. */
export const VACATION_STATUS = {
  PENDING: 'Pendiente',
  APPROVED: 'Aprobada',
  REJECTED: 'Rechazada',
};

/** Estado efectivo, tolerando solicitudes previas al flujo de aprobación. */
export const estadoDeVacacion = (v) => {
  if (Object.values(VACATION_STATUS).includes(v?.status)) return v.status;
  return v?.approvedBy ? VACATION_STATUS.APPROVED : VACATION_STATUS.PENDING;
};

/** Días naturales que abarca la solicitud, ambos extremos incluidos. */
export const diasDeVacacion = (v) => {
  const a = new Date(v?.startDate);
  const b = new Date(v?.endDate ?? v?.startDate);
  if (Number.isNaN(a.getTime()) || Number.isNaN(b.getTime())) return 0;

  const d = Math.floor((b - a) / 86400000) + 1;
  return d > 0 ? d : 0;
};
