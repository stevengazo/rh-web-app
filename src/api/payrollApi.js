import apiClient from './apiClient';

/**
 * API para la gestión de planillas (Payrolls).
 * Proporciona métodos para consultar, crear, actualizar,
 * eliminar y buscar registros de planilla dentro del sistema.
 */
const payrollApi = {
  /**
   * Obtiene todas las planillas registradas.
   *
   * @returns {Promise} Promesa con la respuesta del servidor.
   */
  getAllPayrolls: () => {
    return apiClient.get(`/Payrolls`);
  },

  /**
   * Obtiene una planilla por su identificador.
   *
   * @param {number|string} id - Identificador de la planilla.
   * @returns {Promise} Promesa con la respuesta del servidor.
   */
  getPayrollById: (id) => {
    return apiClient.get(`/Payrolls/${id}`);
  },

  /**
   * Busca planillas según criterios específicos.
   *
   * @param {Object} params - Parámetros de búsqueda.
   * @returns {Promise} Promesa con la respuesta del servidor.
   */
  searchPayrolls: (params) => {
    return apiClient.get(`/Payrolls/search`, { params });
  },

  /**
   * Crea una nueva planilla.
   *
   * @param {Object} payroll - Objeto que contiene los datos de la planilla.
   * @returns {Promise} Promesa con la respuesta del servidor.
   */
  createPayroll: (payroll) => {
    return apiClient.post(`/Payrolls`, payroll);
  },

  /**
   * Actualiza una planilla existente.
   *
   * @param {number|string} id - Identificador de la planilla.
   * @param {Object} payroll - Objeto con los datos actualizados.
   * @returns {Promise} Promesa con la respuesta del servidor.
   */
  updatePayroll: (id, payroll) => {
    return apiClient.put(`/Payrolls/${id}`, payroll);
  },

  /**
   * Elimina una planilla.
   *
   * @param {number|string} id - Identificador de la planilla.
   * @returns {Promise} Promesa con la respuesta del servidor.
   */
  deletePayroll: (id) => {
    return apiClient.delete(`/Payrolls/${id}`);
  },
};

export default payrollApi;
