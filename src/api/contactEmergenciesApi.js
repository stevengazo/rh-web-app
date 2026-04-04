/**
 * @file contactEmergenciesApi.js
 * @description Cliente API para la gestión de contactos de emergencia con manejo seguro de errores y fallback.
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

const ContactEmergencies = {
  /**
   * Obtener todos los contactos de emergencia
   * @returns {Promise<Array>} Lista de contactos o vacía
   */
  getAllContactEmergencies: async () => {
    try {
      const res = await apiClient.get('/ContactEmergencies');
      return safeResponse(res, []);
    } catch (error) {
      return handleError(error, []);
    }
  },

  /**
   * Obtener contactos de emergencia por usuario
   * @param {number|string} id - ID del usuario
   * @returns {Promise<Array>} Lista de contactos o vacía
   */
  getContactEmergenciesByUser: async (id) => {
    if (!id) return [];

    try {
      const res = await apiClient.get(`/ContactEmergencies/user/${id}`);
   
      return safeResponse(res, []);
    } catch (error) {
      return handleError(error, []);
    }
  },

  /**
   * Obtener contacto de emergencia por ID
   * @param {number|string} id - ID del contacto
   * @returns {Promise<Object|null>} Contacto o null
   */
  getContactEmergenciesById: async (id) => {
    if (!id) return null;

    try {
      const res = await apiClient.get(`/ContactEmergencies/${id}`);
      return safeResponse(res, null);
    } catch (error) {
      return handleError(error, null);
    }
  },

  /**
   * Crear nuevo contacto de emergencia
   * @param {Object} contact - Datos del contacto
   * @returns {Promise<Object|null>} Contacto creado o null
   */
  createContactEmergency: async (contact) => {
    if (!contact) return null;

    try {
      const res = await apiClient.post('/ContactEmergencies', contact);
      return safeResponse(res, null);
    } catch (error) {
      return handleError(error, null);
    }
  },

  /**
   * Actualizar contacto de emergencia existente
   * @param {number|string} id - ID del contacto
   * @param {Object} contact - Datos actualizados
   * @returns {Promise<Object|null>} Contacto actualizado o null
   */
  updateContactEmergency: async (id, contact) => {
    if (!id || !contact) return null;

    try {
      const res = await apiClient.put(`/ContactEmergencies/${id}`, contact);
      return safeResponse(res, null);
    } catch (error) {
      return handleError(error, null);
    }
  },

  /**
   * Eliminar contacto de emergencia
   * @param {number|string} id - ID del contacto
   * @returns {Promise<boolean>} true si se eliminó, false si hubo error
   */
  deleteContactEmergency: async (id) => {
    if (!id) return false;

    try {
      await apiClient.delete(`/ContactEmergencies/${id}`);
      return true;
    } catch (error) {
      handleError(error, false);
      return false;
    }
  },
};

export default ContactEmergencies;