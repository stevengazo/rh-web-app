import apiClient from "./apiClient";

/**
 * API para la gestión de preguntas (Questions).
 * Proporciona métodos para consultar, crear, actualizar y eliminar
 * preguntas dentro del sistema.
 */
const questionApi = {
  /**
   * Obtiene todas las preguntas registradas.
   *
   * @returns {Promise} Promesa con la respuesta del servidor.
   */
  getAllQuestions: () => {
    return apiClient.get(`/Questions`);
  },

  /**
   * Obtiene una pregunta por su identificador.
   *
   * @param {number|string} id - Identificador de la pregunta.
   * @returns {Promise} Promesa con la respuesta del servidor.
   */
  getQuestionById: (id) => {
    return apiClient.get(`/Questions/${id}`);
  },

  /**
   * Crea una nueva pregunta.
   *
   * @param {Object} question - Objeto que contiene los datos de la pregunta.
   * @returns {Promise} Promesa con la respuesta del servidor.
   */
  createQuestion: (question) => {
    return apiClient.post(`/Questions`, question);
  },

  /**
   * Actualiza una pregunta existente.
   *
   * @param {number|string} id - Identificador de la pregunta.
   * @param {Object} question - Objeto con los datos actualizados de la pregunta.
   * @returns {Promise} Promesa con la respuesta del servidor.
   */
  updateQuestion: (id, question) => {
    return apiClient.put(`/Questions/${id}`, question);
  },

  /**
   * Elimina una pregunta.
   *
   * @param {number|string} id - Identificador de la pregunta.
   * @returns {Promise} Promesa con la respuesta del servidor.
   */
  deleteQuestion: (id) => {
    return apiClient.delete(`/Questions/${id}`);
  },
};

export default questionApi;
