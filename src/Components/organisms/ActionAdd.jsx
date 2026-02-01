import actionTypeApi from '../../api/actionTypeApi';
import actionApi from '../../api/actionApi';
import EmployeeApi from '../../api/employeesApi';

import { useEffect, useState } from 'react';
import PrimaryButton from '../PrimaryButton';
import TextInput from '../TextInput';
import DateInput from '../DateInput';
import toast from 'react-hot-toast';

const ActionAdd = ({ userId, author }) => {
  const today = new Date().toISOString().split('T')[0];
  const shouldSelectEmployee = !userId;

  const [employees, setEmployees] = useState([]);
  const [typesOfActions, setTypesOfActions] = useState([]);

  const [newAction, setNewAction] = useState({
    actionId: 0,
    actionDate: today,
    description: '',
    createdBy: author?.userName ?? '',
    createdDate: today,
    lastUpdatedBy: author?.userName ?? '',
    lastUpdatedDate: today,
    approvedBy: '',
    approvedDate: today,
    userId: userId ?? '',
    user: null,
    actionTypeId: '',
    actionType: {},
  });

  /* =========================
     Cargar empleados (solo si hace falta)
     ========================= */
  useEffect(() => {
    if (!shouldSelectEmployee) return;

    const fetchEmployees = async () => {
      try {
        const response = await EmployeeApi.getAllEmployees();
        setEmployees(response.data);
      } catch (error) {
        console.error('Error cargando empleados:', error);
      }
    };

    fetchEmployees();
  }, [shouldSelectEmployee]);

  /* =========================
     Cargar tipos de acción
     ========================= */
  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const response = await actionTypeApi.getAllActionTypes();
        setTypesOfActions(response.data);
      } catch (error) {
        console.error('Error cargando tipos de acción:', error);
      }
    };

    fetchTypes();
  }, []);

  /* =========================
     Handlers
     ========================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewAction((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await actionApi.createAction(newAction);
      console.log('Acción creada:', newAction);
      toast .success('Acción creada con éxito');

    } catch (error) {
      console.error('Error creando acción:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Fecha */}
      <DateInput
        label="Fecha de la acción"
        name="actionDate"
        value={newAction.actionDate}
        onChange={handleChange}
      />

      {/* Empleado (solo si no viene userId) */}
      {shouldSelectEmployee && (
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">Empleado</label>
          <select
            name="userId"
            value={newAction.userId}
            onChange={handleChange}
            required
            className="px-3 py-2 border border-slate-300 rounded-md text-gray-700"
          >
            <option value="">Seleccione un empleado</option>
            {employees.map((emp) => (
              <option key={emp.userId} value={emp.userId}>
                {emp.firstName} {emp.lastName}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Descripción */}
      <TextInput
        label="Descripción"
        name="description"
        value={newAction.description}
        onChange={handleChange}
        placeholder="Descripción de la acción"
      />

      {/* Tipo de acción */}
      <div className="flex flex-col gap-1">
        <label className="text-sm text-gray-600">Tipo de acción</label>
        <select
          name="actionTypeId"
          value={newAction.actionTypeId}
          onChange={handleChange}
          className="px-3 py-2 border border-slate-300 rounded-md text-gray-700"
          required
        >
          <option value="">Seleccione un tipo</option>
          {typesOfActions.map((type) => (
            <option key={type.actionTypeId} value={type.actionTypeId}>
              {type.name}
            </option>
          ))}
        </select>
      </div>

      <PrimaryButton type="submit">Agregar acción</PrimaryButton>
    </form>
  );
};

export default ActionAdd;
