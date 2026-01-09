import apiClient from './apiClient';

/**
 * API para la gestión de pagos (Payments).
 * Proporciona métodos para consultar, crear, actualizar y eliminar
 * registros de pagos dentro del sistema.
 */
const paymentApi = {
  /**
   * Obtiene todos los pagos registrados.
   *
   * @returns {Promise} Promesa con la respuesta del servidor.
   */
  getAllPayments: () => {
    return apiClient.get(`/payments`);
  },

  /**
   * Obtiene un pago por su identificador.
   *
   * @param {number|string} id - Identificador del pago.
   * @returns {Promise} Promesa con la respuesta del servidor.
   */
  getPaymentById: (id) => {
    return apiClient.get(`/payments/${id}`);
  },

  /**
   * Crea un nuevo pago.
   *
   * @param {Object} payment - Objeto que contiene los datos del pago.
   * @returns {Promise} Promesa con la respuesta del servidor.
   */
  createPayment: (payment) => {
    return apiClient.post(`/payments`, payment);
  },

  /**
   * Actualiza un pago existente.
   *
   * @param {number|string} id - Identificador del pago.
   * @param {Object} payment - Objeto con los datos actualizados del pago.
   * @returns {Promise} Promesa con la respuesta del servidor.
   */
  updatePayment: (id, payment) => {
    return apiClient.put(`/payments/${id}`, payment);
  },

  /**
   * Elimina un pago.
   *
   * @param {number|string} id - Identificador del pago.
   * @returns {Promise} Promesa con la respuesta del servidor.
   */
  deletePayment: (id) => {
    return apiClient.delete(`/payments/${id}`);
  },
};

export default paymentApi;
