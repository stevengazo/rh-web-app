import apiClient from "./apiClient";

const awardApi = {
  getAllAwards: () => {
    return apiClient.get(``);
  },
  getAwardById: () => {
    return apiClient.get(``);
  },
  getAwardsByUser: () => {
    return apiClient.get(``);
  },
  createAward: () => {
    return apiClient.post(``);
  },
  updateAward: () => {
    return apiClient.put(``);
  },
  deleteAward: () => {
    return apiClient.delete(``);
  },
};

export default awardApi;
