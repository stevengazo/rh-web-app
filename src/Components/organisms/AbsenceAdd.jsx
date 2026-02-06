import { useEffect, useState, useMemo } from 'react';
import absencesApi from '../../api/absencesApi';
import EmployeeApi from '../../api/employeesApi';
import toast from 'react-hot-toast';
import { useAppContext } from '../../context/AppContext';

const AbsenceAdd = ({ userId }) => {
  const [employees, setEmployees] = useState([]);
  const { user } = useAppContext();

  // helper: hoy a las 7:00 am
  const getTodayAtSevenAM = () => {
    const d = new Date();
    d.setHours(7, 0, 0, 0);
    return d.toISOString().slice(0, 16);
  };

  const [absenceForm, setAbsenceForm] = useState({
    startDate: getTodayAtSevenAM(),
    endDate: '',
    createdBy: user.email ?? '',
    reason: '',
    justified: false,
    title: '',
    userId: userId || '',
  });

  useEffect(() => {
    if (!userId) {
      const getData = async () => {
        try {
          const response = await EmployeeApi.getAllEmployees();
          setEmployees(response.data);
        } catch {
          toast.error('Error cargando empleados');
        }
      };
      getData();
    }
  }, [userId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setAbsenceForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      // si cambia fecha inicio y fecha fin queda antes, la limpiamos
      ...(name === 'startDate' &&
        prev.endDate &&
        value > prev.endDate && { endDate: '' }),
    }));
  };

  // duración en días (incluye fracciones)
  const durationDays = useMemo(() => {
    if (!absenceForm.startDate || !absenceForm.endDate) return null;

    const start = new Date(absenceForm.startDate);
    const end = new Date(absenceForm.endDate);

    const diffMs = end - start;
    if (diffMs < 0) return null;

    return (diffMs / (1000 * 60 * 60 * 24)).toFixed(2);
  }, [absenceForm.startDate, absenceForm.endDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const resp = await absencesApi.createAbsence(absenceForm);
      console.log('server res', resp);

      toast.success('Ausencia agregada');

      setAbsenceForm({
        startDate: getTodayAtSevenAM(),
        endDate: '',
        reason: '',
        justified: false,
        title: '',
        userId: userId || '',
      });
    } catch {
      toast.error('Error al guardar la ausencia');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {!userId && (
        <div className="flex flex-col m-1">
          <label>Empleado</label>
          <select
            name="userId"
            value={absenceForm.userId}
            className="border border-gray-300 rounded p-2 m-1 shadow shadow-sm"
            onChange={handleChange}
            required
          >
            <option value="">Seleccione un empleado</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.firstName} {emp.lastName}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="flex flex-col m-1">
        <label>Título</label>
        <input
          type="text"
          className="border border-gray-300 rounded p-2 m-1 shadow shadow-sm"
          name="title"
          value={absenceForm.title}
          onChange={handleChange}
        />
      </div>

      <div className="flex flex-col m-1">
        <label>Fecha inicio</label>
        <input
          type="datetime-local"
          name="startDate"
          value={absenceForm.startDate}
          onChange={handleChange}
          className="border border-gray-300 rounded p-2 m-1 shadow shadow-sm"
          required
        />
      </div>

      <div className="flex flex-col m-1">
        <label>Fecha fin</label>
        <input
          type="datetime-local"
          name="endDate"
          className="border border-gray-300 rounded p-2 m-1 shadow shadow-sm"
          value={absenceForm.endDate}
          onChange={handleChange}
          min={absenceForm.startDate}
          required
        />
      </div>

      {durationDays && (
        <div className="m-1 p-2 text-sm text-gray-700">
          Duración: <strong>{durationDays}</strong> días
        </div>
      )}

      <div className="flex flex-col m-1">
        <label>Motivo</label>
        <textarea
          name="reason"
          className="border border-gray-300 rounded p-2 m-1 shadow shadow-sm"
          value={absenceForm.reason}
          onChange={handleChange}
        />
      </div>

      <div className="flex flex-row p-2 m-1">
        <label>
          <input
            type="checkbox"
            name="justified"
            checked={absenceForm.justified}
            onChange={handleChange}
          />
          Justificada
        </label>
      </div>

      <button
        className="bg-blue-500 text-white p-1 rounded hover:bg-white hover:text-blue-500 hover:border-blue-500 hover:border duration-500"
        type="submit"
      >
        Guardar
      </button>
    </form>
  );
};

export default AbsenceAdd;
