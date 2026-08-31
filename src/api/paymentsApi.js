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

  getPaymentByLoan: (id) => {
    return apiClient.get(`/payments/loan/${id}`);
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
   * Actualiza un abono. El backend solo toma `{ amount, createdDate, editedBy }`
   * y recalcula el estado del préstamo (Aprobado ↔ Pagado). Devuelve el abono
   * actualizado. Responde 409 si el préstamo no admite abonos o si se excede
   * el saldo pendiente.
   *
   * @param {number|string} id
   * @param {Object} payment
   * @returns {Promise} Promesa con la respuesta del servidor.
   */
  updatePayment: (id, payment) => {
    return apiClient.put(`/payments/${id}`, payment);
  },

  /**
   * Elimina un abono (borrado lógico). Si el préstamo estaba saldado y sin este
   * abono deja de cubrirse el monto, vuelve al estado Aprobado.
   *
   * @param {number|string} id
   * @param {string} [editedBy] - Queda registrado como quien lo eliminó.
   * @returns {Promise} Promesa con la respuesta del servidor.
   */
  deletePayment: (id, editedBy) => {
    return apiClient.delete(`/payments/${id}`, {
      params: editedBy ? { editedBy } : undefined,
    });
  },
};

export default paymentApi;
