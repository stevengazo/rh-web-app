import apiClient from './apiClient';

/**
 * Catálogo de pruebas psicométricas: la plantilla, sus dimensiones y sus ítems.
 * La aplicación y los resultados van en `psychometricAssignmentsApi`.
 *
 * Todos los métodos devuelven la respuesta Axios completa (convención del repo).
 */
const psychometricTestsApi = {
  /** Lista de pruebas con contadores (dimensiones, ítems, aplicaciones). */
  getAll: () => apiClient.get('/PsychometricTests'),

  /** Detalle completo: dimensiones + ítems + opciones, y `locked`. */
  getById: (id) => apiClient.get(`/PsychometricTests/${id}`),

  /** @param {{ name, description?, instructions?, userName? }} dto */
  create: (dto) => apiClient.post('/PsychometricTests', dto),

  update: (id, dto) => apiClient.put(`/PsychometricTests/${id}`, dto),

  /** Exige ≥1 dimensión y ≥1 ítem. */
  activate: (id) => apiClient.post(`/PsychometricTests/${id}/activate`),
  deactivate: (id) => apiClient.post(`/PsychometricTests/${id}/deactivate`),

  /** Borrado lógico; 409 si ya tiene aplicaciones. */
  remove: (id) => apiClient.delete(`/PsychometricTests/${id}`),

  /* --- Dimensiones --- */
  addDimension: (testId, dto) =>
    apiClient.post(`/PsychometricTests/${testId}/dimensions`, dto),
  updateDimension: (testId, dimId, dto) =>
    apiClient.put(`/PsychometricTests/${testId}/dimensions/${dimId}`, dto),
  removeDimension: (testId, dimId) =>
    apiClient.delete(`/PsychometricTests/${testId}/dimensions/${dimId}`),

  /* --- Ítems (llevan sus opciones inline) --- */
  addQuestion: (testId, dto) =>
    apiClient.post(`/PsychometricTests/${testId}/questions`, dto),
  updateQuestion: (testId, qId, dto) =>
    apiClient.put(`/PsychometricTests/${testId}/questions/${qId}`, dto),
  removeQuestion: (testId, qId) =>
    apiClient.delete(`/PsychometricTests/${testId}/questions/${qId}`),
};

export default psychometricTestsApi;
