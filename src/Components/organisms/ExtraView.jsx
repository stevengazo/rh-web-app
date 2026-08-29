import { useState } from 'react';
import toast from 'react-hot-toast';
import { Check, Loader2, Pencil, Save, X } from 'lucide-react';

import extrasApi from '../../api/extrasApi';
import Label from '../Label';
import TextInput from '../TextInput';
import PrimaryButton from '../PrimaryButton';
import SecondaryButton from '../SecondaryButton';
import Divider from '../Divider';
import { fieldClasses } from '../atoms/fieldClasses';
import { formatMoney } from '../../utils/formatMoney';

const formatFechaHora = (valor) => {
  if (!valor || String(valor).startsWith('0001-01-01')) return '—';
  const f = new Date(valor);
  return Number.isNaN(f.getTime())
    ? '—'
    : f.toLocaleString('es-CR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
};

/** ISO → valor para `datetime-local`, sin arrastrar la zona horaria. */
const paraInput = (valor) => {
  if (!valor) return '';
  const f = new Date(valor);
  if (Number.isNaN(f.getTime())) return '';

  const p = (n) => String(n).padStart(2, '0');
  return `${f.getFullYear()}-${p(f.getMonth() + 1)}-${p(f.getDate())}T${p(f.getHours())}:${p(f.getMinutes())}`;
};

const horasEntre = (a, b) => {
  const i = new Date(a);
  const f = new Date(b);
  if (Number.isNaN(i.getTime()) || Number.isNaN(f.getTime())) return null;
  const h = (f - i) / 3_600_000;
  return h > 0 ? h : null;
};

/** Dato de solo lectura. */
const Dato = ({ label, children }) => (
  <div>
    <p className="mb-1 text-xs uppercase tracking-wide text-ink-muted">
      {label}
    </p>
    <div className="text-sm font-medium text-ink">{children}</div>
  </div>
);

/**
 * Detalle de una hora extra, con edición y aprobación.
 *
 * Estaba escrito para el tema oscuro antiguo (`text-slate-100` sobre
 * `bg-slate-700`); dentro del panel lateral claro quedaba texto blanco sobre
 * blanco. Ahora usa los tokens del sistema y funciona en ambos temas.
 */
const ExtraView = ({ extra, onUpdated, OnClose }) => {
  const [editando, setEditando] = useState(false);
  const [guardando, setGuardando] = useState(false);

  const [form, setForm] = useState({
    start: paraInput(extra?.start),
    end: paraInput(extra?.end),
    amount: extra?.amount ?? '',
    notes: extra?.notes ?? '',
  });

  if (!extra) return null;

  const cambiar = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const ejecutar = async (fn, exito, fallo) => {
    setGuardando(true);
    try {
      await fn();
      toast.success(exito);
      onUpdated?.();
      return true;
    } catch (error) {
      console.error(error);
      toast.error(fallo);
      return false;
    } finally {
      setGuardando(false);
    }
  };

  const guardar = async () => {
    const ok = await ejecutar(
      () =>
        extrasApi.updateExtra(extra.extraId, {
          ...extra,
          start: new Date(form.start).toISOString(),
          end: new Date(form.end).toISOString(),
          amount: Number(form.amount),
          notes: form.notes.trim() || null,
        }),
      'Hora extra actualizada',
      'No se pudieron guardar los cambios'
    );

    if (ok) setEditando(false);
  };

  const cambiarAprobacion = async (aprobar) => {
    const ok = await ejecutar(
      () =>
        extrasApi.updateExtra(extra.extraId, {
          ...extra,
          isApproved: aprobar,
        }),
      aprobar ? 'Hora extra aprobada' : 'Aprobación retirada',
      'No se pudo cambiar el estado'
    );

    if (ok) OnClose?.();
  };

  const horas = horasEntre(extra.start, extra.end);

  return (
    <div className="space-y-5 text-ink">
      {/* Encabezado */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="truncate text-lg font-semibold text-ink">
            {extra.extraType?.name || 'Hora extra'}
          </h2>
          {extra.extraType?.factor && (
            <p className="mt-0.5 text-sm text-ink-muted">
              Recargo ×{extra.extraType.factor}
            </p>
          )}
        </div>

        <span
          className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-0.5
            text-xs font-semibold ${
              extra.isApproved
                ? 'border-green-200 bg-green-50 text-green-700'
                : 'border-amber-200 bg-amber-50 text-amber-800'
            }`}
        >
          {extra.isApproved ? <Check size={13} /> : <X size={13} />}
          {extra.isApproved ? 'Aprobada' : 'Pendiente'}
        </span>
      </div>

      <Divider />

      {editando ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="ev-inicio">Inicio</Label>
              <input
                id="ev-inicio"
                type="datetime-local"
                name="start"
                value={form.start}
                onChange={cambiar}
                className={fieldClasses({ className: 'h-10' })}
              />
            </div>

            <div>
              <Label htmlFor="ev-fin">Fin</Label>
              <input
                id="ev-fin"
                type="datetime-local"
                name="end"
                value={form.end}
                onChange={cambiar}
                min={form.start}
                className={fieldClasses({ className: 'h-10' })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="ev-monto">Monto</Label>
            <TextInput
              id="ev-monto"
              type="number"
              step="0.01"
              min="0"
              name="amount"
              value={form.amount}
              onChange={cambiar}
            />
          </div>

          <div>
            <Label htmlFor="ev-notas">Notas</Label>
            <textarea
              id="ev-notas"
              name="notes"
              rows={3}
              value={form.notes}
              onChange={cambiar}
              className="w-full resize-none rounded-md border border-stroke border-b-2
                         border-b-ink-muted bg-surface px-3 py-2 text-sm text-ink
                         placeholder:text-ink-muted transition-colors
                         focus:border-b-brand focus:outline-none"
            />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 rounded-xl border border-stroke-soft bg-surface-alt p-4 sm:grid-cols-2">
          <Dato label="Monto">
            <span className="text-base font-bold">
              {formatMoney(extra.amount)}
            </span>
          </Dato>

          <Dato label="Duración">
            {horas === null ? '—' : `${horas.toFixed(2)} horas`}
          </Dato>

          <Dato label="Inicio">{formatFechaHora(extra.start)}</Dato>
          <Dato label="Fin">{formatFechaHora(extra.end)}</Dato>

          <Dato label="Registrada por">{extra.createdBy || '—'}</Dato>

          {extra.approvedBy && (
            <Dato label="Aprobada por">{extra.approvedBy}</Dato>
          )}

          <div className="sm:col-span-2">
            <p className="mb-1 text-xs uppercase tracking-wide text-ink-muted">
              Notas
            </p>
            <p className="text-sm leading-relaxed text-ink">
              {extra.notes || 'Sin notas'}
            </p>
          </div>
        </div>
      )}

      {/* Acciones */}
      <div className="flex flex-wrap justify-end gap-3 border-t border-stroke-soft pt-4">
        {editando ? (
          <>
            <SecondaryButton
              onClick={() => setEditando(false)}
              disabled={guardando}
            >
              Cancelar
            </SecondaryButton>

            <PrimaryButton onClick={guardar} disabled={guardando}>
              {guardando ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <Save size={15} />
              )}
              Guardar cambios
            </PrimaryButton>
          </>
        ) : (
          <>
            <SecondaryButton
              onClick={() => setEditando(true)}
              disabled={guardando}
            >
              <Pencil size={15} />
              Editar
            </SecondaryButton>

            {extra.isApproved ? (
              <button
                type="button"
                onClick={() => cambiarAprobacion(false)}
                disabled={guardando}
                className="inline-flex h-8 items-center gap-2 rounded-md border border-stroke
                           bg-surface px-3 text-sm font-semibold text-ink-secondary
                           transition-colors hover:border-red-300 hover:bg-red-50
                           hover:text-red-600 disabled:opacity-60"
              >
                <X size={15} />
                Retirar aprobación
              </button>
            ) : (
              <button
                type="button"
                onClick={() => cambiarAprobacion(true)}
                disabled={guardando}
                className="inline-flex h-8 items-center gap-2 rounded-md border border-transparent
                           bg-green-600 px-3 text-sm font-semibold text-white transition-colors
                           hover:bg-green-700 disabled:opacity-60"
              >
                <Check size={15} />
                Aprobar
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ExtraView;
