import apiClient from './apiClient';

/**
 * API para la gestión de vacaciones (Vacations).
 * Proporciona métodos para consultar, crear, actualizar y eliminar
 * registros de vacaciones dentro del sistema.
 */
const VacationsApi = {
  /**
   * Obtiene todas las vacaciones registradas.
   *
   * @returns {Promise} Promesa con la respuesta del servidor.
   */
  getAllVacations: () => {
    return apiClient.get(`/vacations`);
  },

  /**
   * Obtiene un registro de vacaciones por su identificador.
   *
   * @param {number|string} id - Identificador de la vacación.
   * @returns {Promise} Promesa con la respuesta del servidor.
   */
  getVacationById: (id) => {
    return apiClient.get(`/vacations/${id}`);
  },

  /**
   * getActionsByUser
   * =
   * Obtiene todas las vacacione asociadas a un usuario específico.
   *
   * Endpoint:
   *  GET /api/vacations/user/{userId}
   *
   * @param {string} userId - Identificador del usuario
   * @returns {Promise<import("axios").AxiosResponse>}
   */
  getVacationsByUser: (userId) => {
    return apiClient.get(`/vacations/user/${userId}`);
  },

  /**
   * Crea un nuevo registro de vacaciones.
   *
   * @param {Object} vacation - Objeto que contiene los datos de la vacación.
   * @returns {Promise} Promesa con la respuesta del servidor.
   */
  createVacation: (vacation) => {
    return apiClient.post(`/vacations`, vacation);
  },

  /**
   * Actualiza un registro de vacaciones existente.
   *
   * @param {number|string} id - Identificador de la vacación.
   * @param {Object} vacation - Objeto con los datos actualizados de la vacación.
   * @returns {Promise} Promesa con la respuesta del servidor.
   */
  updateVacation: (id, vacation) => {
    return apiClient.put(`/vacations/${id}`, vacation);
  },

  /**
   * Elimina un registro de vacaciones.
   *
   * @param {number|string} id - Identificador de la vacación.
   * @returns {Promise} Promesa con la respuesta del servidor.
   */
  deleteVacation: (id) => {
    return apiClient.delete(`/vacations/${id}`);
  },
};

export default VacationsApi;
