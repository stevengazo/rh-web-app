import apiClient from "./apiClient";

const paymentApi = {
  getAllPayments: () => {
    return apiClient.get(`/payments`);
  },
  getPaymentById: (id) => {
    return apiClient.get(`/payments/${id}`);
  },
  createPayment: (payment) => {
    return apiClient.post(`/payments`, payment);
  },
  updatePayment: (id, payment) => {
    return apiClient.put(`/payments/${id}`, payment);
  },
  deletePayment: (id) => {
    return apiClient.delete(`/payments/${id}`);
  },
};

export default paymentApi;
