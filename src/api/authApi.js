import apiClient from "./apiClient";

const loginRequest = (credentials) => {
    return apiClient.post("/auth/login", credentials);
}
export default loginRequest;
