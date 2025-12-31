import apiClient from "./apiClient";

const DepartamentApi = {
    getAllDepartaments: async () => {
        // Simulating an API call
        return apiClient.get("/departaments");
    },
};

export default DepartamentApi;
