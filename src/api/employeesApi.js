import apiClient from './apiClient';

/**
 * EmployeeApi
 * =====================================================
 * Módulo de acceso a la API para la gestión de empleados.
 *
 * Proporciona métodos para:
 *  - Listar empleados
 *  - Obtener empleados por ID
 *  - Crear nuevos empleados
 *  - Actualizar información de empleados
 *  - Eliminar empleados
 *  - Buscar empleados por criterio
 *
 * Los endpoints consumidos pertenecen a:
 *  /api/Employee
 */
const EmployeeApi = {
  /**

   * getAllEmployees
   * =====================================================
   * Obtiene la lista completa de empleados.
   *
   * Endpoint:
   *  GET /api/Employee
   *
   * @returns {Promise<import("axios").AxiosResponse>}
   */
  getAllEmployees: () => {
    return apiClient.get('/employee');
  },

  /**
   * getEmployeeById
   * =====================================================
   * Obtiene la información de un empleado específico
   * a partir de su identificador.
   *
   * Endpoint:
   *  GET /api/Employee/{id}
   *
   * @param {string|number} id - Identificador del empleado
   * @returns {Promise<import("axios").AxiosResponse>}
   */
  getEmployeeById: (id) => {
    return apiClient.get(`/employee/${id}`);
  },

  /**
   * createEmployee
   * =====================================================
   * Crea un nuevo empleado en el sistema.
   *
   * Endpoint:
   *  POST /api/Employee
   *
   * @param {Object} employeeData - Datos del empleado a crear
   * @returns {Promise<import("axios").AxiosResponse>}
   */
  createEmployee: (employeeData) => {
    return apiClient.post('/employee', employeeData);
  },

  /**
   * updateEmployee
   * =====================================================
   * Actualiza la información de un empleado existente.
   *
   * Endpoint:
   *  PUT /api/Employee/{id}
   *
   * @param {string|number} id - Identificador del empleado
   * @param {Object} employeeData - Datos actualizados del empleado
   * @returns {Promise<import("axios").AxiosResponse>}
   */
  updateEmployee: (id, employeeData) => {
    return apiClient.put(`/employee/${id}`, employeeData);
  },

  /**
   * deleteEmployee
   * =====================================================
   * Elimina un empleado del sistema.
   *
   * Endpoint:
   *  DELETE /api/Employee/{id}
   *
   * @param {string|number} id - Identificador del empleado
   * @returns {Promise<import("axios").AxiosResponse>}
   */
  deleteEmployee: (id) => {
    return apiClient.delete(`/employee/${id}`);
  },

  /**
   * searchEmployees
   * =====================================================
   * Realiza una búsqueda de empleados por criterio.
   *
   * Endpoint:
   *  GET /api/Employee/search?q={query}
   *
   * @param {string} query - Texto de búsqueda (nombre, correo, etc.)
   * @returns {Promise<import("axios").AxiosResponse>}
   */
  searchEmployees: (query) => {
    return apiClient.get(`/employee/search`, {
      params: { q: query },
    });
  },
};

export default EmployeeApi;
