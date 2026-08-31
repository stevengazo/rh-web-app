/**
 * Estado de una aplicación de prueba psicométrica.
 *
 * Asignada → En progreso → Completada → Revisada.
 * Los valores coinciden con `PsychometricStatus` del backend.
 */
export const PSYCH_STATUS = {
  ASSIGNED: 'Asignada',
  IN_PROGRESS: 'En progreso',
  COMPLETED: 'Completada',
  REVIEWED: 'Revisada',
};

/** Estado efectivo, tolerando aplicaciones viejas con `status` vacío. */
export const estadoDeAplicacion = (a) => {
  if (Object.values(PSYCH_STATUS).includes(a?.status)) return a.status;
  if (a?.reviewedAt) return PSYCH_STATUS.REVIEWED;
  if (a?.completedAt) return PSYCH_STATUS.COMPLETED;
  if (a?.startedAt) return PSYCH_STATUS.IN_PROGRESS;
  return PSYCH_STATUS.ASSIGNED;
};

/** El colaborador solo puede responder mientras no la ha enviado. */
export const puedeResponder = (a) => {
  const e = estadoDeAplicacion(a);
  return e === PSYCH_STATUS.ASSIGNED || e === PSYCH_STATUS.IN_PROGRESS;
};

/** RH revisa una prueba ya completada (o vuelve a revisarla). */
export const puedeRevisar = (a) => {
  const e = estadoDeAplicacion(a);
  return e === PSYCH_STATUS.COMPLETED || e === PSYCH_STATUS.REVIEWED;
};

/** El resultado (puntajes) existe una vez enviada. */
export const tieneResultado = (a) => {
  const e = estadoDeAplicacion(a);
  return e === PSYCH_STATUS.COMPLETED || e === PSYCH_STATUS.REVIEWED;
};

export const QUESTION_KIND = {
  LIKERT5: 'Likert5',
  MULTIPLE_CHOICE: 'MultipleChoice',
};

/** Etiquetas de la escala Likert de 1 a 5. */
export const LIKERT_LABELS = [
  'Totalmente en desacuerdo',
  'En desacuerdo',
  'Neutral',
  'De acuerdo',
  'Totalmente de acuerdo',
];
