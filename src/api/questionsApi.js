import apiClient from "./apiClient";

const questionApi = {
  getAllQuestions: () => {
    return apiClient.get(``);
  },
  getQuestionById: () => {
    return apiClient.get(``);
  },
  createQuestion: () => {
    return apiClient.post(``);
  },
  updateQuestion: () => {
    return apiClient.put(``);
  },
  deleteQuestion: () => {
    return apiClient.delete(``);
  },
};

export default questionApi;
