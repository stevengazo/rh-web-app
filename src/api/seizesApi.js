import apiClient from './apiClient';

/**
 * API para la gestión de embargos (Seizes).
 * Proporciona métodos para consultar, crear, actualizar y eliminar
 * embargos dentro del sistema.
 */
const seizeApi = {
  /**
   * Obtiene todos los embargos registrados.
   *
   * @returns {Promise} Promesa con la respuesta del servidor.
   */
  getAllSeizes: () => {
    return apiClient.get(`Seizes`);
  },

  /**
   * Obtiene un embargo por su identificador.
   *
   * @param {number|string} id - Identificador del embargo.
   * @returns {Promise} Promesa con la respuesta del servidor.
   */
  getSeizeById: (id) => {
    return apiClient.get(`Seizes/${id}`);
  },

  /**
   * Crea un nuevo embargo.
   *
   * @param {Object} seize - Objeto que contiene los datos del embargo.
   * @returns {Promise} Promesa con la respuesta del servidor.
   */
  createSeize: (seize) => {
    return apiClient.post(`Seizes`, seize);
  },

  /**
   * Actualiza un embargo existente.
   *
   * @param {number|string} id - Identificador del embargo.
   * @param {Object} seize - Objeto con los datos actualizados del embargo.
   * @returns {Promise} Promesa con la respuesta del servidor.
   */
  updateSeize: (id, seize) => {
    return apiClient.put(`Seizes/${id}`, seize);
  },

  /**
   * Elimina un embargo.
   *
   * @param {number|string} id - Identificador del embargo.
   * @returns {Promise} Promesa con la respuesta del servidor.
   */
  deleteSeize: (id) => {
    return apiClient.delete(`Seizes/${id}`);
  },
};

export default seizeApi;
