import apiClient from './apiClient';

/**
 * DepartamentApi
 * =====================================================
 * Módulo de acceso a la API para la gestión de departamentos.
 *
 * Proporciona métodos para:
 *  - Obtener la lista de departamentos
 *
 * Los endpoints consumidos pertenecen a:
 *  /api/Departaments
 */
const DepartamentApi = {
  /**
   * getAllDepartaments
   * =====================================================
   * Obtiene todos los departamentos registrados en el sistema.
   *
   * Endpoint:
   *  GET /api/Departaments
   *
   * @returns {Promise<import("axios").AxiosResponse>}
   */
  getAllDepartaments: async () => {
    return apiClient.get('/departaments');
  },
};

export default DepartamentApi;
