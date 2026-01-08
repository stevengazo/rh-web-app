import apiClient from "./apiClient";

const comissionsApi = {
  getAllComisions: () => {
    return apiClient.get(`/comissions`);
  },
  getComissionById: (id) => {
    return apiClient.get(`/comissions/${id}`);
  },
  getComissionsByUser: (id) => {
    return apiClient.get(`/comissions/user/${id}`);
  },
  createComission: (comission) => {
    return apiClient.post(`/comissions`, comission);
  },
  updateComission: (id, comission) => {
    return apiClient.put(`/comissions/${id}`, comission);
  },
  deleteComission: (id) => {
    return apiClient.delete(`/comissions/${id}`);
  },
};

export default comissionsApi;
