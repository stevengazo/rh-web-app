import apiClient from './apiClient';

/**
 * ActionApi
 * ===
 * Módulo de acceso a la API para la gestión de acciones.
 *
 * Proporciona métodos para:
 *  - Listar acciones
 *  - Obtener una acción por ID
 *  - Obtener acciones asociadas a un usuario
 *  - Crear nuevas acciones
 *  - Actualizar acciones existentes
 *  - Eliminar acciones
 *
 * Endpoints base:
 *  /api/Actions
 */
const actionApi = {
  /**
   * getAllActions
   * ===
   * Obtiene todas las acciones registradas en el sistema.
   *
   * Endpoint:
   *  GET /api/Actions
   *
   * @returns {Promise<import("axios").AxiosResponse>}
   */
  getAllActions: () => {
    return apiClient.get('/actions');
  },

  /**
   * getActionById
   * Obtiene una acción específica por su ID.
   *
   * Endpoint:
   *  GET /api/Actions/{id}
   *
   * @param {number|string} id - Identificador de la acción
   * @returns {Promise<import("axios").AxiosResponse>}
   */
  getActionById: (id) => {
    return apiClient.get(`/actions/${id}`);
  },

  /**
   * getActionsByUser
   * =
   * Obtiene todas las acciones asociadas a un usuario específico.
   *
   * Endpoint:
   *  GET /api/Actions/user/{userId}
   *
   * @param {string} userId - Identificador del usuario
   * @returns {Promise<import("axios").AxiosResponse>}
   */
  getActionsByUser: (userId) => {
    return apiClient.get(`/actions/user/${userId}`);
  },

  /**
   * createAction
   * ======
   * Crea una nueva acción.
   *
   * Endpoint:
   *  POST /api/Actions
   *
   * @param {Object} action - Datos de la acción
   * @returns {Promise<import("axios").AxiosResponse>}
   */
  createAction: (action) => {
    return apiClient.post('/actions', action);
  },

  /**
   * updateAction
   * ==
   * Actualiza una acción existente.
   *
   * Endpoint:
   *  PUT /api/Actions/{id}
   *
   * @param {number|string} id - Identificador de la acción
   * @param {Object} action - Datos actualizados
   * @returns {Promise<import("axios").AxiosResponse>}
   */
  updateAction: (id, action) => {
    return apiClient.put(`/actions/${id}`, action);
  },

  /**
   * deleteAction
   * ===
   * Elimina una acción por su ID.
   *
   * Endpoint:
   *  DELETE /api/Actions/{id}
   *
   * @param {number|string} id - Identificador de la acción
   * @returns {Promise<import("axios").AxiosResponse>}
   */
  deleteAction: (id) => {
    return apiClient.delete(`/actions/${id}`);
  },

  /**
   * searchActions
   * Busca acciones por empleado, rango de fechas, tipo o estado.
   *
   * @param {Object} filters
   * @param {string} [filters.status] 'Pendiente' | 'Aprobada' | 'Rechazada'
   */
  searchActions: (filters = {}) => {
    return apiClient.get('/actions/search', {
      params: {
        employeeId: filters.employeeId,
        DateStart: filters.dateStart,
        DateEnd: filters.dateEnd,
        Type: filters.type,
        isActive: filters.isActive,
        Approved: filters.Approved,
        status: filters.status,
      },
    });
  },

  /* ----------------------------------------------------------------
     Aprobación: Pendiente → Aprobada / Rechazada
     El backend valida las transiciones y responde 409 si no aplican.
     ---------------------------------------------------------------- */

  /**
   * Aprueba una acción de personal.
   *
   * @param {number|string} id
   * @param {string} userName - Queda registrado como aprobador.
   */
  approveAction: (id, userName) => {
    return apiClient.post(`/actions/${id}/approve`, { userName });
  },

  /**
   * Rechaza una acción dejando constancia del motivo.
   *
   * @param {number|string} id
   * @param {string} reason - Obligatorio.
   * @param {string} userName
   */
  rejectAction: (id, reason, userName) => {
    return apiClient.post(`/actions/${id}/reject`, { reason, userName });
  },

  /**
   * Devuelve una acción ya revisada al estado pendiente.
   *
   * @param {number|string} id
   * @param {string} userName
   */
  reopenAction: (id, userName) => {
    return apiClient.post(`/actions/${id}/reopen`, { userName });
  },
};

export default actionApi;
