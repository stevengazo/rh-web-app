import apiClient from './apiClient';

/**
 * Motor de reglas de automatización: cuando ocurre un evento del sistema, si se
 * cumplen las condiciones, se ejecutan las acciones.
 */
const automationsApi = {
  getAll: () => apiClient.get('/Automations'),
  getStats: () => apiClient.get('/Automations/stats'),

  /** Catálogo de eventos (con sus campos), operadores, tipos de acción y pruebas. */
  getCatalog: () => apiClient.get('/Automations/catalog'),

  getById: (id) => apiClient.get(`/Automations/${id}`),
  getRuns: (id, take = 50) =>
    apiClient.get(`/Automations/${id}/runs`, { params: { take } }),

  /** @param {{ name, description?, triggerEvent, enabled, conditions, actions, userName? }} dto */
  create: (dto) => apiClient.post('/Automations', dto),
  update: (id, dto) => apiClient.put(`/Automations/${id}`, dto),

  enable: (id) => apiClient.post(`/Automations/${id}/enable`),
  disable: (id) => apiClient.post(`/Automations/${id}/disable`),
  remove: (id) => apiClient.delete(`/Automations/${id}`),

  /** Dry-run: evalúa las condiciones contra un JSON de ejemplo, sin efectos. */
  simulate: (id, sampleJson) =>
    apiClient.post(`/Automations/${id}/simulate`, { sampleJson }),
};

export default automationsApi;
