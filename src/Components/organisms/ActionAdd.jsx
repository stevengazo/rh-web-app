import actionTypeApi from '../../api/actionTypeApi';
import actionApi from '../../api/actionApi';
import EmployeeApi from '../../api/employeesApi';

import { useEffect, useState } from 'react';
import PrimaryButton from '../PrimaryButton';
import toast from 'react-hot-toast';

const ActionAdd = ({ userId, author, onAdded }) => {
  const todayISO = new Date().toISOString();
  const todayDate = todayISO.split('T')[0];

  const shouldSelectEmployee = !userId;

  const [employees, setEmployees] = useState([]);
  const [typesOfActions, setTypesOfActions] = useState([]);

  const initialState = {
    actionDate: todayDate,
    description: '',
    userId: userId ?? '',
    actionTypeId: '',
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
        // Solo personal activo: no tiene sentido registrar acciones de bajas.
        setEmployees(
          (res.data ?? []).filter((e) => e.isActive && !e.deleted)
        );
      } catch (err) {
        console.error(err);
        toast.error('Error cargando empleados');
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
        toast.error('Error cargando tipos de acción');
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
      toast.error('Debe completar los campos obligatorios');
      return;
    }

    /* `userId` es el Id de Identity (GUID en texto), no un número: la versión
       anterior lo declaraba dos veces, primero como Number(...) —que daba NaN—
       y luego como string, dependiendo de que la segunda clave ganara. */
    const payload = {
      actionDate: newAction.actionDate,
      description: newAction.description,
      userId: newAction.userId,
      actionTypeId: Number(newAction.actionTypeId),
      createdBy: author?.userName ?? author?.email ?? 'Sistema',
      createdDate: new Date().toISOString(),
      lastUpdatedBy: author?.userName ?? author?.email ?? 'Sistema',
      lastUpdatedDate: new Date().toISOString(),
    };

    try {
      await actionApi.createAction(payload);
      toast.success('Acción creada. Queda pendiente de aprobación.');

      // Reset formulario
      setNewAction(initialState);

      onAdded?.();
    } catch (error) {
      console.error(error);
      toast.error('Error al crear la acción');
    }
  };

  const inputStyle =
    'w-full mt-1 bg-surface border border-stroke rounded-md px-3 py-2 text-sm text-ink placeholder:text-ink-muted focus:ring-2 focus:ring-brand focus:border-brand focus:outline-none transition';

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-ink">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold">Agregar acción</h2>
        <p className="text-xs text-ink-muted mt-1">
          Registro de acción del empleado
        </p>
      </div>

      {/* Fecha */}
      <div>
        <label className="text-sm text-ink-secondary">Fecha de la acción</label>
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
          <label className="text-sm text-ink-secondary">Empleado</label>
          <select
            name="userId"
            value={newAction.userId}
            onChange={handleChange}
            required
            className={inputStyle}
          >
            <option value="">Seleccione un empleado</option>
            {/* El identificador es `id`. Antes se usaba `emp.userId`, que no
                existe en el empleado: todas las opciones valían undefined y
                era imposible elegir a nadie. */}
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {[emp.firstName, emp.lastName].filter(Boolean).join(' ') ||
                  emp.userName ||
                  emp.email}
                {emp.departament?.name ? ` — ${emp.departament.name}` : ''}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Descripción */}
      <div>
        <label className="text-sm text-ink-secondary">Descripción</label>
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
        <label className="text-sm text-ink-secondary">Tipo de acción</label>
        <select
          name="actionTypeId"
          value={newAction.actionTypeId}
          onChange={handleChange}
          required
          className={inputStyle}
        >
          <option value="">Seleccione un tipo</option>
          {typesOfActions.map((type) => (
            <option key={type.actionTypeId} value={type.actionTypeId}>
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
