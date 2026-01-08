import apiClient from "./apiClient";

const questionCategoryApi = {
  getAllQuestionCategories: () => {
    return apiClient.get(`/QuestionCategories`);
  },
  getQuestionCategoryById: (id) => {
    return apiClient.get(`/QuestionCategories/${id}`);
  },
  createQuestionCategory: (questionCat) => {
    return apiClient.post(`/QuestionCategories`, questionCat);
  },
  updateQuestionCategory: (id, questionCategory) => {
    return apiClient.put(`/QuestionCategories/${id}`, questionCategory);
  },
  deleteQuestionCategory: (id) => {
    return apiClient.delete(`/QuestionCategories/${id}`);
  },
};

export default questionCategoryApi;
