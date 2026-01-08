import apiClient from "./apiClient";

/**
 * API para la gestión de premios (Awards).
 * Proporciona métodos para consultar, crear, actualizar y eliminar premios
 * asociados a usuarios.
 */
const awardApi = {
  /**
   * Obtiene todos los premios registrados.
   *
   * @returns {Promise} Promesa con la respuesta del servidor.
   */
  getAllAwards: () => {
    return apiClient.get(`/awards`);
  },

  /**
   * Obtiene un premio por su identificador.
   *
   * @param {number|string} id - Identificador del premio.
   * @returns {Promise} Promesa con la respuesta del servidor.
   */
  getAwardById: (id) => {
    return apiClient.get(`/awards/${id}`);
  },

  /**
   * Obtiene todos los premios asociados a un usuario específico.
   *
   * @param {number|string} id - Identificador del usuario.
   * @returns {Promise} Promesa con la respuesta del servidor.
   */
  getAwardsByUser: (id) => {
    return apiClient.get(`/awards/user/${id}`);
  },

  /**
   * Crea un nuevo premio.
   *
   * @param {Object} award - Objeto que contiene los datos del premio.
   * @returns {Promise} Promesa con la respuesta del servidor.
   */
  createAward: (award) => {
    return apiClient.post(`/awards`, award);
  },

  /**
   * Actualiza un premio existente.
   *
   * @param {number|string} id - Identificador del premio.
   * @param {Object} award - Objeto con los datos actualizados del premio.
   * @returns {Promise} Promesa con la respuesta del servidor.
   */
  updateAward: (id, award) => {
    return apiClient.put(`/awards/${id}`, award);
  },

  /**
   * Elimina un premio.
   *
   * @param {number|string} id - Identificador del premio.
   * @returns {Promise} Promesa con la respuesta del servidor.
   */
  deleteAward: (id) => {
    return apiClient.delete(`/awards/${id}`);
  },
};

export default awardApi;
