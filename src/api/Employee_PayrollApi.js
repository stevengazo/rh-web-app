import apiClient from './apiClient';

/**
 * Servicio para la gestión de nómina por empleado
 * Encapsula todas las llamadas HTTP al endpoint `/Employee_Payroll`
 *
 * @namespace Employee_PayrollApi
 */
const Employee_PayrollApi = {
  /**
   * Obtiene todos los registros de nómina de empleados
   *
   * @returns {Promise<import('axios').AxiosResponse>}
   */
  getAll: () => {
    return apiClient.get('/Employee_Payroll');
  },

  /**
   * Obtiene la nómina de un empleado por ID de nómina
   *
   * @param {string|number} id - ID del registro de nómina
   * @returns {Promise<import('axios').AxiosResponse>}
   */
  getByPayrollId: (id) => {
    return apiClient.get(`/Employee_Payroll/${id}`);
  },


   Search: ({ employeeId, year, month }) => {
    return apiClient.get('/api/Employee_Payroll/search', {
      params: {
        employeeId,
        year,
        month,
      },
    });
  },

  
  /**
   * Crea un nuevo registro de nómina para un empleado
   *
   * @param {Object} payroll - Objeto de nómina
   * @param {string} payroll.userId - ID del empleado
   * @param {number} payroll.monthlySalary - Salario mensual
   * @param {number} payroll.grossSalary - Salario bruto
   * @param {number} payroll.netAmount - Monto neto a pagar
   * @returns {Promise<import('axios').AxiosResponse>}
   */
  create: (payroll) => {
    return apiClient.post('/Employee_Payroll', payroll);
  },

  /**
   * Actualiza un registro de nómina existente
   *
   * @param {string|number} id - ID del registro de nómina
   * @param {Object} payroll - Datos actualizados de la nómina
   * @returns {Promise<import('axios').AxiosResponse>}
   */
  update: (id, payroll) => {
    return apiClient.put(`/Employee_Payroll/${id}`, payroll);
  },

  /**
   * Elimina un registro de nómina
   *
   * @param {string|number} id - ID del registro de nómina
   * @returns {Promise<import('axios').AxiosResponse>}
   */
  delete: (id) => {
    return apiClient.delete(`/Employee_Payroll/${id}`);
  },
};

export default Employee_PayrollApi;
