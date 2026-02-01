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
     Fetch empleados
     ========================= */
  useEffect(() => {
    if (!shouldSelectEmployee) return;

    const fetchEmployees = async () => {
      try {
        const res = await EmployeeApi.getAllEmployees();
        setEmployees(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchEmployees();
  }, [shouldSelectEmployee]);

  /* =========================
     Fetch tipos de acción
     ========================= */
  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const res = await actionTypeApi.getAllActionTypes();
        setTypesOfActions(res.data);
      } catch (err) {
        console.error(err);
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
      toast.success('Acción creada con éxito');
    } catch (error) {
      console.error(error);
      toast.error('Error al crear la acción');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="
        flex flex-col gap-4
        text-gray-800 dark:text-gray-100
      "
    >
      {/* Fecha */}
      <DateInput
        label="Fecha de la acción"
        name="actionDate"
        value={newAction.actionDate}
        onChange={handleChange}
        className="
          bg-white border-gray-300 text-gray-800
          dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100
        "
      />

      {/* Empleado */}
      {shouldSelectEmployee && (
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600 dark:text-gray-300">
            Empleado
          </label>

          <select
            name="userId"
            value={newAction.userId}
            onChange={handleChange}
            required
            className="
              px-3 py-2 rounded-md
              bg-white border border-gray-300 text-gray-800
              dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100
              focus:outline-none focus:ring-2 focus:ring-blue-500
            "
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
        className="
          bg-white border-gray-300 text-gray-800
          dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100
        "
      />

      {/* Tipo de acción */}
      <div className="flex flex-col gap-1">
        <label className="text-sm text-gray-600 dark:text-gray-300">
          Tipo de acción
        </label>

        <select
          name="actionTypeId"
          value={newAction.actionTypeId}
          onChange={handleChange}
          required
          className="
            px-3 py-2 rounded-md
            bg-white border border-gray-300 text-gray-800
            dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100
            focus:outline-none focus:ring-2 focus:ring-blue-500
          "
        >
          <option value="">Seleccione un tipo</option>
          {typesOfActions.map((type) => (
            <option key={type.actionTypeId} value={type.actionTypeId}>
              {type.name}
            </option>
          ))}
        </select>
      </div>

      <PrimaryButton type="submit">
        Agregar acción
      </PrimaryButton>
    </form>
  );
};

export default ActionAdd;
