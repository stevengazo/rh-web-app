import apiClient from "./apiClient";

const paymentApi = {
  getAllPayments: () => {
    return apiClient.get(``);
  },
  getPaymentById: () => {
    return apiClient.get(``);
  },
  createPayment: () => {
    return apiClient.post(``);
  },
  updatePayment : ()=>{
    return apiClient.put(``);
  },
  deletePayment: ()=>{
    return apiClient.delete(``);
  }
};

export default paymentApi;
