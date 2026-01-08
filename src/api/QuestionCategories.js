import apiClient from "./apiClient";

const questionCategoryApi = {
  getAllQuestionCategories: () => {
    return apiClient.get(``);
  },
  getQuestionCategoryById: () => {
    return apiClient.get(``);
  },
  createQuestionCategory: () => {
    return apiClient.post();
  },
  updateQuestionCategory: () => {
    return apiClient.put();
  },
  deleteQuestionCategory: () => {
    return apiClient.delete();
  },
};

export default questionCategoryApi;
