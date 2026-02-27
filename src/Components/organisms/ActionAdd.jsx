import actionTypeApi from "../../api/actionTypeApi";
import actionApi from "../../api/actionApi";
import EmployeeApi from "../../api/employeesApi";

import { useEffect, useState } from "react";
import PrimaryButton from "../PrimaryButton";
import toast from "react-hot-toast";

const ActionAdd = ({ userId, author }) => {
  const today = new Date().toISOString().split("T")[0];
  const shouldSelectEmployee = !userId;

  const [employees, setEmployees] = useState([]);
  const [typesOfActions, setTypesOfActions] = useState([]);

  const [newAction, setNewAction] = useState({
    actionId: 0,
    actionDate: today,
    description: "",
    createdBy: author?.userName ?? "",
    createdDate: today,
    lastUpdatedBy: author?.userName ?? "",
    lastUpdatedDate: today,
    approvedBy: "",
    approvedDate: today,
    userId: userId ?? "",
    user: null,
    actionTypeId: "",
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewAction((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await actionApi.createAction(newAction);
      toast.success("Acción creada con éxito");
    } catch (error) {
      console.error(error);
      toast.error("Error al crear la acción");
    }
  };

  const inputStyle =
    "w-full mt-1 bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none transition";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-white">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold">Agregar acción</h2>
        <p className="text-xs text-gray-300 mt-1">
          Registro de acción del empleado
        </p>
      </div>

      {/* Fecha */}
      <div>
        <label className="text-sm text-gray-200">
          Fecha de la acción
        </label>
        <input
          type="date"
          name="actionDate"
          value={newAction.actionDate}
          onChange={handleChange}
          className={inputStyle}
        />
      </div>

      {/* Empleado */}
      {shouldSelectEmployee && (
        <div>
          <label className="text-sm text-gray-200">
            Empleado
          </label>
          <select
            name="userId"
            value={newAction.userId}
            onChange={handleChange}
            required
            className={inputStyle}
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
      <div>
        <label className="text-sm text-gray-200">
          Descripción
        </label>
        <textarea
          name="description"
          value={newAction.description}
          onChange={handleChange}
          rows={3}
          placeholder="Descripción de la acción"
          className={inputStyle + " resize-none"}
        />
      </div>

      {/* Tipo de acción */}
      <div>
        <label className="text-sm text-gray-200">
          Tipo de acción
        </label>
        <select
          name="actionTypeId"
          value={newAction.actionTypeId}
          onChange={handleChange}
          required
          className={inputStyle}
        >
          <option value="">Seleccione un tipo</option>
          {typesOfActions.map((type) => (
            <option
              key={type.actionTypeId}
              value={type.actionTypeId}
            >
              {type.name}
            </option>
          ))}
        </select>
      </div>

      {/* Botón */}
      <PrimaryButton
        type="submit"
        className="w-full py-2 rounded-lg text-sm font-semibold hover:scale-[1.02] active:scale-[0.98] transition"
      >
        Agregar acción
      </PrimaryButton>
    </form>
  );
};

export default ActionAdd;