import apiClient from './apiClient';

/**
 * API para la gestión de tipos de extras (ExtraTypes).
 * Proporciona métodos para consultar, crear, actualizar y eliminar
 * los distintos tipos de extras disponibles en el sistema.
 */
const extraType = {
  /**
   * Obtiene todos los tipos de extras registrados.
   *
   * @returns {Promise} Promesa con la respuesta del servidor.
   */
  getallExtraTypes: () => {
    return apiClient.get(`/ExtraTypes`);
  },

  /**
   * Obtiene un tipo de extra por su identificador.
   *
   * @param {number|string} id - Identificador del tipo de extra.
   * @returns {Promise} Promesa con la respuesta del servidor.
   */
  getExtraTypeById: (id) => {
    return apiClient.get(`/ExtraTypes/${id}`);
  },



  /**
   * Crea un nuevo tipo de extra.
   *
   * @param {Object} extraType - Objeto que contiene los datos del tipo de extra.
   * @returns {Promise} Promesa con la respuesta del servidor.
   */
  createExtraType: (extraType) => {
    return apiClient.post(`/ExtraTypes`, extraType);
  },

  /**
   * Actualiza un tipo de extra existente.
   *
   * @param {number|string} id - Identificador del tipo de extra.
   * @param {Object} extraType - Objeto con los datos actualizados del tipo de extra.
   * @returns {Promise} Promesa con la respuesta del servidor.
   */
  updateExtraType: (id, extraType) => {
    return apiClient.put(`/ExtraTypes/${id}`, extraType);
  },

  /**
   * Elimina un tipo de extra.
   *
   * @param {number|string} id - Identificador del tipo de extra.
   * @returns {Promise} Promesa con la respuesta del servidor.
   */
  deleteExtraType: (id) => {
    return apiClient.delete(`/ExtraTypes/${id}`);
  },
};

export default extraType;
