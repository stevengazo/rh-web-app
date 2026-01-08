import apiClient from "./apiClient";

const loansApi = {
  getAllsLoans: () => {
    return apiClient.get(``);
  },
  getLoansById: () => {
    return apiClient.get(``);
  },
  getLoansByUser: () => {
    return apiClient.get(``);
  },
  createLoan: () => {
    return apiClient.post(``);
  },
  updateLoan: () => {
    return apiClient.put(``);
  },
  deleteLoan: () => {
    return apiClient.delete(``);
  },
};

export default loansApi;
