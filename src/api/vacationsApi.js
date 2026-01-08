import apiClient from "./apiClient";

const VacationsApi = {
  getAllVacations: () => {
    return apiClient.get(`/vacations`);
  },
  getVacationById: (id) => {
    return apiClient.get(`/vacations/${id}`);
  },
  createVacation: (vacation) => {
    return apiClient.post(`/vacations`, vacation);
  },
  updateVacation: (id, vacation) => {
    return apiClient.put(`/vacations/${id}`, vacation);
  },
  deleteVacation: (id) => {
    return apiClient.delete(`/vacations/${id}`);
  },
};

export default VacationsApi;
