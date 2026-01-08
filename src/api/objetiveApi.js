import apiClient from "./apiClient";

const objetiveApi = {
  getAllObjetives: () => {
    return apiClient.get(``);
  },
  getObjetiveById: () => {
    return apiClient.get(``);
  },
  createObjetive: () => {
    return apiClient.post(``);
  },
  updateObjetive: () => {
    return apiClient.put(``);
  },
  deleteObjetive: () => {
    return apiClient.delete(``);
  },
};

export default objetiveApi;
