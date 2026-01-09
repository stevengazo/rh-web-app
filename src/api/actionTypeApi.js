import apiClient from './apiClient';

/**
 * ActionTypeApi
 * =====================================================
 * Módulo de acceso a la API para la gestión de tipos de acción.
 *
 * Proporciona métodos para:
 *  - Listar tipos de acción
 *  - Obtener un tipo de acción por ID
 *  - Crear nuevos tipos de acción
 *  - Actualizar tipos de acción existentes
 *  - Eliminar tipos de acción
 *
 * Endpoints base:
 *  /api/ActionTypes
 */
const actionTypeApi = {
  /**
   * getAllActionTypes
   * =====================================================
   * Obtiene todos los tipos de acción registrados en el sistema.
   *
   * Endpoint:
   *  GET /api/ActionTypes
   *
   * @returns {Promise<import("axios").AxiosResponse>}
   */
  getAllActionTypes: () => {
    return apiClient.get('/actiontypes');
  },

  /**
   * getActionTypeById
   * =============================
   * Obtiene un tipo de acción específico por su ID.
   *
   * Endpoint:
   *  GET /api/ActionTypes/{id}
   *
   * @param {number|string} id - Identificador del tipo de acción
   * @returns {Promise<import("axios").AxiosResponse>}
   */
  getActionTypeById: (id) => {
    return apiClient.get(`/actiontypes/${id}`);
  },

  /**
   *  createActionType
   * ======================
   * Crea un nuevo tipo de acción.
   *
   * Endpoint:
   *  POST /api/ActionTypes
   *
   * @param {Object} actionType - Datos del tipo de acción
   * @returns {Promise<import("axios").AxiosResponse>}
   */
  createActionType: (actionType) => {
    return apiClient.post('/actiontypes', actionType);
  },

  /**
   * updateActionType
   * =====================================================
   * Actualiza un tipo de acción existente.
   *
   * Endpoint:
   *  PUT /api/ActionTypes/{id}
   *
   * @param {number|string} id - Identificador del tipo de acción
   * @param {Object} actionType - Datos actualizados
   * @returns {Promise<import("axios").AxiosResponse>}
   */
  updateActionType: (id, actionType) => {
    return apiClient.put(`/actiontypes/${id}`, actionType);
  },

  /**
   * deleteActionType
   * =====================================================
   * Elimina un tipo de acción por su ID.
   *
   * Endpoint:
   *  DELETE /api/ActionTypes/{id}
   *
   * @param {number|string} id - Identificador del tipo de acción
   * @returns {Promise<import("axios").AxiosResponse>}
   */
  deleteActionType: (id) => {
    return apiClient.delete(`/actiontypes/${id}`);
  },
};

export default actionTypeApi;
