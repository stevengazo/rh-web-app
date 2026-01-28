import apiClient from './apiClient';

/**
 * API para la gestión de extras.
 * Proporciona métodos para consultar, crear, actualizar y eliminar
 * registros de extras asociados a usuarios.
 */
const extrasApi = {
  /**
   * Obtiene todos los extras registrados.
   *
   * @returns {Promise} Promesa con la respuesta del servidor.
   */
  getAllExtras: () => {
    return apiClient.get(`/Extras`);
  },

  /**
   * Obtiene un extra por su identificador.
   *
   * @param {number|string} id - Identificador del extra.
   * @returns {Promise} Promesa con la respuesta del servidor.
   */
  getExtraById: (id) => {
    return apiClient.get(`/Extras/${id}`);
  },

  /**
   * Obtiene todos los extras asociados a un usuario específico.
   *
   * @param {number|string} id - Identificador del usuario.
   * @returns {Promise} Promesa con la respuesta del servidor.
   */
  getExtrasByUser: (id) => {
    return apiClient.get(`/Extras/search?employeeId=${id}`);
  },

  /**
   * Crea un nuevo registro de extra.
   *
   * @param {Object} extra - Objeto que contiene los datos del extra.
   * @returns {Promise} Promesa con la respuesta del servidor.
   */
  createExtra: (extra) => {
    return apiClient.post(`/Extras`, extra);
  },

  /**
   * Actualiza un registro de extra existente.
   *
   * @param {number|string} id - Identificador del extra.
   * @param {Object} extra - Objeto con los datos actualizados del extra.
   * @returns {Promise} Promesa con la respuesta del servidor.
   */
  updateExtra: (id, extra) => {
    return apiClient.put(`/Extras/${id}`, extra);
  },

  /**
   * Elimina un registro de extra.
   *
   * @param {number|string} id - Identificador del extra.
   * @returns {Promise} Promesa con la respuesta del servidor.
   */
  deleteExtra: (id) => {
    return apiClient.delete(`/Extras/${id}`);
  },
};

export default extrasApi;
