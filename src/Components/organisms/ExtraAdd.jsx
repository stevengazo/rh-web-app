import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { Calculator, Info, Loader2 } from 'lucide-react';

import extrasApi from '../../api/extrasApi';
import extraTypeApi from '../../api/extraType';
import salaryApi from '../../api/salaryApi';

import Label from '../Label';
import TextInput from '../TextInput';
import SelectInput from '../SelectInput';
import PrimaryButton from '../PrimaryButton';
import SecondaryButton from '../SecondaryButton';
import { fieldClasses } from '../atoms/fieldClasses';
import { formatMoney } from '../../utils/formatMoney';

/** Jornada ordinaria usada para derivar la tarifa por hora. */
const DIAS_MES = 30;
const HORAS_DIA = 8;

/**
 * Registro de horas extra.
 *
 * El monto se calcula solo: horas trabajadas × tarifa por hora × factor del
 * tipo de extra (1.5 para recargo normal, 2 para doble). Antes había que
 * teclearlo a mano, con lo que cada quien aplicaba su propio criterio.
 *
 * @param {string} userId
 * @param {object} [author]
 * @param {() => void} [onAdded]
 * @param {() => void} [onCancel]
 */
const ExtraAdd = ({ userId, author, onAdded, onCancel }) => {
  const [extraTypes, setExtraTypes] = useState([]);
  const [salarioMensual, setSalarioMensual] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [manual, setManual] = useState(false);

  const [form, setForm] = useState({
    start: '',
    end: '',
    amount: '',
    notes: '',
    extraTypeId: '',
  });

  /* Tipos de extra y salario vigente del colaborador. */
  useEffect(() => {
    const cargar = async () => {
      try {
        const tipos = await extraTypeApi.getallExtraTypes();
        setExtraTypes(tipos?.data ?? []);
      } catch (err) {
        console.error(err);
        toast.error('No se pudieron cargar los tipos de extra');
      }

      if (!userId) return;

      try {
        const resp = await salaryApi.getSalariesByUser(userId);
        const lista = Array.isArray(resp?.data) ? resp.data : [];

        const vigente = [...lista]
          .filter((s) => s?.salaryAmount)
          .sort(
            (a, b) => new Date(b.effectiveDate) - new Date(a.effectiveDate)
          )[0];

        setSalarioMensual(vigente?.salaryAmount ?? null);
      } catch (err) {
        console.error('No se pudo obtener el salario vigente:', err);
        setSalarioMensual(null);
      }
    };

    cargar();
  }, [userId]);

  /** Horas entre inicio y fin. */
  const horas = useMemo(() => {
    if (!form.start || !form.end) return null;

    const inicio = new Date(form.start);
    const fin = new Date(form.end);

    if (Number.isNaN(inicio.getTime()) || Number.isNaN(fin.getTime())) return null;
    if (fin <= inicio) return 0;

    return (fin - inicio) / 3_600_000;
  }, [form.start, form.end]);

  const tipoSeleccionado = extraTypes.find(
    (t) => String(t.extraTypeId) === String(form.extraTypeId)
  );

  const tarifaHora = salarioMensual
    ? salarioMensual / DIAS_MES / HORAS_DIA
    : null;

  const factor = tipoSeleccionado?.factor ?? null;

  /** Monto sugerido: horas × tarifa × factor. */
  const montoCalculado = useMemo(() => {
    if (!horas || !tarifaHora || !factor) return null;
    return horas * tarifaHora * factor;
  }, [horas, tarifaHora, factor]);

  /* Mientras no se edite a mano, el monto sigue al cálculo. */
  useEffect(() => {
    if (manual || montoCalculado === null) return;
    setForm((prev) => ({ ...prev, amount: montoCalculado.toFixed(2) }));
  }, [montoCalculado, manual]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
      // Si el inicio se pasa del fin, se limpia el fin
      ...(name === 'start' && prev.end && value >= prev.end && { end: '' }),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.extraTypeId) return setError('Selecciona el tipo de extra.');
    if (!form.start || !form.end) return setError('Indica el inicio y el fin.');
    if (horas === 0) return setError('El fin debe ser posterior al inicio.');
    if (!Number(form.amount)) return setError('El monto debe ser mayor a cero.');

    setLoading(true);

    try {
      await extrasApi.createExtra({
        start: new Date(form.start).toISOString(),
        end: new Date(form.end).toISOString(),
        amount: Number(form.amount),
        notes: form.notes.trim() || null,
        createdBy: author?.userName ?? author?.email ?? 'Sistema',
        createdAt: new Date().toISOString(),
        isApproved: false,
        deleted: false,
        userId,
        extraTypeId: Number(form.extraTypeId),
      });

      toast.success('Extra registrado');

      setForm({ start: '', end: '', amount: '', notes: '', extraTypeId: '' });
      setManual(false);
      onAdded?.();
    } catch (err) {
      console.error(err);
      setError('No se pudo guardar el extra.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 text-ink">
      <div>
        <h2 className="text-lg font-semibold">Registrar horas extra</h2>
        <p className="mt-1 text-xs text-ink-muted">
          El monto se calcula con el recargo del tipo seleccionado.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      <div>
        <Label htmlFor="extra-tipo">Tipo de extra *</Label>
        <SelectInput
          id="extra-tipo"
          name="extraTypeId"
          value={form.extraTypeId}
          onChange={handleChange}
        >
          <option value="">Seleccione un tipo…</option>
          {extraTypes.map((t) => (
            <option key={t.extraTypeId} value={t.extraTypeId}>
              {t.name}
              {t.factor ? ` (×${t.factor})` : ''}
            </option>
          ))}
        </SelectInput>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="extra-inicio">Inicio *</Label>
          <input
            id="extra-inicio"
            type="datetime-local"
            name="start"
            value={form.start}
            onChange={handleChange}
            className={fieldClasses({ className: 'h-10' })}
          />
        </div>

        <div>
          <Label htmlFor="extra-fin">Fin *</Label>
          <input
            id="extra-fin"
            type="datetime-local"
            name="end"
            value={form.end}
            onChange={handleChange}
            min={form.start}
            className={fieldClasses({ className: 'h-10' })}
          />
        </div>
      </div>

      {/* Desglose del cálculo */}
      <div className="rounded-xl border border-stroke-soft bg-surface-alt p-4">
        <h3 className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-brand">
          <Calculator size={13} />
          Cálculo
        </h3>

        {salarioMensual === null ? (
          <p className="flex items-start gap-2 text-sm text-amber-800">
            <Info size={14} className="mt-0.5 shrink-0" />
            El colaborador no tiene salario vigente, así que no se puede calcular
            la tarifa. Escribe el monto a mano o regístrale el salario.
          </p>
        ) : (
          <dl className="space-y-1 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-ink-muted">Horas</dt>
              <dd className="font-medium text-ink">
                {horas === null ? '—' : `${horas.toFixed(2)} h`}
              </dd>
            </div>

            <div className="flex justify-between gap-3">
              <dt className="text-ink-muted">Tarifa por hora</dt>
              <dd className="font-medium text-ink">{formatMoney(tarifaHora)}</dd>
            </div>

            <div className="flex justify-between gap-3">
              <dt className="text-ink-muted">Recargo</dt>
              <dd className="font-medium text-ink">
                {factor ? `× ${factor}` : '—'}
              </dd>
            </div>

            <div className="mt-2 flex justify-between gap-3 border-t border-stroke-soft pt-2">
              <dt className="font-semibold text-ink">Monto sugerido</dt>
              <dd className="font-bold text-ink">
                {montoCalculado === null ? '—' : formatMoney(montoCalculado)}
              </dd>
            </div>
          </dl>
        )}
      </div>

      <div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Label htmlFor="extra-monto" className="mb-0">
            Monto *
          </Label>

          <label className="flex cursor-pointer items-center gap-1.5 text-xs text-ink-muted">
            <input
              type="checkbox"
              checked={manual}
              onChange={(e) => setManual(e.target.checked)}
              className="h-3.5 w-3.5 accent-(--color-brand)"
            />
            Ajustar a mano
          </label>
        </div>

        <TextInput
          id="extra-monto"
          type="number"
          step="0.01"
          min="0"
          name="amount"
          value={form.amount}
          onChange={handleChange}
          disabled={!manual && montoCalculado !== null}
          className="mt-1"
        />

        {!manual && montoCalculado !== null && (
          <p className="mt-1 text-xs text-ink-muted">
            Calculado automáticamente. Marca «Ajustar a mano» para cambiarlo.
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="extra-notas">Notas</Label>
        <textarea
          id="extra-notas"
          name="notes"
          rows={3}
          value={form.notes}
          onChange={handleChange}
          placeholder="Motivo del tiempo extra"
          className="w-full resize-none rounded-md border border-stroke border-b-2
                     border-b-ink-muted bg-surface px-3 py-2 text-sm text-ink
                     placeholder:text-ink-muted transition-colors
                     focus:border-b-brand focus:outline-none"
        />
      </div>

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
            'Guardar extra'
          )}
        </PrimaryButton>
      </div>
    </form>
  );
};

export default ExtraAdd;
