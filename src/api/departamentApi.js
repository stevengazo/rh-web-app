import apiClient from './apiClient';

/**
 * DepartamentApi
 * =====================================================
 * Módulo de acceso a la API para la gestión de departamentos
 * y del organigrama de la empresa.
 *
 * Los endpoints consumidos pertenecen a:
 *  /api/Departaments  y  /api/Chief_By_Departament
 */
const DepartamentApi = {
  /**
   * Obtiene todos los departamentos registrados.
   *
   * @returns {Promise<import("axios").AxiosResponse>}
   */
  getAllDepartaments: async () => {
    return apiClient.get('/departaments');
  },

  /**
   * Obtiene un departamento por su identificador.
   *
   * @param {number|string} id
   */
  getDepartamentById: (id) => {
    return apiClient.get(`/departaments/${id}`);
  },

  /**
   * Organigrama: departamentos con su jerarquía, jefaturas y cantidad de
   * colaboradores activos. Viene plano; el árbol se arma en el cliente.
   *
   * @returns {Promise<import("axios").AxiosResponse>}
   */
  getOrgChart: () => {
    return apiClient.get('/departaments/orgchart');
  },

  /**
   * Crea un departamento.
   *
   * @param {Object} departament
   */
  createDepartament: (departament) => {
    return apiClient.post('/departaments', departament);
  },

  /**
   * Actualiza un departamento (incluye su departamento padre en el
   * organigrama y el orden entre hermanos).
   *
   * @param {number|string} id
   * @param {Object} departament
   */
  updateDepartament: (id, departament) => {
    return apiClient.put(`/departaments/${id}`, departament);
  },

  /**
   * Elimina un departamento.
   *
   * @param {number|string} id
   */
  deleteDepartament: (id) => {
    return apiClient.delete(`/departaments/${id}`);
  },

  /* ----------------------------------------------------------------
     Jefaturas por departamento
     ---------------------------------------------------------------- */

  /**
   * Lista todas las jefaturas asignadas.
   */
  getAllChiefs: () => {
    return apiClient.get('/Chief_By_Departament');
  },

  /**
   * Asigna una jefatura a un departamento.
   *
   * @param {{departamentId: number, userId: string}} chief
   */
  assignChief: (chief) => {
    return apiClient.post('/Chief_By_Departament', chief);
  },

  /**
   * Quita una jefatura.
   *
   * @param {number|string} id - Chief_By_DepartamentId
   */
  removeChief: (id) => {
    return apiClient.delete(`/Chief_By_Departament/${id}`);
  },
};

export default DepartamentApi;
