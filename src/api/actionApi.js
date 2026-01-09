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
};

export default actionApi;
