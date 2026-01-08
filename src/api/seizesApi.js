import apiClient from "./apiClient";

const seizeApi = {
  getAllSeizes: () => {
    return apiClient.get(`Seizes`);
  },
  getSeizeById: (id) => {
    return apiClient.get(`Seizes/${id}`);
  },
  createSeize: (seize) => {
    return apiClient.post(`Seizes`, seize);
  },
  updateSeize: (id, seize) => {
    return apiClient.put(`Seizes/${id}`, seize);
  },
  deleteSeize: (id) => {
    return apiClient.delete(`Seizes/${id}`);
  },
};

export default seizeApi;
