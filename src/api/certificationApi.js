/**
 * @file certificationApi.js
 * @description Cliente API para manejar certificaciones con manejo seguro de errores y fallback.
 */

import apiClient from './apiClient';

/**
 * Devuelve de forma segura la respuesta del API o un valor por defecto.
 * @param {object} response - Respuesta de axios.
 * @param {*} fallback - Valor por defecto si no hay datos.
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
 * @param {object} error - Error capturado
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

const certificationApi = {
  /**
   * Obtener todas las certificaciones
   * @returns {Promise<Array>} Lista de certificaciones o vacía
   */
  getAllCertifications: async () => {
    try {
      const res = await apiClient.get('/certifications');
      return safeResponse(res, []);
    } catch (error) {
      return handleError(error, []);
    }
  },

  /**
   * Obtener certificación por ID
   * @param {string|number} id - ID de la certificación
   * @returns {Promise<Object|null>} Certificación o null
   */
  getCertificationById: async (id) => {
    if (!id) return null;

    try {
      const res = await apiClient.get(`/certifications/${id}`);
      return safeResponse(res, null);
    } catch (error) {
      return handleError(error, null);
    }
  },

  /**
   * Obtener certificaciones de un usuario
   * @param {string|number} userId - ID del usuario
   * @returns {Promise<Array>} Lista de certificaciones o vacía
   */
  getCertificationsByUser: async (userId) => {
    console.log("USERID",userId)
  

    try {
      const res = await apiClient.get(`/Certifications/user/${userId}`);
      return safeResponse(res, []);
    } catch (error) {
      return handleError(error, []);
    }
  },

  /**
   * Crear nueva certificación
   * @param {Object} certification - Datos de la certificación
   * @returns {Promise<Object|null>} Certificación creada o null
   */
  createCertification: async (certification) => {
    if (!certification) return null;

    try {
      const res = await apiClient.post('/certifications', certification);
      return safeResponse(res, null);
    } catch (error) {
      return handleError(error, null);
    }
  },

  /**
   * Actualizar certificación existente
   * @param {string|number} id - ID de la certificación
   * @param {Object} certification - Datos actualizados
   * @returns {Promise<Object|null>} Certificación actualizada o null
   */
  updateCertification: async (id, certification) => {
    if (!id || !certification) return null;

    try {
      const res = await apiClient.put(`/certifications/${id}`, certification);
      return safeResponse(res, null);
    } catch (error) {
      return handleError(error, null);
    }
  },

  /**
   * Eliminar certificación
   * @param {string|number} id - ID de la certificación
   * @returns {Promise<boolean>} true si se eliminó, false si hubo error
   */
  deleteCertification: async (id) => {
    if (!id) return false;

    try {
      await apiClient.delete(`/certifications/${id}`);
      return true;
    } catch (error) {
      handleError(error, false);
      return false;
    }
  },
};

export default certificationApi;