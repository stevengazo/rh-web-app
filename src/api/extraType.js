import apiClient from "./apiClient";

const extraType = {
  getallExtraTypes: () => {
    return apiClient.get(``);
  },
  getExtraTypeById: () => {
    return apiClient.get(``);
  },
  createExtraType: () => {
    return apiClient.post(``);
  },
  updateExtraType: () => {
    return apiClient.put(``);
  },
  deleteExtraType: () => {
    return apiClient.delete(``);
  },
};

export default extraType;
