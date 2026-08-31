import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { Info, Loader2 } from 'lucide-react';

import loansApi from '../../api/loansApi';
import { useAppContext } from '../../context/AppContext';
import { formatMoney } from '../../utils/formatMoney';
import { mensajeDeError } from '../../utils/apiError';

import Label from '../Label';
import TextInput from '../TextInput';
import DateInput from '../DateInput';
import PrimaryButton from '../PrimaryButton';
import SecondaryButton from '../SecondaryButton';

const soloFecha = (valor) => {
  if (!valor) return new Date().toISOString().split('T')[0];
  const f = new Date(valor);
  return Number.isNaN(f.getTime())
    ? new Date().toISOString().split('T')[0]
    : f.toISOString().split('T')[0];
};

/**
 * Edición de un préstamo **pendiente**. El colaborador no se reasigna; el
 * backend rechaza el cambio si el préstamo ya fue aprobado o rechazado.
 *
 * @param {Object} loan
 * @param {() => void} [onSaved]
 * @param {() => void} [onCancel]
 */
const LoanEdit = ({ loan, onSaved, onCancel }) => {
  const { user } = useAppContext();
  const quien = user?.userName ?? user?.email ?? 'Sistema';

  const [form, setForm] = useState({
    title: loan?.title ?? '',
    amount: loan?.amount != null ? String(loan.amount) : '',
    paymentMonths: loan?.paymentMonths ? String(loan.paymentMonths) : '',
    requestAt: soloFecha(loan?.requestAt),
    description: loan?.description ?? '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const cuota = useMemo(() => {
    const monto = Number(form.amount) || 0;
    const meses = Number(form.paymentMonths) || 0;
    return meses > 0 ? monto / meses : 0;
  }, [form.amount, form.paymentMonths]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

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
      await loansApi.updateLoan(loan.loanId, {
        title: form.title.trim(),
        amount: Number(form.amount),
        paymentMonths: Number(form.paymentMonths),
        requestAt: form.requestAt,
        description: form.description.trim() || null,
        userName: quien,
      });

      toast.success('Préstamo actualizado.');
      onSaved?.();
    } catch (err) {
      console.error(err);
      const mensaje = mensajeDeError(err, 'No se pudo actualizar el préstamo.');
      setError(mensaje);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 text-ink">
      <div>
        <h2 className="text-lg font-semibold">Editar préstamo</h2>
        <p className="mt-1 text-xs text-ink-muted">
          Solo se puede editar mientras está pendiente de aprobación.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label htmlFor="loan-edit-title">Título *</Label>
          <TextInput
            id="loan-edit-title"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Ej: Préstamo personal"
          />
        </div>

        <div>
          <Label htmlFor="loan-edit-amount">Monto *</Label>
          <TextInput
            id="loan-edit-amount"
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
          <Label htmlFor="loan-edit-months">Plazo (meses) *</Label>
          <TextInput
            id="loan-edit-months"
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
          <Label htmlFor="loan-edit-date">Fecha de solicitud</Label>
          <DateInput
            id="loan-edit-date"
            name="requestAt"
            value={form.requestAt}
            onChange={handleChange}
          />
        </div>
      </div>

      {cuota > 0 && (
        <div className="flex items-center justify-between rounded-xl border border-stroke-soft bg-surface-alt p-4">
          <span className="text-sm text-ink-muted">Cuota mensual estimada</span>
          <span className="text-lg font-bold text-ink">{formatMoney(cuota)}</span>
        </div>
      )}

      <div>
        <Label htmlFor="loan-edit-desc">Descripción</Label>
        <textarea
          id="loan-edit-desc"
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
        intereses.
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
            'Guardar cambios'
          )}
        </PrimaryButton>
      </div>
    </form>
  );
};

export default LoanEdit;
