import apiClient from "./apiClient";

const EmployeeApi = {
  // Obtener todos los empleados
  getAllEmployees: () => {
    return apiClient.get("/employee");
  },

  // Obtener empleado por ID
  getEmployeeById: (id) => {
    return apiClient.get(`/employee/${id}`);
  },

  // Crear nuevo empleado
  createEmployee: (employeeData) => {
    return apiClient.post("/employee", employeeData);
  },

  // Actualizar empleado
  updateEmployee: (id, employeeData) => {
    return apiClient.put(`/employee/${id}`, employeeData);
  },

  // Eliminar empleado
  deleteEmployee: (id) => {
    return apiClient.delete(`/employee/${id}`);
  },

  // (Opcional) Buscar empleados
  searchEmployees: (query) => {
    return apiClient.get(`/employee/search`, {
      params: { q: query },
    });
  },
};

export default EmployeeApi;
