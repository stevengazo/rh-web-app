import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { Clock, Loader2, MinusCircle, PlusCircle } from 'lucide-react';

import extrasApi from '../../api/extrasApi';
import extraTypeApi from '../../api/extraType';
import absencesApi from '../../api/absencesApi';
import salaryApi from '../../api/salaryApi';
import payrollApi from '../../api/payrollApi';

import Label from '../Label';
import TextInput from '../TextInput';
import SelectInput from '../SelectInput';
import PrimaryButton from '../PrimaryButton';
import SecondaryButton from '../SecondaryButton';
import ErrorText from '../ErrorText';
import { fieldClasses } from '../atoms/fieldClasses';
import { formatMoney } from '../../utils/formatMoney';
import { mensajeDeError } from '../../utils/apiError';
import { salarioVigente, tarifaPorHora } from '../../utils/tarifas';

/** Fecha del periodo lista para un `datetime-local`. */
const aInputLocal = (fecha, hora = 8) => {
  const f = fecha ? new Date(fecha) : new Date();
  if (Number.isNaN(f.getTime())) return '';
  f.setHours(hora, 0, 0, 0);

  const p = (n) => String(n).padStart(2, '0');
  return `${f.getFullYear()}-${p(f.getMonth() + 1)}-${p(f.getDate())}T${p(f.getHours())}:${p(f.getMinutes())}`;
};

const horasEntre = (a, b) => {
  const i = new Date(a);
  const f = new Date(b);
  if (Number.isNaN(i.getTime()) || Number.isNaN(f.getTime())) return 0;
  const h = (f - i) / 3_600_000;
  return h > 0 ? h : 0;
};

/**
 * Alta rápida de una hora extra o de un rebajo, desde la propia planilla.
 *
 * Hasta ahora había que salirse a Extras o a Ausencias, registrarlo,
 * aprobarlo y volver. Aquí se crea **ya aprobado y ya vinculado** a la
 * planilla: quien está armando el periodo es quien tiene la autoridad para
 * hacerlo, y el registro queda en su módulo como cualquier otro.
 *
 * El monto se calcula con la tarifa del colaborador y se puede ajustar.
 *
 * @param {('extra'|'rebajo')} tipo
 * @param {string} userId
 * @param {object} periodo `{ initialDate, finalDate }` de la planilla.
 * @param {number} payrollId
 * @param {string} [autor]
 * @param {() => void} onCreado
 * @param {() => void} onCancelar
 */
