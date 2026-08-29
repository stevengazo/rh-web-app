import apiClient from './apiClient';

/**
 * Registro de auditoría.
 *
 * Solo lectura: las entradas las escribe `AppDbContext` al guardar, no un
 * controlador. Un historial que se puede editar no sirve como historial.
 */
const auditApi = {
  /**
   * Entradas más recientes, con filtros y paginado.
   *
   * @param {object} filtros `{ entity, entityId, action, userId, search,
   *        from, to, page, pageSize }`
   */
  getLogs: (filtros = {}) => apiClient.get('/Audit', { params: filtros }),

  /** Una entrada con el detalle campo por campo. */
  getLog: (id) => apiClient.get(`/Audit/${id}`),

  /** Valores que existen de verdad en el registro, para armar los filtros. */
  getFilters: () => apiClient.get('/Audit/filters'),

  /** Historial completo de un registro concreto. */
  getByEntity: (entity, entityId) =>
    apiClient.get(`/Audit/entity/${entity}/${entityId}`),

  /** Actividad de los últimos días. */
  getStats: (days = 7) => apiClient.get('/Audit/stats', { params: { days } }),
};

export default auditApi;
