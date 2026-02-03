import apiClient from './apiClient';

/**
 * API para la gestión de contactos de emergencia.
 * Proporciona métodos para consultar, crear, actualizar y eliminar
 * contactos de emergencia asociados a usuarios.
 */
const ContactEmergencies = {
  /**
   * Obtiene todos los contactos de emergencia registrados.
   *
   * @returns {Promise} Promesa con la respuesta del servidor.
   */
  getAllContactEmergencies: () => {
    return apiClient.get(`/ContactEmergencies`);
  },
  getContactEmergenciesByUser: (id) => {
    return apiClient.get(`/ContactEmergencies/user/${id}`);
  },


  /**
   * Obtiene un contacto de emergencia por su identificador.
   *
   * @param {number|string} id - Identificador del contacto de emergencia.
   * @returns {Promise} Promesa con la respuesta del servidor.
   */
  getContactEmergenciesById: (id) => {
    return apiClient.get(`/ContactEmergencies/${id}`);
  },

  /**
   * Obtiene los contactos de emergencia asociados a un usuario específico.
   *
   * @param {number|string} id - Identificador del usuario.
   * @returns {Promise} Promesa con la respuesta del servidor.
   */
  getContactEmergenciesByUser: (id) => {
    return apiClient.get(`/ContactEmergencies/user/${id}`);
  },

  /**
   * Crea un nuevo contacto de emergencia.
   *
   * @param {Object} contact - Objeto que contiene los datos del contacto de emergencia.
   * @returns {Promise} Promesa con la respuesta del servidor.
   */
  createContactEmergency: (contact) => {
    return apiClient.post(`/ContactEmergencies`, contact);
  },

  /**
   * Actualiza un contacto de emergencia existente.
   *
   * @param {number|string} id - Identificador del contacto de emergencia.
   * @param {Object} contact - Objeto con los datos actualizados del contacto de emergencia.
   * @returns {Promise} Promesa con la respuesta del servidor.
   */
  updateContactEmergency: (id, contact) => {
    return apiClient.put(`/ContactEmergencies/${id}`, contact);
  },

  /**
   * Elimina un contacto de emergencia.
   *
   * @param {number|string} id - Identificador del contacto de emergencia.
   * @returns {Promise} Promesa con la respuesta del servidor.
   */
  deleteContactEmergency: (id) => {
    return apiClient.delete(`/ContactEmergencies/${id}`);
  },
};

export default ContactEmergencies;
