import apiClient from "./apiClient";

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
    return apiClient.get("/Objetives");
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
    return apiClient.post(`/Objetives/${id}`, KPI);
  },

  /**
   * Actualiza un KPI existente.
   *
   * @param {number|string} id - Identificador único del KPI.
   * @param {Object} KPI - Objeto con los datos actualizados del KPI.
   * @returns {Promise<import("axios").AxiosResponse<any>>}
   * Promesa con la respuesta del servidor tras actualizar el KPI.
   */
  updateCertification: (id, KPI) => {
    return apiClient.put(`/Objetives/${id}`, KPI);
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
  }
};

export default kpiApi;
