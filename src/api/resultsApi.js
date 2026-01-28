import apiClient from './apiClient';

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

  /**
   * 🔍 Búsqueda avanzada de resultados (filtros opcionales)
   *
   * @param {Object} filters
   * @param {number} [filters.user_ObjetiveId]
   * @param {string} [filters.createdBy]
   * @param {string} [filters.fromDate] YYYY-MM-DD
   * @param {string} [filters.toDate] YYYY-MM-DD
   * @param {number} [filters.minEvalution]
   * @param {number} [filters.maxEvalution]
   */
  searchResults: (filters = {}) => {
    return apiClient.get('/Results/search', {
      params: {
        user_ObjetiveId: filters.user_ObjetiveId,
        createdBy: filters.createdBy,
        fromDate: filters.fromDate,
        toDate: filters.toDate,
        minEvalution: filters.minEvalution,
        maxEvalution: filters.maxEvalution,
      },
    });
  },
};

export default resultsApi;
