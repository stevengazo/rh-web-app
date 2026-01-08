import apiClient from "./apiClient";

const loansApi = {
  getAllsLoans: () => {
    return apiClient.get(`/Loans`);
  },
  getLoansById: (id) => {
    return apiClient.get(`/Loans/${id}`);
  },
  getLoansByUser: (id) => {
    return apiClient.get(`/Loans/user/${id}`);
  },
  createLoan: (loan) => {
    return apiClient.post(`/Loans`, loan);
  },
  updateLoan: (id, loan) => {
    return apiClient.put(`/Loans/${id}`, loan);
  },
  deleteLoan: (id) => {
    return apiClient.delete(`/Loans/${id}`);
  },
};

export default loansApi;
