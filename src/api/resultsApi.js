import apiClient from "./apiClient";

const resultsApi = {
  getAllResults: () => {
    return apiClient.get(`/Results`);
  },
  getResultById: (id) => {
    return apiClient.get(`/Results/${id}`);
  },
  createResult: (result) => {
    return apiClient.post(`/Results`, result);
  },
  updateResult: (id, result) => {
    return apiClient.put(`/Results/${id}`, result);
  },
  deleteResult: (id) => {
    return apiClient.delete(`/Results/${id}`);
  },
};

export default resultsApi;
