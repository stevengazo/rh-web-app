import apiClient from './apiClient';

/**
 * API para la gestión de planillas (Payrolls).
 * Proporciona métodos para consultar, crear, actualizar,
 * eliminar y buscar registros de planilla dentro del sistema.
 */
const payrollApi = {
  /**
   * Obtiene todas las planillas registradas.
   *
   * @returns {Promise} Promesa con la respuesta del servidor.
   */
  getAllPayrolls: () => {
    return apiClient.get(`/Payrolls`);
  },

  /**
   * Obtiene una planilla por su identificador.
   *
   * @param {number|string} id - Identificador de la planilla.
   * @returns {Promise} Promesa con la respuesta del servidor.
   */
  getPayrollById: (id) => {
    return apiClient.get(`/Payrolls/${id}`);
  },

  /**
   * Busca planillas según criterios específicos.
   *
   * @param {Object} params - Parámetros de búsqueda.
   * @returns {Promise} Promesa con la respuesta del servidor.
   */
  searchPayrolls: (params) => {
    return apiClient.get(`/Payrolls/search`, { params });
  },

  /**
   * Crea una nueva planilla.
   *
   * @param {Object} payroll - Objeto que contiene los datos de la planilla.
   * @returns {Promise} Promesa con la respuesta del servidor.
   */
  createPayroll: (payroll) => {
    return apiClient.post(`/Payrolls`, payroll);
  },

  /**
   * Actualiza una planilla existente.
   *
   * @param {number|string} id - Identificador de la planilla.
   * @param {Object} payroll - Objeto con los datos actualizados.
   * @returns {Promise} Promesa con la respuesta del servidor.
   */
  updatePayroll: (id, payroll) => {
    return apiClient.put(`/Payrolls/${id}`, payroll);
  },

  /**
   * Elimina una planilla.
   *
   * @param {number|string} id - Identificador de la planilla.
   * @returns {Promise} Promesa con la respuesta del servidor.
   */
  deletePayroll: (id) => {
    return apiClient.delete(`/Payrolls/${id}`);
  },

  /* ----------------------------------------------------------------
     Ciclo de vida: Borrador → Aprobada → Pagada (o Anulada)
     El backend valida las transiciones y responde 409 si no aplican.
     ---------------------------------------------------------------- */

  /**
   * Aprueba la planilla y la congela: sus detalles dejan de ser editables.
   *
   * @param {number|string} id
   * @param {string} userName - Queda registrado como aprobador.
   */
  /**
   * Horas extra y ausencias que esta planilla puede liquidar.
   *
   * El rango de fechas lo resuelve el backend a partir del periodo de la
   * planilla; aquí solo hace falta su id.
   *
   * @param {number|string} id
   * @returns {Promise<import('axios').AxiosResponse>} `{ extras, absences }`
   */
  getPayableItems: (id) => {
    return apiClient.get(`/Payrolls/${id}/payable`);
  },

  /**
   * Horas extra y ausencias aprobadas de **fuera** del periodo que nadie ha
   * liquidado todavía. Sirven para arrastrar a esta planilla lo que se aprobó
   * tarde y de otro modo se quedaría sin cobrar.
   *
   * @param {number|string} id
   * @param {string} [userId] Limita al colaborador indicado.
   */
  getPendingOutside: (id, userId) => {
    return apiClient.get(`/Payrolls/${id}/pending-outside`, {
      params: { userId },
    });
  },

  /** Arrastra registros sueltos a la planilla. */
  attachItems: (id, { extraIds = [], absenceIds = [] }) => {
    return apiClient.post(`/Payrolls/${id}/attach`, { extraIds, absenceIds });
  },

  /** Los suelta: vuelven a quedar pendientes para otra planilla. */
  detachItems: (id, { extraIds = [], absenceIds = [] }) => {
    return apiClient.post(`/Payrolls/${id}/detach`, { extraIds, absenceIds });
  },

  approvePayroll: (id, userName) => {
    return apiClient.post(`/Payrolls/${id}/approve`, { userName });
  },

  /**
   * Marca como pagada una planilla aprobada.
   *
   * @param {number|string} id
   * @param {string} userName
   */
  markPayrollPaid: (id, userName) => {
    return apiClient.post(`/Payrolls/${id}/pay`, { userName });
  },

  /**
   * Devuelve una planilla aprobada a borrador para corregirla.
   * No aplica sobre planillas ya pagadas.
   *
   * @param {number|string} id
   * @param {string} userName
   */
  reopenPayroll: (id, userName) => {
    return apiClient.post(`/Payrolls/${id}/reopen`, { userName });
  },

  /**
   * Anula la planilla dejando constancia del motivo.
   *
   * @param {number|string} id
   * @param {string} reason - Obligatorio.
   * @param {string} userName
   */
  voidPayroll: (id, reason, userName) => {
    return apiClient.post(`/Payrolls/${id}/void`, { reason, userName });
  },
};

export default payrollApi;
