import apiClient from './apiClient';

/**
 * Aplicación de pruebas psicométricas: asignar, responder, enviar, calificar y
 * revisar. El catálogo va en `psychometricTestsApi`.
 *
 * Devuelven la respuesta Axios completa (convención del repo).
 */
const psychometricAssignmentsApi = {
  /** Todas, con filtros `{ status, testId, userId, search }`. */
  getAll: (params = {}) =>
    apiClient.get('/PsychometricAssignments', { params }),

  /** Contadores por estado, para las tarjetas del módulo. */
  getStats: () => apiClient.get('/PsychometricAssignments/stats'),

  /**
   * Resultados agregados (promedio por dimensión y por departamento) sobre las
   * aplicaciones ya enviadas.
   *
   * @param {{ testId?, departamentId? }} params
   */
  getAggregate: (params = {}) =>
    apiClient.get('/PsychometricAssignments/aggregate', { params }),

  /** Aplicaciones de un colaborador (portal y expediente). Sin puntajes. */
  getByUser: (userId) =>
    apiClient.get(`/PsychometricAssignments/user/${userId}`),

  /** Detalle: prueba embebida + respuestas + puntajes + colaborador. */
  getById: (id) => apiClient.get(`/PsychometricAssignments/${id}`),

  /** @param {{ testId, userId, dueDate?, userName? }} dto */
  assign: (dto) => apiClient.post('/PsychometricAssignments', dto),

  /** @param {{ testId, userIds:string[], dueDate?, userName? }} dto */
  assignBulk: (dto) => apiClient.post('/PsychometricAssignments/bulk', dto),

  /** Guardado parcial. `items`: `[{ questionId, value?, optionId? }]`. */
  saveResponses: (id, items) =>
    apiClient.put(`/PsychometricAssignments/${id}/responses`, items),

  /** Envía y calcula puntajes. 409 si faltan ítems. */
  submit: (id, userName) =>
    apiClient.post(`/PsychometricAssignments/${id}/submit`, { userName }),

  /** @param {{ notes?, userName? }} dto */
  review: (id, dto) =>
    apiClient.post(`/PsychometricAssignments/${id}/review`, dto),

  /** Vuelve a "En progreso" y borra los puntajes. */
  reopen: (id, userName) =>
    apiClient.post(`/PsychometricAssignments/${id}/reopen`, { userName }),

  remove: (id) => apiClient.delete(`/PsychometricAssignments/${id}`),
};

export default psychometricAssignmentsApi;
