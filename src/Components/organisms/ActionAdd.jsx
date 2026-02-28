import actionTypeApi from "../../api/actionTypeApi";
import actionApi from "../../api/actionApi";
import EmployeeApi from "../../api/employeesApi";

import { useEffect, useState } from "react";
import PrimaryButton from "../PrimaryButton";
import toast from "react-hot-toast";

const ActionAdd = ({ userId, author }) => {
  const todayISO = new Date().toISOString();
  const todayDate = todayISO.split("T")[0];

  const shouldSelectEmployee = !userId;

  const [employees, setEmployees] = useState([]);
  const [typesOfActions, setTypesOfActions] = useState([]);

  const initialState = {
    actionDate: todayDate,
    description: "",
    userId: userId ?? "",
    actionTypeId: "",
  };

  const [newAction, setNewAction] = useState(initialState);

  /* =========================
     Sync userId si viene por props
  ========================= */
  useEffect(() => {
    if (userId) {
      setNewAction((prev) => ({ ...prev, userId }));
    }
  }, [userId]);

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
        toast.error("Error cargando empleados");
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
        toast.error("Error cargando tipos de acción");
      }
    };

    fetchTypes();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setNewAction((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newAction.userId || !newAction.actionTypeId) {
      toast.error("Debe completar los campos obligatorios");
      return;
    }

    const payload = {
      actionDate: newAction.actionDate,
      description: newAction.description,
      userId: Number(newAction.userId),
      actionTypeId: Number(newAction.actionTypeId),
      createdBy: author?.userName ?? "Sistema",
      createdDate: new Date().toISOString(),
      lastUpdatedBy: author?.userName ?? "Sistema",
      lastUpdatedDate: new Date().toISOString(),
    };

    try {
      await actionApi.createAction(payload);
      toast.success("Acción creada con éxito");

      // Reset formulario
      setNewAction(initialState);
    } catch (error) {
      console.error(error);
      toast.error("Error al crear la acción");
    }
  };

  const inputStyle =
    "w-full mt-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none transition";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-white">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold">Agregar acción</h2>
        <p className="text-xs text-gray-400 mt-1">
          Registro de acción del empleado
        </p>
      </div>

      {/* Fecha */}
      <div>
        <label className="text-sm">Fecha de la acción</label>
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
          <label className="text-sm">Empleado</label>
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
        <label className="text-sm">Descripción</label>
        <textarea
          name="description"
          value={newAction.description}
          onChange={handleChange}
          rows={3}
          placeholder="Descripción de la acción"
          className={`${inputStyle} resize-none`}
        />
      </div>

      {/* Tipo de acción */}
      <div>
        <label className="text-sm">Tipo de acción</label>
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