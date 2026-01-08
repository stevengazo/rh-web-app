import apiClient from "./apiClient";

const user_questionApi = {
     getAllUser_Questions: () => {
        return apiClient.get(``);
      },
      getUser_QuestionById: () => {
        return apiClient.get(``);
      },
      createUser_Question: () => {
        return apiClient.post(``);
      },
      updateUser_Question: () => {
        return apiClient.put(``);
      },
      deleteUser_Question: () => {
        return apiClient.delete(``);
      },
}

export default user_questionApi;