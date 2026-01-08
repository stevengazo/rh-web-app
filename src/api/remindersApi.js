import apiClient from "./apiClient";

const reminderApi = {
  getAllReminders: () => {
    return apiClient.get(`/Reminders`);
  },
  getReminderById: (id) => {
    return apiClient.get(`/Reminders/${id}`);
  },
  createReminder: (reminder) => {
    return apiClient.post(`/Reminders`, reminder);
  },
  updateReminder: (id, reminder) => {
    return apiClient.put(`/Reminders/${id}`, reminder);
  },
  deleteReminder: (id) => {
    return apiClient.delete(`/Reminders/${id}`);
  },
};

export default reminderApi;
