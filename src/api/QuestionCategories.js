import apiClient from './apiClient';

/**
 * API para la gestión de categorías de preguntas (QuestionCategories).
 * Proporciona métodos para consultar, crear, actualizar y eliminar
 * categorías de preguntas dentro del sistema.
 */
const questionCategoryApi = {
  /**
   * Obtiene todas las categorías de preguntas registradas.
   *
   * @returns {Promise} Promesa con la respuesta del servidor.
   */
  getAllQuestionCategories: () => {
    return apiClient.get(`/QuestionCategories`);
  },

  /**
   * Obtiene una categoría de pregunta por su identificador.
   *
   * @param {number|string} id - Identificador de la categoría de pregunta.
   * @returns {Promise} Promesa con la respuesta del servidor.
   */
  getQuestionCategoryById: (id) => {
    return apiClient.get(`/QuestionCategories/${id}`);
  },

  /**
   * Crea una nueva categoría de pregunta.
   *
   * @param {Object} questionCat - Objeto que contiene los datos de la categoría de pregunta.
   * @returns {Promise} Promesa con la respuesta del servidor.
   */
  createQuestionCategory: (questionCat) => {
    return apiClient.post(`/QuestionCategories`, questionCat);
  },

  /**
   * Actualiza una categoría de pregunta existente.
   *
   * @param {number|string} id - Identificador de la categoría de pregunta.
   * @param {Object} questionCategory - Objeto con los datos actualizados de la categoría de pregunta.
   * @returns {Promise} Promesa con la respuesta del servidor.
   */
  updateQuestionCategory: (id, questionCategory) => {
    return apiClient.put(`/QuestionCategories/${id}`, questionCategory);
  },

  /**
   * Elimina una categoría de pregunta.
   *
   * @param {number|string} id - Identificador de la categoría de pregunta.
   * @returns {Promise} Promesa con la respuesta del servidor.
   */
  deleteQuestionCategory: (id) => {
    return apiClient.delete(`/QuestionCategories/${id}`);
  },
};

export default questionCategoryApi;
