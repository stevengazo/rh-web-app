import apiClient from './apiClient';

/**
 * API client para la gestión de ausencias del personal.
 * Proporciona métodos CRUD para interactuar con el backend.
 */
const absencesApi = {
  /**
   * Obtiene el listado de todas las ausencias.
   *
   * @returns {Promise<import("axios").AxiosResponse<any>>}
   * Promesa con la respuesta del servidor que contiene las ausencias registradas.
   */
  getAllAbsences: () => {
    return apiClient.get('/Absences');
  },
  /**
   * Obtiene una ausencia específica por su identificador.
   *
   * @param {number|string} id - Identificador único de la ausencia.
   * @returns {Promise<import("axios").AxiosResponse<any>>}
   * Promesa con la información de la ausencia solicitada.
   */
  getAbsenceById: (id) => {
    return apiClient.get(`/Absences/${id}`);
  },
  /**
   * Crea una nueva ausencia.
   *
   * @param {Object} absence - Objeto con la información de la ausencia a registrar.
   * @returns {Promise<import("axios").AxiosResponse<any>>}
   * Promesa con la respuesta del servidor tras crear la ausencia.
   */
  createAbsence: (absence) => {
    return apiClient.get('/Absences', absence);
  },
  /**
   * Actualiza una ausencia existente.
   *
   * @param {number|string} id - Identificador único de la ausencia.
   * @param {Object} absence - Objeto con los datos actualizados de la ausencia.
   * @returns {Promise<import("axios").AxiosResponse<any>>}
   * Promesa con la respuesta del servidor tras actualizar la ausencia.
   */
  updateAbsence: (id, absence) => {
    return apiClient.get('/Absences', absence);
  },

  /**
   * Elimina una ausencia por su identificador.
   *
   * @param {number|string} id - Identificador único de la ausencia.
   * @returns {Promise<import("axios").AxiosResponse<any>>}
   * Promesa con la respuesta del servidor tras eliminar la ausencia.
   */
  deleteAbsence: (id) => {
    return apiClient.get(`/Absences/${id}`);
  },
};

export default absencesApi;
