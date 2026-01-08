import apiClient from "./apiClient"


const ObjetiveCategories = {
    getAllObjetiveCategories : ()=>{
     return apiClient.get(``);
    },
    getObjetiveCategoryById: ()=>{
     return apiClient.get(``);
    },
    createObjetiveCategory: ()=>{
     return apiClient.post(``);
    },
    updateObjetiveCategory: ()=>{
     return apiClient.put(``);
    },
    deleteObjetiveCategory: ()=>{
     return apiClient.delete(``);
    }

}

export default ObjetiveCategories;