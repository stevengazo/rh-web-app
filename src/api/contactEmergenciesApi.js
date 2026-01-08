import apiClient from "./apiClient";

const ContactEmergencies = {
  getAllContactEmergencies: () => {
    return apiClient.get(`/ContactEmergencies`);
  },
  getContactEmergenciesById: (id) => {
    return apiClient.get(`/ContactEmergencies/${id}`);
  },
  getContactEmergenciesByUser: (id) => {
    return apiClient.get(`/ContactEmergencies/user/${id}`);
  },
  createContactEmergency: (contact) => {
    return apiClient.post(`/ContactEmergencies`, contact);
  },
  updateContactEmergency: (id, contact) => {
    return apiClient.put(`/ContactEmergencies/${id}`, contact);
  },
  deleteContactEmergency: (id) => {
    return apiClient.delete(`/ContactEmergencies/${id}`);
  },
};

export default ContactEmergencies;
