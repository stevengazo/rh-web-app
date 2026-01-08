import apiClient from "./apiClient";

const ObjetiveCategories = {
  getAllObjetiveCategories: () => {
    return apiClient.get(`/ObjetiveCategories`);
  },
  getObjetiveCategoryById: (id) => {
    return apiClient.get(`/ObjetiveCategories`);
  },
  createObjetiveCategory: (objetiveCat) => {
    return apiClient.post(`/ObjetiveCategories`, objetiveCat);
  },
  updateObjetiveCategory: (id, objetiveCate) => {
    return apiClient.put(`/ObjetiveCategories/${id}`, objetiveCate);
  },
  deleteObjetiveCategory: (id) => {
    return apiClient.delete(`/ObjetiveCategories/${id}`);
  },
};

export default ObjetiveCategories;