const PayrollQuickAdd = ({
  tipo,
  userId,
  periodo,
  payrollId,
  autor,
  onCreado,
  onCancelar,
}) => {
  const esExtra = tipo === 'extra';

  const [tiposExtra, setTiposExtra] = useState([]);
  const [salario, setSalario] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');
  const [manual, setManual] = useState(false);

  const [form, setForm] = useState(() => ({
    extraTypeId: '',
    title: '',
    start: aInputLocal(periodo?.initialDate, esExtra ? 17 : 8),
    end: aInputLocal(periodo?.initialDate, esExtra ? 20 : 16),
    amount: '',
    notes: '',
  }));

  useEffect(() => {
    const cargar = async () => {
      if (esExtra) {
        try {
          const resp = await extraTypeApi.getallExtraTypes();
          const lista = Array.isArray(resp?.data) ? resp.data : [];
          setTiposExtra(lista);
          setForm((prev) => ({
            ...prev,
            extraTypeId: prev.extraTypeId || lista[0]?.extraTypeId || '',
          }));
        } catch (err) {
          console.error(err);
          toast.error('No se pudieron cargar los tipos de extra');
        }
      }

      try {
        const resp = await salaryApi.getSalariesByUser(userId);
        setSalario(salarioVigente(Array.isArray(resp?.data) ? resp.data : []));
      } catch (err) {
        console.error('No se pudo obtener el salario vigente:', err);
        setSalario(null);
      }
    };

    cargar();
  }, [esExtra, userId]);

  const horas = horasEntre(form.start, form.end);
  const tarifa = tarifaPorHora(salario);

  const factor = useMemo(() => {
    if (!esExtra) return 1;
    const t = tiposExtra.find(
      (x) => String(x.extraTypeId) === String(form.extraTypeId)
    );
    return t?.factor ?? 1.5;
  }, [esExtra, tiposExtra, form.extraTypeId]);

  const montoCalculado = useMemo(() => {
    if (!horas || !tarifa) return null;
    return horas * tarifa * (esExtra ? factor : 1);
  }, [horas, tarifa, factor, esExtra]);

  const monto = manual ? Number(form.amount) || 0 : (montoCalculado ?? 0);

  const cambiar = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const guardar = async (e) => {
    e.preventDefault();
    setError('');

    if (!horas) {
      setError('La hora de fin debe ser posterior a la de inicio.');
      return;
    }
    if (esExtra && !form.extraTypeId) {
      setError('Elija el tipo de hora extra.');
      return;
    }
    if (!monto) {
      setError('El monto debe ser mayor a cero.');
      return;
    }

    setGuardando(true);

    try {
      if (esExtra) {
        /* Nace aprobada y ya vinculada: la registra quien arma la planilla,
           que es quien la aprobaría de todos modos. */
        await extrasApi.createExtra({
          userId,
          extraTypeId: Number(form.extraTypeId),
          start: form.start,
          end: form.end,
          amount: monto,
          notes: form.notes.trim() || 'Registrada desde la planilla',
          isApproved: true,
          approvedBy: autor ?? null,
          approvedAt: new Date().toISOString(),
          createdBy: autor ?? null,
          payrollId,
          deleted: false,
        });
      } else {
        const creada = await absencesApi.createAbsence({
          userId,
          title: form.title.trim() || 'Rebajo',
          startDate: form.start,
          endDate: form.end,
          reason: form.notes.trim() || 'Registrado desde la planilla',
          justified: false,
          amount: monto,
          createdBy: autor ?? null,
          deleted: false,
        });

        /* El POST fuerza el estado a Pendiente —así nace toda ausencia—, así
           que hay que aprobarla aparte y luego vincularla a la planilla. */
        const id = creada?.data?.absenceId;
        if (id) {
          await absencesApi.approveAbsence(id, autor);
          await payrollApi.attachItems(payrollId, { absenceIds: [id] });
        }
      }

      toast.success(esExtra ? 'Hora extra registrada' : 'Rebajo registrado');
      onCreado?.();
    } catch (err) {
      console.error(err);
      setError(mensajeDeError(err, 'No se pudo guardar el registro.'));
    } finally {
      setGuardando(false);
    }
  };

  const Icono = esExtra ? PlusCircle : MinusCircle;

  return (
    <form onSubmit={guardar} className="space-y-4">
      <div className="flex items-center gap-2">
        <Icono
          size={16}
          className={esExtra ? 'text-green-700' : 'text-red-600'}
        />
        <h3 className="text-sm font-semibold text-ink">
          {esExtra ? 'Nueva hora extra' : 'Nuevo rebajo'}
        </h3>
      </div>

      {esExtra ? (
        <div>
          <Label htmlFor="qa-tipo">Tipo</Label>
          <SelectInput
            id="qa-tipo"
            name="extraTypeId"
            value={form.extraTypeId}
            onChange={cambiar}
          >
            {tiposExtra.map((t) => (
              <option key={t.extraTypeId} value={t.extraTypeId}>
                {t.name} (×{t.factor})
              </option>
            ))}
          </SelectInput>
        </div>
      ) : (
        <div>
          <Label htmlFor="qa-titulo">Concepto</Label>
          <TextInput
            id="qa-titulo"
            name="title"
            value={form.title}
            onChange={cambiar}
            placeholder="Ej: Llegadas tardías"
          />
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <Label htmlFor="qa-inicio">Desde</Label>
          <input
            id="qa-inicio"
            type="datetime-local"
            name="start"
            value={form.start}
            onChange={cambiar}
            className={fieldClasses({ className: 'h-10' })}
          />
        </div>

        <div>
          <Label htmlFor="qa-fin">Hasta</Label>
          <input
            id="qa-fin"
            type="datetime-local"
            name="end"
            value={form.end}
            min={form.start}
            onChange={cambiar}
            className={fieldClasses({ className: 'h-10' })}
          />
        </div>
      </div>

      {/* Cálculo */}
      <div className="rounded-lg border border-stroke-soft bg-surface-alt p-3">
        {salario === null ? (
          <p className="text-xs text-amber-800">
            El colaborador no tiene salario vigente: escribe el monto a mano.
          </p>
        ) : (
          <dl className="grid grid-cols-3 gap-2 text-xs">
            <div>
              <dt className="text-ink-muted">Tarifa/hora</dt>
              <dd className="font-medium text-ink">{formatMoney(tarifa)}</dd>
            </div>
            <div>
              <dt className="text-ink-muted">Duración</dt>
              <dd className="font-medium text-ink">
                {horas.toFixed(2)} h{esExtra ? ` · ×${factor}` : ''}
              </dd>
            </div>
            <div>
              <dt className="text-ink-muted">Monto</dt>
              <dd
                className={`font-bold ${esExtra ? 'text-green-700' : 'text-red-600'}`}
              >
                {formatMoney(monto)}
              </dd>
            </div>
          </dl>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between gap-2">
          <Label htmlFor="qa-monto" className="mb-0">
            Monto
          </Label>

          {montoCalculado !== null && (
            <button
              type="button"
              onClick={() => {
                if (manual) setForm((p) => ({ ...p, amount: '' }));
                else
                  setForm((p) => ({
                    ...p,
                    amount: montoCalculado.toFixed(2),
                  }));
                setManual(!manual);
              }}
              className="text-xs font-semibold text-brand hover:underline"
            >
              {manual ? 'Usar el cálculo' : 'Ajustar a mano'}
            </button>
          )}
        </div>

        <TextInput
          id="qa-monto"
          type="number"
          step="0.01"
          min="0"
          name="amount"
          value={manual ? form.amount : (montoCalculado?.toFixed(2) ?? '')}
          onChange={cambiar}
          disabled={!manual && montoCalculado !== null}
          className="mt-2"
        />
      </div>

      <div>
        <Label htmlFor="qa-notas">Notas</Label>
        <textarea
          id="qa-notas"
          name="notes"
          rows={2}
          value={form.notes}
          onChange={cambiar}
          className="w-full resize-none rounded-md border border-stroke border-b-2
                     border-b-ink-muted bg-surface px-3 py-2 text-sm text-ink
                     placeholder:text-ink-muted transition-colors
                     focus:border-b-brand focus:outline-none"
        />
      </div>

      {error && <ErrorText>{error}</ErrorText>}

      <div className="flex justify-end gap-3 border-t border-stroke-soft pt-3">
        <SecondaryButton onClick={onCancelar} disabled={guardando}>
          Cancelar
        </SecondaryButton>

        <PrimaryButton type="submit" disabled={guardando}>
          {guardando ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <Clock size={15} />
          )}
          {guardando ? 'Guardando…' : 'Agregar a la planilla'}
        </PrimaryButton>
      </div>
    </form>
  );
};

export default PayrollQuickAdd;
