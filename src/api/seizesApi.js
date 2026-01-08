import apiClient from "./apiClient";

const seizeApi = {
  getAllSeizes: () => {
    return apiClient.get(``);
  },
  getSeizeById: () => {
    return apiClient.get(``);
  },
  createSeize: () => {
    return apiClient.post(``);
  },
  updateSeize: () => {
    return apiClient.put(``);
  },
  deleteSeize: () => {
    return apiClient.delete(``);
  },
};

export default seizeApi;
