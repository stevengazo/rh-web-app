import apiClient from "./apiClient";

const resultsApi = {
  getAllResults: () => {
    return apiClient.get(``);
  },
  getResultById: () => {
    return apiClient.get(``);
  },
  createResult: () => {
    return apiClient.post(``);
  },
  updateResult: () => {
    return apiClient.put(``);
  },
  deleteResult: () => {
    return apiClient.delete(``);
  },
};

export default resultsApi;
