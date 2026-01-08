import apiClient from "./apiClient";

const reminderApi = {
    getAllReminders : ()=>{
        return apiClient.get(``);
    },
    getReminderById: ()=>{
        return apiClient.get(``);
    },
    createReminder: ()=>{
        return apiClient.post(``);
    },
    updateReminder: ()=>{
        return apiClient.put(``);
    },
    deleteReminder: ()=>{
        return apiClient.delete(``);
    }
}

export default reminderApi;