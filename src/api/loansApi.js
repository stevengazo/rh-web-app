import apiClient from './apiClient';

/**
 * API para la gestión de préstamos (Loans).
 * Proporciona métodos para consultar, crear, actualizar y eliminar
 * préstamos asociados a usuarios.
 */
const loansApi = {
  /**
   * Obtiene todos los préstamos registrados.
   *
   * @returns {Promise} Promesa con la respuesta del servidor.
   */
  getAllsLoans: () => {
    return apiClient.get(`/Loans`);
  },

  /**
   * Obtiene un préstamo por su identificador.
   *
   * @param {number|string} id - Identificador del préstamo.
   * @returns {Promise} Promesa con la respuesta del servidor.
   */
  getLoansById: (id) => {
    return apiClient.get(`/Loans/${id}`);
  },

  /**
   * Obtiene todos los préstamos asociados a un usuario específico.
   *
   * @param {number|string} id - Identificador del usuario.
   * @returns {Promise} Promesa con la respuesta del servidor.
   */
  getLoansByUser: (id) => {
    return apiClient.get(`/Loans/user/${id}`);
  },

  /**
   * Crea un nuevo préstamo. El backend solo toma
   * `{ userId, title, amount, paymentMonths, requestAt, description, createdBy }`;
   * el estado y las marcas de tiempo las fija el servidor.
   *
   * @param {Object} loan
   * @returns {Promise} Promesa con la respuesta del servidor.
   */
  createLoan: (loan) => {
    return apiClient.post(`/Loans`, loan);
  },

  /**
   * Actualiza un préstamo **pendiente**. Solo se pueden cambiar
   * `{ title, amount, paymentMonths, requestAt, description, userName }`;
   * el backend responde 409 si el préstamo ya fue aprobado o rechazado.
   * Devuelve el préstamo actualizado en el cuerpo.
   *
   * @param {number|string} id
   * @param {Object} loan
   * @returns {Promise} Promesa con la respuesta del servidor.
   */
  updateLoan: (id, loan) => {
    return apiClient.put(`/Loans/${id}`, loan);
  },

  /**
   * Elimina un préstamo.
   *
   * @param {number|string} id - Identificador del préstamo.
   * @returns {Promise} Promesa con la respuesta del servidor.
   */
  /* ----------------------------------------------------------------
     Aprobación: Pendiente → Aprobado → Pagado (o Rechazado)
     ---------------------------------------------------------------- */

  /**
   * Aprueba el préstamo.
   * @param {number|string} id
   * @param {string} userName
   */
  approveLoan: (id, userName) => {
    return apiClient.post(`/Loans/${id}/approve`, { userName });
  },

  /**
   * Rechaza el préstamo dejando constancia del motivo.
   * @param {number|string} id
   * @param {string} reason - Obligatorio.
   * @param {string} userName
   */
  rejectLoan: (id, reason, userName) => {
    return apiClient.post(`/Loans/${id}/reject`, { reason, userName });
  },

  /**
   * Da el préstamo por pagado. El backend exige que los abonos cubran el monto.
   * @param {number|string} id
   * @param {string} userName
   */
  settleLoan: (id, userName) => {
    return apiClient.post(`/Loans/${id}/settle`, { userName });
  },

  /**
   * Devuelve el préstamo al estado pendiente.
   * @param {number|string} id
   * @param {string} userName
   */
  reopenLoan: (id, userName) => {
    return apiClient.post(`/Loans/${id}/reopen`, { userName });
  },

  deleteLoan: (id) => {
    return apiClient.delete(`/Loans/${id}`);
  },
};

export default loansApi;
