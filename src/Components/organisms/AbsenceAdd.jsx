import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { Calculator, Info, Loader2 } from 'lucide-react';

import absencesApi from '../../api/absencesApi';
import EmployeeApi from '../../api/employeesApi';
import salaryApi from '../../api/salaryApi';
import { useAppContext } from '../../context/AppContext';

import Label from '../Label';
import TextInput from '../TextInput';
import SelectInput from '../SelectInput';
import PrimaryButton from '../PrimaryButton';
import SecondaryButton from '../SecondaryButton';
import ErrorText from '../ErrorText';
import { fieldClasses } from '../atoms/fieldClasses';
import { formatMoney } from '../../utils/formatMoney';
import { mensajeDeError } from '../../utils/apiError';
import { HORAS_DIA, salarioVigente, tarifaPorHora } from '../../utils/tarifas';

/** Hoy a las 7:00, que es cuando empieza la jornada. */
const hoyALasSiete = () => {
  const d = new Date();
  d.setHours(7, 0, 0, 0);

  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
};

/**
 * Registro de una ausencia.
 *
 * El **monto a rebajar se calcula solo**: horas ausentes × tarifa por hora,
 * derivada del salario vigente del colaborador. Una ausencia **justificada**
 * no se rebaja, así que su monto queda en cero. El cálculo es una sugerencia:
 * se puede sobrescribir a mano cuando el caso lo amerite (una incapacidad con
 * subsidio parcial, por ejemplo).
 *
 * @param {string} [userId]  Si viene, no se pide elegir colaborador.
 * @param {() => void} [onAdded]
 */
