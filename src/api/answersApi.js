import apiClient from "./apiClient";

const answersApi = {
  getAllAnswers: () => {
    return apiClient.get(`/answers`);
  },
  getAllByUser: (id) => {
    return apiClient.get(`/answers/user/${id}`);
  },
  createAnswer: (answer) => {
    return apiClient.post(`/answers`, answer);
  },
  updateAnswer: (id, answer) => {
    return apiClient.put(`/answers/${id}`, answer);
  },
  deleteAnswer: () => {
    return apiClient.delete(`/answers/${id}`);
  },
};

export default answersApi;
