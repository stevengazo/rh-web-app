import apiClient from "./apiClient";

const questionApi = {
  getAllQuestions: () => {
    return apiClient.get(`/Questions`);
  },
  getQuestionById: (id) => {
    return apiClient.get(`/Questions/${id}`);
  },
  createQuestion: (question) => {
    return apiClient.post(`/Questions`, question);
  },
  updateQuestion: (id, question) => {
    return apiClient.put(`/Questions/${id}`, question);
  },
  deleteQuestion: (id) => {
    return apiClient.delete(`/Questions/${id}`);
  },
};

export default questionApi;