const AbsenceAdd = ({ userId, onAdded }) => {
  const { user } = useAppContext();

  const [employees, setEmployees] = useState([]);
  const [salarioMensual, setSalarioMensual] = useState(null);
  const [manual, setManual] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    title: '',
    startDate: hoyALasSiete(),
    endDate: '',
    reason: '',
    justified: false,
    amount: '',
    userId: userId || '',
  });

  /* Sin `userId` fijo hay que poder elegir a quién se le registra. */
  useEffect(() => {
    if (userId) return;

    const cargar = async () => {
      try {
        const resp = await EmployeeApi.getAllEmployees();
        setEmployees(Array.isArray(resp?.data) ? resp.data : []);
      } catch (err) {
        console.error(err);
        toast.error('No se pudieron cargar los empleados');
      }
    };

    cargar();
  }, [userId]);

  /* Salario vigente del colaborador seleccionado: sin él no hay tarifa. */
  useEffect(() => {
    const objetivo = form.userId;

    if (!objetivo) {
      setSalarioMensual(null);
      return;
    }

    const cargar = async () => {
      try {
        const resp = await salaryApi.getSalariesByUser(objetivo);
        setSalarioMensual(
          salarioVigente(Array.isArray(resp?.data) ? resp.data : [])
        );
      } catch (err) {
        console.error('No se pudo obtener el salario vigente:', err);
        setSalarioMensual(null);
      }
    };

    cargar();
  }, [form.userId]);

  /** Horas ausentes entre inicio y fin. */
  const horas = useMemo(() => {
    if (!form.startDate || !form.endDate) return null;

    const inicio = new Date(form.startDate);
    const fin = new Date(form.endDate);

    if (Number.isNaN(inicio.getTime()) || Number.isNaN(fin.getTime())) return null;
    if (fin <= inicio) return 0;

    return (fin - inicio) / 3_600_000;
  }, [form.startDate, form.endDate]);

  const tarifaHora = tarifaPorHora(salarioMensual);
  const dias = horas === null ? null : horas / HORAS_DIA;

  /** Monto sugerido: una ausencia justificada no se rebaja. */
  const montoCalculado = useMemo(() => {
    if (form.justified) return 0;
    if (!horas || !tarifaHora) return null;
    return horas * tarifaHora;
  }, [horas, tarifaHora, form.justified]);

  /* Mientras no se edite a mano, el monto sigue al cálculo. */
  useEffect(() => {
    if (manual || montoCalculado === null) return;
    setForm((prev) => ({ ...prev, amount: montoCalculado.toFixed(2) }));
  }, [montoCalculado, manual]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      // Si la fecha final queda antes de la inicial, se limpia.
      ...(name === 'startDate' &&
        prev.endDate &&
        value > prev.endDate && { endDate: '' }),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.userId) return setError('Seleccione un colaborador.');
    if (!form.startDate || !form.endDate)
      return setError('Indique la fecha de inicio y la de fin.');
    if (!horas) return setError('La fecha de fin debe ser posterior a la de inicio.');

    setGuardando(true);

    try {
      await absencesApi.createAbsence({
        ...form,
        amount: form.amount === '' ? null : Number(form.amount),
        createdBy: user?.userName ?? user?.email ?? null,
      });

      toast.success('Ausencia registrada. Queda pendiente de aprobación.');

      setForm({
        title: '',
        startDate: hoyALasSiete(),
        endDate: '',
        reason: '',
        justified: false,
        amount: '',
        userId: userId || '',
      });
      setManual(false);

      onAdded?.();
    } catch (err) {
      console.error(err);
      setError(mensajeDeError(err, 'No se pudo guardar la ausencia.'));
    } finally {
      setGuardando(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 text-ink">
      {!userId && (
        <div>
          <Label htmlFor="aus-empleado">Colaborador</Label>
          <SelectInput
            id="aus-empleado"
            name="userId"
            value={form.userId}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione un colaborador</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.firstName} {emp.lastName}
              </option>
            ))}
          </SelectInput>
        </div>
      )}

      <div>
        <Label htmlFor="aus-titulo">Título</Label>
        <TextInput
          id="aus-titulo"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Ej: Incapacidad médica"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="aus-inicio">Fecha inicio</Label>
          <input
            id="aus-inicio"
            type="datetime-local"
            name="startDate"
            value={form.startDate}
            onChange={handleChange}
            required
            className={fieldClasses({ className: 'h-10' })}
          />
        </div>

        <div>
          <Label htmlFor="aus-fin">Fecha fin</Label>
          <input
            id="aus-fin"
            type="datetime-local"
            name="endDate"
            value={form.endDate}
            min={form.startDate}
            onChange={handleChange}
            required
            className={fieldClasses({ className: 'h-10' })}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="aus-motivo">Motivo</Label>
        <textarea
          id="aus-motivo"
          name="reason"
          rows={3}
          value={form.reason}
          onChange={handleChange}
          placeholder="Descripción de la ausencia"
          className="w-full resize-none rounded-md border border-stroke border-b-2
                     border-b-ink-muted bg-surface px-3 py-2 text-sm text-ink
                     placeholder:text-ink-muted transition-colors
                     focus:border-b-brand focus:outline-none"
        />
      </div>

      <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-stroke-soft bg-surface-alt p-3">
        <input
          type="checkbox"
          name="justified"
          checked={form.justified}
          onChange={handleChange}
          className="h-4 w-4 accent-brand"
        />
        <span>
          <span className="block text-sm font-medium text-ink">
            Ausencia justificada
          </span>
          <span className="block text-xs text-ink-muted">
            Una ausencia justificada no se rebaja del salario.
          </span>
        </span>
      </label>

      {/* Cálculo del monto */}
      <div className="rounded-xl border border-stroke-soft bg-surface-alt p-4">
        <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand">
          <Calculator size={14} />
          Monto a rebajar
        </p>

        {!form.userId ? (
          <p className="flex items-start gap-2 text-sm text-ink-muted">
            <Info size={15} className="mt-0.5 shrink-0" />
            Seleccione un colaborador para calcular la rebaja.
          </p>
        ) : salarioMensual === null ? (
          <p className="flex items-start gap-2 text-sm text-amber-800">
            <Info size={15} className="mt-0.5 shrink-0" />
            El colaborador no tiene salario vigente, así que no se puede
            calcular la tarifa. Escribe el monto a mano o regístrale el salario.
          </p>
        ) : (
          <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:grid-cols-4">
            <div>
              <dt className="text-ink-muted">Salario</dt>
              <dd className="font-medium text-ink">
                {formatMoney(salarioMensual)}
              </dd>
            </div>

            <div>
              <dt className="text-ink-muted">Tarifa por hora</dt>
              <dd className="font-medium text-ink">{formatMoney(tarifaHora)}</dd>
            </div>

            <div>
              <dt className="text-ink-muted">Ausencia</dt>
              <dd className="font-medium text-ink">
                {horas === null
                  ? '—'
                  : `${horas.toFixed(2)} h · ${dias.toFixed(2)} d`}
              </dd>
            </div>

            <div>
              <dt className="text-ink-muted">Rebaja</dt>
              <dd className="font-semibold text-ink">
                {montoCalculado === null ? '—' : formatMoney(montoCalculado)}
              </dd>
            </div>
          </dl>
        )}

        {form.justified && (
          <p className="mt-3 rounded-md bg-green-50 px-2.5 py-1.5 text-xs text-green-700">
            Al estar justificada, la rebaja queda en cero.
          </p>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between gap-2">
          <Label htmlFor="aus-monto" className="mb-0">
            Monto
          </Label>

          {montoCalculado !== null && (
            <SecondaryButton
              type="button"
              onClick={() => {
                if (manual) {
                  setForm((prev) => ({
                    ...prev,
                    amount: montoCalculado.toFixed(2),
                  }));
                }
                setManual(!manual);
              }}
            >
              {manual ? 'Usar el cálculo' : 'Ajustar a mano'}
            </SecondaryButton>
          )}
        </div>

        <TextInput
          id="aus-monto"
          type="number"
          step="0.01"
          min="0"
          name="amount"
          value={form.amount}
          onChange={handleChange}
          disabled={!manual && montoCalculado !== null}
          className="mt-2"
        />

        {!manual && montoCalculado !== null && (
          <p className="mt-1 text-xs text-ink-muted">
            Calculado automáticamente. Usa “Ajustar a mano” para cambiarlo.
          </p>
        )}
      </div>

      {error && <ErrorText>{error}</ErrorText>}

      <PrimaryButton type="submit" disabled={guardando} className="w-full">
        {guardando && <Loader2 size={15} className="animate-spin" />}
        {guardando ? 'Guardando…' : 'Guardar ausencia'}
      </PrimaryButton>
    </form>
  );
};

export default AbsenceAdd;
