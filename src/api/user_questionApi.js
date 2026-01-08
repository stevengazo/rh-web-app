import apiClient from "./apiClient";

const user_questionApi = {
  getAllUser_Questions: () => {
    return apiClient.get(`/user_question`);
  },
  getUser_QuestionById: (id) => {
    return apiClient.get(`/user_question/${id}`);
  },
  createUser_Question: () => {
    return apiClient.post(`/user_question`);
  },
  updateUser_Question: (id, user_question) => {
    return apiClient.put(`/user_question/${id}`, user_question);
  },
  deleteUser_Question: (id) => {
    return apiClient.delete(`/user_question/${id}`);
  },
};

export default user_questionApi;
