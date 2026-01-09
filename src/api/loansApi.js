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
   * Crea un nuevo préstamo.
   *
   * @param {Object} loan - Objeto que contiene los datos del préstamo.
   * @returns {Promise} Promesa con la respuesta del servidor.
   */
  createLoan: (loan) => {
    return apiClient.post(`/Loans`, loan);
  },

  /**
   * Actualiza un préstamo existente.
   *
   * @param {number|string} id - Identificador del préstamo.
   * @param {Object} loan - Objeto con los datos actualizados del préstamo.
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
  deleteLoan: (id) => {
    return apiClient.delete(`/Loans/${id}`);
  },
};

export default loansApi;
