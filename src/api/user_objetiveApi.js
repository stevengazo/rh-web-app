import apiClient from './apiClient';

/**
 * API para la gestión de objetivos de usuario (User_Objetive).
 * Proporciona métodos para consultar, crear, actualizar y eliminar
 * los objetivos asignados a los usuarios.
 */
const user_objetiveApi = {
  /**
   * Obtiene todos los objetivos de usuario registrados.
   *
   * @returns {Promise} Promesa con la respuesta del servidor.
   */
  getAllUser_Objetives: () => {
    return apiClient.get(`/User_Objetive`);
  },

  /**
   * Obtiene un objetivo de usuario por su identificador.
   *
   * @param {number|string} id - Identificador del objetivo de usuario.
   * @returns {Promise} Promesa con la respuesta del servidor.
   */
  getUser_ObjetiveById: (id) => {
    return apiClient.get(`/User_Objetive/${id}`);
  },

  /**
   * Crea un nuevo objetivo para un usuario.
   *
   * @param {Object} user_objetive - Objeto que contiene los datos del objetivo del usuario.
   * @returns {Promise} Promesa con la respuesta del servidor.
   */
  createUser_Objetive: (user_objetive) => {
    return apiClient.post(`/User_Objetive`, user_objetive);
  },

  /**
   * Actualiza un objetivo de usuario existente.
   *
   * @param {number|string} id - Identificador del objetivo de usuario.
   * @param {Object} user_objetive - Objeto con los datos actualizados del objetivo del usuario.
   * @returns {Promise} Promesa con la respuesta del servidor.
   */
  updateUser_Objetive: (id, user_objetive) => {
    return apiClient.put(`/User_Objetive/${id}`, user_objetive);
  },

  /**
   * Elimina un objetivo de usuario.
   *
   * @param {number|string} id - Identificador del objetivo de usuario.
   * @returns {Promise} Promesa con la respuesta del servidor.
   */
  deleteUser_Objetive: (id) => {
    return apiClient.delete(`/User_Objetive/${id}`);
  },
};

export default user_objetiveApi;
