import apiClient from './apiClient';

/**
 * API para la gestión de preguntas asignadas a usuarios (User_Question).
 * Proporciona métodos para consultar, crear, actualizar y eliminar
 * preguntas asociadas a los usuarios.
 */
const user_questionApi = {
  /**
   * Obtiene todas las preguntas de usuarios registradas.
   *
   * @returns {Promise} Promesa con la respuesta del servidor.
   */
  getAllUser_Questions: () => {
    return apiClient.get(`/user_question`);
  },

  /**
   * Obtiene una pregunta de usuario por su identificador.
   *
   * @param {number|string} id - Identificador de la pregunta de usuario.
   * @returns {Promise} Promesa con la respuesta del servidor.
   */
  getUser_QuestionById: (id) => {
    return apiClient.get(`/user_question/${id}`);
  },

  /**
   * Crea una nueva pregunta para un usuario.
   *
   * @returns {Promise} Promesa con la respuesta del servidor.
   */
  createUser_Question: (user_question) => {
    return apiClient.post(`/user_question`, user_question);
  },

  /**
   * Actualiza una pregunta de usuario existente.
   *
   * @param {number|string} id - Identificador de la pregunta de usuario.
   * @param {Object} user_question - Objeto con los datos actualizados de la pregunta de usuario.
   * @returns {Promise} Promesa con la respuesta del servidor.
   */
  updateUser_Question: (id, user_question) => {
    return apiClient.put(`/user_question/${id}`, user_question);
  },

  /**
   * Elimina una pregunta de usuario.
   *
   * @param {number|string} id - Identificador de la pregunta de usuario.
   * @returns {Promise} Promesa con la respuesta del servidor.
   */
  deleteUser_Question: (id) => {
    return apiClient.delete(`/user_question/${id}`);
  },
};

export default user_questionApi;
