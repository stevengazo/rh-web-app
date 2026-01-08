import apiClient from "./apiClient";

const extrasApi = {
  getAllExtras: () => {
    return apiClient.get(`/Extras`);
  },
  getExtraById: (id) => {
    return apiClient.get(`/Extras/${id}`);
  },
  getExtrasByUser: (id) => {
    return apiClient.get(`/Extras/user/${id}`);
  },
  createExtra: (extra) => {
    return apiClient.post(`/Extras`, extra);
  },
  updateExtra: (id, extra) => {
    return apiClient.put(`/Extras/${id}`, extra );
  },
  deleteExtra: (id) => {
    return apiClient.delete(`/Extras/${id}`);
  },
};

export default extrasApi;
