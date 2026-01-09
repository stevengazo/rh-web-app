import apiClient from './apiClient';

/**
 * API para la gestión de recordatorios (Reminders).
 * Proporciona métodos para consultar, crear, actualizar y eliminar
 * recordatorios dentro del sistema.
 */
const reminderApi = {
  /**
   * Obtiene todos los recordatorios registrados.
   *
   * @returns {Promise} Promesa con la respuesta del servidor.
   */
  getAllReminders: () => {
    return apiClient.get(`/Reminders`);
  },

  /**
   * Obtiene un recordatorio por su identificador.
   *
   * @param {number|string} id - Identificador del recordatorio.
   * @returns {Promise} Promesa con la respuesta del servidor.
   */
  getReminderById: (id) => {
    return apiClient.get(`/Reminders/${id}`);
  },

  /**
   * Crea un nuevo recordatorio.
   *
   * @param {Object} reminder - Objeto que contiene los datos del recordatorio.
   * @returns {Promise} Promesa con la respuesta del servidor.
   */
  createReminder: (reminder) => {
    return apiClient.post(`/Reminders`, reminder);
  },

  /**
   * Actualiza un recordatorio existente.
   *
   * @param {number|string} id - Identificador del recordatorio.
   * @param {Object} reminder - Objeto con los datos actualizados del recordatorio.
   * @returns {Promise} Promesa con la respuesta del servidor.
   */
  updateReminder: (id, reminder) => {
    return apiClient.put(`/Reminders/${id}`, reminder);
  },

  /**
   * Elimina un recordatorio.
   *
   * @param {number|string} id - Identificador del recordatorio.
   * @returns {Promise} Promesa con la respuesta del servidor.
   */
  deleteReminder: (id) => {
    return apiClient.delete(`/Reminders/${id}`);
  },
};

export default reminderApi;
