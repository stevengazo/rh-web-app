import apiClient from './apiClient';

/**
 * API para la gestión de categorías de objetivos (ObjetiveCategories).
 * Proporciona métodos para consultar, crear, actualizar y eliminar
 * categorías de objetivos dentro del sistema.
 */
const ObjetiveCategories = {
  /**
   * Obtiene todas las categorías de objetivos registradas.
   *
   * @returns {Promise} Promesa con la respuesta del servidor.
   */
  getAllObjetiveCategories: () => {
    return apiClient.get(`/ObjetiveCategories`);
  },

  /**
   * Obtiene una categoría de objetivo por su identificador.
   *
   * @param {number|string} id - Identificador de la categoría de objetivo.
   * @returns {Promise} Promesa con la respuesta del servidor.
   */
  getObjetiveCategoryById: (id) => {
    return apiClient.get(`/ObjetiveCategories`);
  },

  /**
   * Crea una nueva categoría de objetivo.
   *
   * @param {Object} objetiveCat - Objeto que contiene los datos de la categoría de objetivo.
   * @returns {Promise} Promesa con la respuesta del servidor.
   */
  createObjetiveCategory: (objetiveCat) => {
    return apiClient.post(`/ObjetiveCategories`, objetiveCat);
  },

  /**
   * Actualiza una categoría de objetivo existente.
   *
   * @param {number|string} id - Identificador de la categoría de objetivo.
   * @param {Object} objetiveCate - Objeto con los datos actualizados de la categoría de objetivo.
   * @returns {Promise} Promesa con la respuesta del servidor.
   */
  updateObjetiveCategory: (id, objetiveCate) => {
    return apiClient.put(`/ObjetiveCategories/${id}`, objetiveCate);
  },

  /**
   * Elimina una categoría de objetivo.
   *
   * @param {number|string} id - Identificador de la categoría de objetivo.
   * @returns {Promise} Promesa con la respuesta del servidor.
   */
  deleteObjetiveCategory: (id) => {
    return apiClient.delete(`/ObjetiveCategories/${id}`);
  },
};

export default ObjetiveCategories;
