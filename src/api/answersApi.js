import apiClient from "./apiClient";

/**
 * API para la gestión de respuestas (Answers).
 * Contiene métodos para obtener, crear, actualizar y eliminar respuestas
 * mediante peticiones HTTP al backend.
 */
const answersApi = {
  /**
   * Obtiene todas las respuestas registradas.
   *
   * @returns {Promise} Promesa con la respuesta del servidor.
   */
  getAllAnswers: () => {
    return apiClient.get(`/answers`);
  },

  /**
   * Obtiene todas las respuestas asociadas a un usuario específico.
   *
   * @param {number|string} id - Identificador del usuario.
   * @returns {Promise} Promesa con la respuesta del servidor.
   */
  getAllByUser: (id) => {
    return apiClient.get(`/answers/user/${id}`);
  },

  /**
   * Crea una nueva respuesta.
   *
   * @param {Object} answer - Objeto que contiene los datos de la respuesta.
   * @returns {Promise} Promesa con la respuesta del servidor.
   */
  createAnswer: (answer) => {
    return apiClient.post(`/answers`, answer);
  },

  /**
   * Actualiza una respuesta existente.
   *
   * @param {number|string} id - Identificador de la respuesta.
   * @param {Object} answer - Objeto con los datos actualizados de la respuesta.
   * @returns {Promise} Promesa con la respuesta del servidor.
   */
  updateAnswer: (id, answer) => {
    return apiClient.put(`/answers/${id}`, answer);
  },

  /**
   * Elimina una respuesta.
   *
   * @returns {Promise} Promesa con la respuesta del servidor.
   */
  deleteAnswer: () => {
    return apiClient.delete(`/answers/${id}`);
  },
};

export default answersApi;
