import apiClient from "./apiClient";

const EmployeeApi = {
  // Obtener todos los empleados
  getAllEmployees: () => {
    return apiClient.get("/employees");
  },

  // Obtener empleado por ID
  getEmployeeById: (id) => {
    return apiClient.get(`/employees/${id}`);
  },

  // Crear nuevo empleado
  createEmployee: (employeeData) => {
    return apiClient.post("/employees", employeeData);
  },

  // Actualizar empleado
  updateEmployee: (id, employeeData) => {
    return apiClient.put(`/employees/${id}`, employeeData);
  },

  // Eliminar empleado
  deleteEmployee: (id) => {
    return apiClient.delete(`/employees/${id}`);
  },

  // (Opcional) Buscar empleados
  searchEmployees: (query) => {
    return apiClient.get(`/employees/search`, {
      params: { q: query },
    });
  },
};

export default EmployeeApi;
