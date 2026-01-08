import apiClient from "./apiClient";

const user_objetiveApi = {
  getAllUser_Objetives: () => {
    return apiClient.get(`/User_Objetive`);
  },
  getUser_ObjetiveById: (id) => {
    return apiClient.get(`/User_Objetive/${id}`);
  },
  createUser_Objetive: (user_objetive) => {
    return apiClient.post(`/User_Objetive`, user_objetive);
  },
  updateUser_Objetive: (id, user_objetive) => {
    return apiClient.put(`/User_Objetive/${id}`, user_objetive);
  },
  deleteUser_Objetive: (id) => {
    return apiClient.delete(`/User_Objetive/${id}`);
  },
};

export default user_objetiveApi;
