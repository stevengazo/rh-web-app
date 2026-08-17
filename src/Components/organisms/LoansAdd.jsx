import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { Info, Loader2 } from 'lucide-react';

import loansApi from '../../api/loansApi';
import EmployeeApi from '../../api/employeesApi';
import { useAppContext } from '../../context/AppContext';
import { formatMoney } from '../../utils/formatMoney';

import Label from '../Label';
import TextInput from '../TextInput';
import SelectInput from '../SelectInput';
import DateInput from '../DateInput';
import PrimaryButton from '../PrimaryButton';
import SecondaryButton from '../SecondaryButton';

const nombreDe = (e) =>
  [e?.firstName, e?.lastName].filter(Boolean).join(' ').trim() ||
  e?.userName ||
  e?.email ||
  'Sin nombre';

/**
 * Alta de un préstamo.
 *
 * @param {string} [userId]  Fija el colaborador y oculta el selector.
 * @param {() => void} [onCreated]
 * @param {() => void} [onCancel]
 */
const LoansAdd = ({ userId, onCreated, onCancel }) => {
  const { user } = useAppContext();
  const quien = user?.userName ?? user?.email ?? 'Sistema';
  const today = new Date().toISOString().split('T')[0];

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    userId: userId ?? '',
    title: '',
    amount: '',
    paymentMonths: '',
    requestAt: today,
    description: '',
  });

  const debeElegirEmpleado = !userId;

  useEffect(() => {
    if (!debeElegirEmpleado) return;

    const cargar = async () => {
      try {
        const response = await EmployeeApi.getAllEmployees();
        setEmployees(
          (response.data ?? []).filter((e) => e.isActive && !e.deleted)
        );
      } catch (err) {
        console.error(err);
        toast.error('No se pudieron cargar los empleados');
      }
    };

    cargar();
  }, [debeElegirEmpleado]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  /** Cuota estimada, sin intereses. */
  const cuota = useMemo(() => {
    const monto = Number(form.amount) || 0;
    const meses = Number(form.paymentMonths) || 0;
    return meses > 0 ? monto / meses : 0;
  }, [form.amount, form.paymentMonths]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    /* El selector no tenía opción vacía: si no se tocaba, `userId` quedaba
       sin valor y el préstamo se guardaba sin dueño. */
    if (!form.userId) {
      setError('Selecciona al colaborador.');
      return;
    }

    if (!form.title.trim()) {
      setError('El título es obligatorio.');
      return;
    }

    if (Number(form.amount) <= 0) {
      setError('El monto debe ser mayor a cero.');
      return;
    }

    if (Number(form.paymentMonths) <= 0) {
      setError('El plazo debe ser de al menos un mes.');
      return;
    }

    setLoading(true);

    try {
      await loansApi.createLoan({
        loanId: 0,
        amount: Number(form.amount),
        requestAt: form.requestAt,
        paymentMonths: Number(form.paymentMonths),
        state: 'Pendiente',
        description: form.description.trim() || null,
        title: form.title.trim(),
        createdBy: quien,
        createdAt: new Date().toISOString(),
        lastUpdatedAt: new Date().toISOString(),
        lastUpdatedBy: quien,
        deleted: false,
        userId: form.userId,
        user: null,
        payments: [],
      });

      toast.success('Préstamo registrado. Queda pendiente de aprobación.');

      setForm((prev) => ({
        ...prev,
        title: '',
        amount: '',
        paymentMonths: '',
        description: '',
      }));

      // Antes este callback no se recibía: la lista no se refrescaba nunca.
      onCreated?.();
    } catch (err) {
      console.error(err);
      const data = err?.response?.data;
      setError(
        typeof data === 'string' && data
          ? data
          : 'No se pudo registrar el préstamo.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 text-ink">
      <div>
        <h2 className="text-lg font-semibold">Solicitud de préstamo</h2>
        <p className="mt-1 text-xs text-ink-muted">
          Se registra como pendiente hasta que alguien lo apruebe.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      {debeElegirEmpleado && (
        <div>
          <Label htmlFor="loan-user">Colaborador *</Label>
          <SelectInput
            id="loan-user"
            name="userId"
            value={form.userId}
            onChange={handleChange}
          >
            <option value="">Selecciona un colaborador…</option>
            {employees.map((e) => (
              <option key={e.id} value={e.id}>
                {nombreDe(e)}
                {e.departament?.name ? ` — ${e.departament.name}` : ''}
              </option>
            ))}
          </SelectInput>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label htmlFor="loan-title">Título *</Label>
          <TextInput
            id="loan-title"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Ej: Préstamo personal"
          />
        </div>

        <div>
          <Label htmlFor="loan-amount">Monto *</Label>
          <TextInput
            id="loan-amount"
            name="amount"
            type="number"
            min="0"
            step="0.01"
            value={form.amount}
            onChange={handleChange}
            placeholder="0.00"
          />
        </div>

        <div>
          <Label htmlFor="loan-months">Plazo (meses) *</Label>
          <TextInput
            id="loan-months"
            name="paymentMonths"
            type="number"
            min="1"
            step="1"
            value={form.paymentMonths}
            onChange={handleChange}
            placeholder="6"
          />
        </div>

        <div>
          <Label htmlFor="loan-date">Fecha de solicitud</Label>
          <DateInput
            id="loan-date"
            name="requestAt"
            value={form.requestAt}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Cuota estimada */}
      {cuota > 0 && (
        <div className="flex items-center justify-between rounded-xl border border-stroke-soft bg-surface-alt p-4">
          <span className="text-sm text-ink-muted">Cuota mensual estimada</span>
          <span className="text-lg font-bold text-ink">
            {formatMoney(cuota)}
          </span>
        </div>
      )}

      <div>
        <Label htmlFor="loan-desc">Descripción</Label>
        <textarea
          id="loan-desc"
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={3}
          placeholder="Motivo del préstamo"
          className="w-full resize-none rounded-md border border-stroke border-b-2 border-b-ink-muted
                     bg-surface px-3 py-2 text-sm text-ink placeholder:text-ink-muted
                     transition-colors focus:border-b-brand focus:outline-none"
        />
      </div>

      <p className="flex items-start gap-2 rounded-lg bg-surface-alt p-3 text-xs leading-relaxed text-ink-muted">
        <Info size={14} className="mt-0.5 shrink-0" />
        La cuota es el monto dividido entre el plazo; el sistema no calcula
        intereses. Los abonos se registran desde el detalle del préstamo.
      </p>

      <div className="flex justify-end gap-3 border-t border-stroke-soft pt-4">
        {onCancel && (
          <SecondaryButton onClick={onCancel} disabled={loading}>
            Cancelar
          </SecondaryButton>
        )}

        <PrimaryButton type="submit" disabled={loading}>
          {loading ? (
            <>
              <Loader2 size={15} className="animate-spin" />
              Guardando…
            </>
          ) : (
            'Guardar préstamo'
          )}
        </PrimaryButton>
      </div>
    </form>
  );
};

export default LoansAdd;
