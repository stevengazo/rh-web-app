import apiClient from "./apiClient";

const extraType = {
  getallExtraTypes: () => {
    return apiClient.get(`/ExtraTypes`);
  },
  getExtraTypeById: (id) => {
    return apiClient.get(`/ExtraTypes/${id}`);
  },
  createExtraType: (extraType) => {
    return apiClient.post(`/ExtraTypes`, extraType);
  },
  updateExtraType: (id, extraType) => {
    return apiClient.put(`/ExtraTypes/${id}`, extraType);
  },
  deleteExtraType: (id) => {
    return apiClient.delete(`/ExtraTypes/${id}`);
  },
};

export default extraType;
