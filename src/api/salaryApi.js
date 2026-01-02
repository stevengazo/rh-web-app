import apiClient from "./apiClient";

/**
 * salaryApi
 * =====================================================
 * Módulo de acceso a la API para la gestión de salarios.
 *
 * Proporciona métodos para:
 *  - Obtener salarios
 *  - Crear nuevos registros salariales
 *  - Actualizar salarios existentes
 *  - Eliminar salarios
 *
 * Los endpoints consumidos pertenecen a:
 *  /api/Salaries
 */
const salaryApi = {
  /**
   * getAllSalaries
   * =====================================================
   * Obtiene todos los salarios registrados en el sistema.
   *
   * Endpoint:
   *  GET /api/Salaries
   *
   * @returns {Promise<import("axios").AxiosResponse>}
   */
  getAllSalaries: () => {
    return apiClient.get("/salaries");
  },

  /**
   * getSalaryById
   * =====================================================
   * Obtiene un salario específico por su identificador.
   *
   * Endpoint:
   *  GET /api/Salaries/{id}
   *
   * @param {number} id - Identificador único del salario
   * @returns {Promise<import("axios").AxiosResponse>}
   */
  getSalaryById: (id) => {
    return apiClient.get(`/salaries/${id}`);
  },

  /**
   * getSalariesByUser
   * =====================================================
   * Obtiene todos los salarios asociados a un usuario (empleado).
   *
   * Endpoint:
   *  GET /api/Salaries/user/{userId}
   *
   * @param {string} userId - Identificador del usuario
   * @returns {Promise<import("axios").AxiosResponse>}
   */
  getSalariesByUser: (userId) => {
    return apiClient.get(`/salaries/user/${userId}`);
  },

  /**
   * createSalary
   * =====================================================
   * Crea un nuevo registro de salario.
   *
   * Endpoint:
   *  POST /api/Salaries
   *
   * @param {Object} salary - Objeto salario a crear
   * @returns {Promise<import("axios").AxiosResponse>}
   */
  createSalary: (salary) => {
    return apiClient.post("/salaries", salary);
  },

  /**
   * 
   * updateSalary
   * =====================================================
   * Actualiza un salario existente.
   *
   * Endpoint:
   *  PUT /api/Salaries/{id}
   *
   * @param {number} id - Identificador del salario
   * @param {Object} salary - Objeto salario actualizado
   * @returns {Promise<import("axios").AxiosResponse>}
   */
  updateSalary: (id, salary) => {
    return apiClient.put(`/salaries/${id}`, salary);
  },

  /**
   * deleteSalary
   * =====================================================
   * Elimina un salario por su identificador.
   *
   * Endpoint:
   *  DELETE /api/Salaries/{id}
   *
   * @param {number} id - Identificador del salario
   * @returns {Promise<import("axios").AxiosResponse>}
   */
  deleteSalary: (id) => {
    return apiClient.delete(`/salaries/${id}`);
  },
};

export default salaryApi;
