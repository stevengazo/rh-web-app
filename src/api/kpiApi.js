import apiClient from './apiClient';

/**
 * API client para la gestión de KPIs (Objetivos).
 * Proporciona métodos para realizar operaciones CRUD contra el backend.
 */
const kpiApi = {
  /**
   * Obtiene la lista de todos los KPIs.
   *
   * @returns {Promise<import("axios").AxiosResponse<any>>}
   * Promesa con la respuesta del servidor que contiene el listado de KPIs.
   */
  getAllKPIs: () => {
    return apiClient.get('/Objetives');
  },

  /**
   * Obtiene un KPI específico por su identificador.
   *
   * @param {number|string} id - Identificador único del KPI.
   * @returns {Promise<import("axios").AxiosResponse<any>>}
   * Promesa con la información del KPI solicitado.
   */
  getKPIById: (id) => {
    return apiClient.get(`/Objetives/${id}`);
  },

  /**
   * Crea un nuevo KPI.
   *
   * @param {Object} KPI - Objeto con la información del KPI a crear.
   * @returns {Promise<import("axios").AxiosResponse<any>>}
   * Promesa con la respuesta del servidor tras crear el KPI.
   */
  createKPI: (KPI) => {
    return apiClient.post(`/Objetives`, KPI);
  },

  /**
   * Actualiza un objetivo (KPI) existente. El backend toma
   * `{ title, description, isActive, objetiveCategoryId }`.
   *
   * @param {number|string} id
   * @param {Object} kpi
   * @returns {Promise<import("axios").AxiosResponse<any>>}
   */
  updateKPI: (id, kpi) => {
    return apiClient.put(`/Objetives/${id}`, kpi);
  },

  /**
   * Elimina un KPI por su identificador.
   *
   * @param {number|string} id - Identificador único del KPI.
   * @returns {Promise<import("axios").AxiosResponse<any>>}
   * Promesa con la respuesta del servidor tras eliminar el KPI.
   */
  deleteKPI: (id) => {
    return apiClient.delete(`/Objetives/${id}`);
  },
};

export default kpiApi;
