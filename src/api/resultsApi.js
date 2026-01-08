import apiClient from "./apiClient";

/**
 * API para la gestión de resultados (Results).
 * Proporciona métodos para consultar, crear, actualizar y eliminar
 * resultados dentro del sistema.
 */
const resultsApi = {
  /**
   * Obtiene todos los resultados registrados.
   *
   * @returns {Promise} Promesa con la respuesta del servidor.
   */
  getAllResults: () => {
    return apiClient.get(`/Results`);
  },

  /**
   * Obtiene un resultado por su identificador.
   *
   * @param {number|string} id - Identificador del resultado.
   * @returns {Promise} Promesa con la respuesta del servidor.
   */
  getResultById: (id) => {
    return apiClient.get(`/Results/${id}`);
  },

  /**
   * Crea un nuevo resultado.
   *
   * @param {Object} result - Objeto que contiene los datos del resultado.
   * @returns {Promise} Promesa con la respuesta del servidor.
   */
  createResult: (result) => {
    return apiClient.post(`/Results`, result);
  },

  /**
   * Actualiza un resultado existente.
   *
   * @param {number|string} id - Identificador del resultado.
   * @param {Object} result - Objeto con los datos actualizados del resultado.
   * @returns {Promise} Promesa con la respuesta del servidor.
   */
  updateResult: (id, result) => {
    return apiClient.put(`/Results/${id}`, result);
  },

  /**
   * Elimina un resultado.
   *
   * @param {number|string} id - Identificador del resultado.
   * @returns {Promise} Promesa con la respuesta del servidor.
   */
  deleteResult: (id) => {
    return apiClient.delete(`/Results/${id}`);
  },
};

export default resultsApi;
