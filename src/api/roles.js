import apiClient from './apiClient';

const RolesApi = {
  /**
   * ==========================
   * GET /api/Roles
   * ==========================
   */
  getAll: async () => {
    const response = await apiClient.get('/Roles');
    return response;
  },

  /**
   * ==========================
   * GET /api/Roles/user/{userId}
   * ==========================
   */
  getByUser: async (userId) => {
    const response = await apiClient.get(`/Roles/user/${userId}`);
    return response;
  },

  /**
   * ==========================
   * POST /api/Roles
   * ==========================
   */
  create: async (roleName) => {
    const response = await apiClient.post('/Roles', roleName);
    return response;
  },

  /**
   * ==========================
   * PUT /api/Roles/{id}
   * ==========================
   */
  update: async (id, newRoleName) => {
    const response = await apiClient.put(`/Roles/${id}`, newRoleName);
    return response;
  },

  /**
   * ==========================
   * DELETE /api/Roles/{id}
   * ==========================
   */
  delete: async (id) => {
    const response = await apiClient.delete(`/Roles/${id}`);
    return response;
  },

  /**
   * ==========================
   * POST /api/Roles/assign
   * ==========================
   */
  assignToUser: async (userId, roleName) => {
    const response = await apiClient.post('/Roles/assign', null, {
      params: { userId, roleName },
    });
    return response;
  },

  /**
   * ==========================
   * POST /api/Roles/remove
   * ==========================
   */
  removeFromUser: async (userId, roleName) => {
    const response = await apiClient.post('/Roles/remove', null, {
      params: { userId, roleName },
    });
    return response;
  },
};

export default RolesApi;
