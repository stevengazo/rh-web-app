import { useEffect, useState, useMemo } from 'react';
import absencesApi from '../../api/absencesApi';
import EmployeeApi from '../../api/employeesApi';
import toast from 'react-hot-toast';
import { useAppContext } from '../../context/AppContext';
import PrimaryButton from '../PrimaryButton';

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
    <form onSubmit={handleSubmit} className="space-y-6 text-ink">
      {/* Card principal */}
      <div className="bg-surface-alt rounded-xl p-5 border border-stroke-soft space-y-5">
        {/* Empleado */}
        {!userId && (
          <div>
            <label className="text-xs uppercase tracking-wide text-ink-muted">
              Empleado
            </label>
            <select
              name="userId"
              value={absenceForm.userId}
              onChange={handleChange}
              required
              className="w-full mt-2 bg-surface border border-stroke text-ink rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-brand focus:border-brand focus:outline-none"
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

        {/* Título */}
        <div>
          <label className="text-xs uppercase tracking-wide text-ink-muted">
            Título
          </label>
          <input
            type="text"
            name="title"
            value={absenceForm.title}
            onChange={handleChange}
            className="w-full mt-2 bg-surface border border-stroke text-ink placeholder:text-ink-muted rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-brand focus:border-brand focus:outline-none"
            placeholder="Ej: Incapacidad médica"
          />
        </div>

        {/* Fechas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs uppercase tracking-wide text-ink-muted">
              Fecha inicio
            </label>
            <input
              type="datetime-local"
              name="startDate"
              value={absenceForm.startDate}
              onChange={handleChange}
              required
              className="w-full mt-2 bg-surface border border-stroke text-ink rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-brand focus:border-brand focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs uppercase tracking-wide text-ink-muted">
              Fecha fin
            </label>
            <input
              type="datetime-local"
              name="endDate"
              value={absenceForm.endDate}
              onChange={handleChange}
              min={absenceForm.startDate}
              required
              className="w-full mt-2 bg-surface border border-stroke text-ink rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-brand focus:border-brand focus:outline-none"
            />
          </div>
        </div>

        {/* Duración */}
        {durationDays && (
          <div className="bg-brand/10 border border-brand/30 text-brand rounded-md px-3 py-2 text-sm">
            Duración estimada:{' '}
            <span className="font-semibold">{durationDays}</span> días
          </div>
        )}

        {/* Motivo */}
        <div>
          <label className="text-xs uppercase tracking-wide text-ink-muted">
            Motivo
          </label>
          <textarea
            name="reason"
            value={absenceForm.reason}
            onChange={handleChange}
            rows={3}
            className="w-full mt-2 bg-surface border border-stroke text-ink placeholder:text-ink-muted rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-brand focus:border-brand focus:outline-none resize-none"
            placeholder="Descripción de la ausencia"
          />
        </div>

        {/* Justificada */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            name="justified"
            checked={absenceForm.justified}
            onChange={handleChange}
            className="w-4 h-4 accent-brand"
          />
          <label className="text-sm text-ink-secondary">Ausencia justificada</label>
        </div>
      </div>

      {/* Botón */}
      <PrimaryButton type="submit" className="w-full">
        Guardar ausencia
      </PrimaryButton>
    </form>
  );
};

export default AbsenceAdd;
