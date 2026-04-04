/**
 * @file courseApi.js
 * @description Cliente API para gestión de cursos con manejo seguro de errores y fallback.
 */

import apiClient from './apiClient';

/**
 * Devuelve de forma segura la respuesta del API o un valor por defecto.
 * @param {import("axios").AxiosResponse} response - Respuesta de axios
 * @param {*} fallback - Valor por defecto si no hay datos
 * @returns {*} data o fallback
 */
const safeResponse = (response, fallback) => {
  if (!response || !response.data) return fallback;
  return response.data;
};

/**
 * Maneja errores de API.
 * Para errores 404 devuelve el fallback silenciosamente.
 * Muestra advertencia en consola solo en modo desarrollo.
 * @param {any} error - Error capturado
 * @param {*} fallback - Valor por defecto
 * @returns {*} fallback
 */
const handleError = (error, fallback) => {
  if (error.response?.status === 404) {
    if (import.meta.env.MODE === 'development') {
      console.warn('API Warning: Recurso no encontrado (404)');
    }
    return fallback;
  }

  if (import.meta.env.MODE === 'development') {
    console.warn('API Error:', error.response?.data || error.message);
  }
  return fallback;
};

const courseApi = {
  /**
   * Obtener todos los cursos
   * @returns {Promise<Array>} Lista de cursos o vacía
   */
  getAllCourses: async () => {
    try {
      const res = await apiClient.get('/courses');
      return safeResponse(res, []);
    } catch (error) {
      return handleError(error, []);
    }
  },

  /**
   * Obtener curso por ID
   * @param {number|string} id - ID del curso
   * @returns {Promise<Object|null>} Curso o null
   */
  getCourseById: async (id) => {
    if (!id) return null;

    try {
      const res = await apiClient.get(`/courses/${id}`);
      return safeResponse(res, null);
    } catch (error) {
      return handleError(error, null);
    }
  },

  /**
   * Obtener cursos de un usuario
   * @param {number|string} userId - ID del usuario
   * @returns {Promise<Array>} Lista de cursos o vacía
   */
  getCoursesByUser: async (userId) => {
    if (!userId) return [];

    try {
      const res = await apiClient.get(`/courses/user/${userId}`);
      return safeResponse(res, []);
    } catch (error) {
      return handleError(error, []);
    }
  },

  /**
   * Crear nuevo curso
   * @param {Object} course - Datos del curso
   * @returns {Promise<Object|null>} Curso creado o null
   */
  createCourse: async (course) => {
    if (!course) return null;

    try {
      const res = await apiClient.post('/courses', course);
      return safeResponse(res, null);
    } catch (error) {
      return handleError(error, null);
    }
  },

  /**
   * Actualizar curso existente
   * @param {number|string} id - ID del curso
   * @param {Object} course - Datos actualizados
   * @returns {Promise<Object|null>} Curso actualizado o null
   */
  updateCourse: async (id, course) => {
    if (!id || !course) return null;

    try {
      const res = await apiClient.put(`/courses/${id}`, course);
      return safeResponse(res, null);
    } catch (error) {
      return handleError(error, null);
    }
  },

  /**
   * Eliminar curso
   * @param {number|string} id - ID del curso
   * @returns {Promise<boolean>} true si se eliminó, false si hubo error
   */
  deleteCourse: async (id) => {
    if (!id) return false;

    try {
      await apiClient.delete(`/courses/${id}`);
      return true;
    } catch (error) {
      handleError(error, false);
      return false;
    }
  },
};

export default courseApi;