/**
 * @file comissionsApi.js
 * @description Cliente API para gestión de comisiones con manejo seguro de errores y fallback.
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

const comissionsApi = {
  /**
   * Obtener todas las comisiones
   * @returns {Promise<Array>} Lista de comisiones o vacía
   */
  getAllComisions: async () => {
    try {
      const res = await apiClient.get('/comissions');
      return safeResponse(res, []);
    } catch (error) {
      return handleError(error, []);
    }
  },

  /**
   * Obtener comisión por ID
   * @param {number|string} id - ID de la comisión
   * @returns {Promise<Object|null>} Comisión o null
   */
  getComissionById: async (id) => {
    if (!id) return null;

    try {
      const res = await apiClient.get(`/comissions/${id}`);
      return safeResponse(res, null);
    } catch (error) {
      return handleError(error, null);
    }
  },

  /**
   * Obtener comisiones de un usuario
   * @param {number|string} id - ID del usuario
   * @returns {Promise<Array>} Lista de comisiones o vacía
   */
  getComissionsByUser: async (id) => {
    if (!id) return [];

    try {
      const res = await apiClient.get(`/comissions/user/${id}`);
      return safeResponse(res, []);
    } catch (error) {
      return handleError(error, []);
    }
  },

  /**
   * Crear nueva comisión
   * @param {Object} comission - Datos de la comisión
   * @returns {Promise<Object|null>} Comisión creada o null
   */
  createComission: async (comission) => {
    if (!comission) return null;

    try {
      const res = await apiClient.post('/comissions', comission);
      return safeResponse(res, null);
    } catch (error) {
      return handleError(error, null);
    }
  },

  /**
   * Actualizar comisión existente
   * @param {number|string} id - ID de la comisión
   * @param {Object} comission - Datos actualizados
   * @returns {Promise<Object|null>} Comisión actualizada o null
   */
  updateComission: async (id, comission) => {
    if (!id || !comission) return null;

    try {
      const res = await apiClient.put(`/comissions/${id}`, comission);
      return safeResponse(res, null);
    } catch (error) {
      return handleError(error, null);
    }
  },

  /**
   * Eliminar comisión
   * @param {number|string} id - ID de la comisión
   * @returns {Promise<boolean>} true si se eliminó, false si hubo error
   */
  deleteComission: async (id) => {
    if (!id) return false;

    try {
      await apiClient.delete(`/comissions/${id}`);
      return true;
    } catch (error) {
      handleError(error, false);
      return false;
    }
  },
};

export default comissionsApi;