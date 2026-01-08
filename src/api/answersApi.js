import apiClient from "./apiClient";

const answersApi = {
  getAllAnswers: () => {
    return apiClient.get(``);
  },
  getAllByUser: () => {
    return apiClient.get(``);
  },
  createAnswer: () => {
    return apiClient.post(``);
  },
  updateAnswer: () => {
    return apiClient.put(``);
  },
  deleteAnswer: () => {
    return apiClient.delete(``);
  },
};

export default answersApi;
