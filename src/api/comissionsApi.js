import apiClient from './apiClient';

/**
 * API para la gestión de comisiones (Comissions).
 * Proporciona métodos para consultar, crear, actualizar y eliminar
 * comisiones asociadas a usuarios.
 */
const comissionsApi = {
  /**
   * Obtiene todas las comisiones registradas.
   *
   * @returns {Promise} Promesa con la respuesta del servidor.
   */
  getAllComisions: () => {
    return apiClient.get(`/comissions`);
  },

  /**
   * Obtiene una comisión por su identificador.
   *
   * @param {number|string} id - Identificador de la comisión.
   * @returns {Promise} Promesa con la respuesta del servidor.
   */
  getComissionById: (id) => {
    return apiClient.get(`/comissions/${id}`);
  },

  /**
   * Obtiene todas las comisiones asociadas a un usuario específico.
   *
   * @param {number|string} id - Identificador del usuario.
   * @returns {Promise} Promesa con la respuesta del servidor.
   */
  getComissionsByUser: (id) => {
    return apiClient.get(`/Comissions/user/${id}`);
  },

  /**
   * Crea una nueva comisión.
   *
   * @param {Object} comission - Objeto que contiene los datos de la comisión.
   * @returns {Promise} Promesa con la respuesta del servidor.
   */
  createComission: (comission) => {
    return apiClient.post(`/comissions`, comission);
  },

  /**
   * Actualiza una comisión existente.
   *
   * @param {number|string} id - Identificador de la comisión.
   * @param {Object} comission - Objeto con los datos actualizados de la comisión.
   * @returns {Promise} Promesa con la respuesta del servidor.
   */
  updateComission: (id, comission) => {
    return apiClient.put(`/comissions/${id}`, comission);
  },

  /**
   * Elimina una comisión.
   *
   * @param {number|string} id - Identificador de la comisión.
   * @returns {Promise} Promesa con la respuesta del servidor.
   */
  deleteComission: (id) => {
    return apiClient.delete(`/comissions/${id}`);
  },
};

export default comissionsApi;
