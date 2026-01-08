import apiClient from "./apiClient";


const VacationsApi = {
     getAllVacations: () => {
        return apiClient.get(``);
      },
      getVacationById: () => {
        return apiClient.get(``);
      },
      createVacation: () => {
        return apiClient.post(``);
      },
      updateVacation: () => {
        return apiClient.put(``);
      },
      deleteVacation: () => {
        return apiClient.delete(``);
      },
}


export default VacationsApi;