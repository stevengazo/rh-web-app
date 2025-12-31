import apiClient from "./apiClient";

const loginRequest = (credentials) => {
    return apiClient.post("/Authentication/login", credentials);
}
export default loginRequest;
