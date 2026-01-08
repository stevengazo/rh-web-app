import apiClient from "./apiClient";

const extrasApi = {
  getAllExtras: () => {
    return apiClient.get(``);
  },
  getExtraById: () => {
    return apiClient.get(``);
  },
  getExtrasByUser: () => {
    return apiClient.get(``);
  },
  createExtra: () => {
    return apiClient.post(``);
  },
  updateExtra: () => {
    return apiClient.put(``);
  },
  deleteExtra: () => {
    return apiClient.delete(``);
  },
};

export default extrasApi;
