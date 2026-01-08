import apiClient from "./apiClient";

const awardApi = {
  getAllAwards: () => {
    return apiClient.get(`/awards`);
  },
  getAwardById: (id) => {
    return apiClient.get(`/awards/${id}`);
  },
  getAwardsByUser: (id) => {
    return apiClient.get(`/awards/user/${id}`);
  },
  createAward: (award) => {
    return apiClient.post(`/awards`,award);
  },
  updateAward: (id, award) => {
    return apiClient.put(`/awards/${id}`, award);
  },
  deleteAward: (id) => {
    return apiClient.delete(`/awards/${id}`);
  },
};

export default awardApi;
