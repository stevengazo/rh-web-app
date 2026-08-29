import { useState } from 'react';
import toast from 'react-hot-toast';
import { CalendarDays, Loader2 } from 'lucide-react';

import VacationsApi from '../../api/vacationsApi';
import Label from '../Label';
import PrimaryButton from '../PrimaryButton';
import ErrorText from '../ErrorText';
import { fieldClasses } from '../atoms/fieldClasses';
import { mensajeDeError } from '../../utils/apiError';

const hoyISO = () => new Date().toISOString().split('T')[0];

/**
 * Solicitud de vacaciones.
 *
 * El colaborador no elige a quién se le registran: el identificador llega por
 * props y no se muestra como campo editable (antes era un input de texto con
 * el GUID a la vista). La solicitud siempre nace **pendiente**; quien aprueba
 * lo hace desde el expediente.
 *
 * @param {string} userId
 * @param {() => void} [onAdded]  Se llama al guardar con éxito.
 */
const VacationsAdd = ({ userId, id, onAdded }) => {
  const usuario = userId ?? id;
  const minimo = hoyISO();

  const [form, setForm] = useState({ startDate: '', endDate: '', reason: '' });
  const [errors, setErrors] = useState({});
  const [guardando, setGuardando] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => {
      // Si la fecha final queda antes de la inicial, se limpia.
      if (name === 'startDate' && prev.endDate && value > prev.endDate) {
        return { ...prev, startDate: value, endDate: '' };
      }
      return { ...prev, [name]: value };
    });
  };

  /** Días naturales solicitados, ambos extremos incluidos. */
  const dias = (() => {
    if (!form.startDate || !form.endDate) return 0;
    const d =
      Math.floor(
        (new Date(form.endDate) - new Date(form.startDate)) / 86400000
      ) + 1;
    return d > 0 ? d : 0;
  })();

  const validar = () => {
    const nuevos = {};

    if (!usuario) {
      nuevos.userId = 'No se identificó al colaborador.';
    }

    if (!form.startDate || !form.endDate) {
      nuevos.dateRange = 'Seleccione la fecha de inicio y la de fin.';
    } else if (form.startDate < minimo) {
      nuevos.dateRange = 'No se pueden solicitar fechas pasadas.';
    } else if (form.endDate < form.startDate) {
      nuevos.dateRange = 'La fecha final no puede ser menor que la inicial.';
    }

    setErrors(nuevos);
    return Object.keys(nuevos).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validar()) return;

    setGuardando(true);

    try {
      /* Las fechas se envían a medianoche local: mandarlas con `toISOString()`
         las corría un día hacia atrás en Costa Rica. */
      await VacationsApi.createVacation({
        userId: usuario,
        startDate: `${form.startDate}T00:00:00`,
        endDate: `${form.endDate}T00:00:00`,
        reason: form.reason.trim() || null,
      });

      toast.success('Solicitud de vacaciones enviada');
      setForm({ startDate: '', endDate: '', reason: '' });
      onAdded?.();
    } catch (error) {
      console.error(error);
      toast.error(
        mensajeDeError(error, 'No se pudo registrar la solicitud.')
      );
    } finally {
      setGuardando(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {errors.userId && <ErrorText>{errors.userId}</ErrorText>}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="vac-inicio">Fecha de inicio</Label>
          <input
            id="vac-inicio"
            type="date"
            name="startDate"
            value={form.startDate}
            min={minimo}
            onChange={handleChange}
            className={fieldClasses({ className: 'h-10' })}
          />
        </div>

        <div>
          <Label htmlFor="vac-fin">Fecha de finalización</Label>
          <input
            id="vac-fin"
            type="date"
            name="endDate"
            value={form.endDate}
            min={form.startDate || minimo}
            disabled={!form.startDate}
            onChange={handleChange}
            className={fieldClasses({ className: 'h-10' })}
          />
        </div>
      </div>

      {errors.dateRange && <ErrorText>{errors.dateRange}</ErrorText>}

      <div>
        <Label htmlFor="vac-motivo">Motivo (opcional)</Label>
        <textarea
          id="vac-motivo"
          name="reason"
          rows={3}
          value={form.reason}
          onChange={handleChange}
          placeholder="Vacaciones de fin de año, asunto familiar…"
          className="w-full resize-none rounded-md border border-stroke border-b-2
                     border-b-ink-muted bg-surface px-3 py-2 text-sm text-ink
                     placeholder:text-ink-muted transition-colors
                     focus:border-b-brand focus:outline-none"
        />
      </div>

      {/* Resumen: el dato que de verdad importa antes de enviar. */}
      <div className="flex items-center gap-3 rounded-xl border border-stroke-soft bg-surface-alt p-4">
        <span className="grid h-10 w-10 place-items-center rounded-full bg-brand-tint text-brand">
          <CalendarDays size={18} />
        </span>

        <div>
          <p className="text-xs uppercase tracking-wide text-ink-muted">
            Días solicitados
          </p>
          <p className="text-xl font-bold text-ink">{dias}</p>
        </div>

        <p className="ml-auto text-xs text-ink-muted">
          Queda <span className="font-semibold">pendiente</span> de aprobación.
        </p>
      </div>

      <div className="flex justify-end">
        <PrimaryButton type="submit" disabled={guardando || dias === 0}>
          {guardando && <Loader2 size={15} className="animate-spin" />}
          {guardando ? 'Enviando…' : 'Enviar solicitud'}
        </PrimaryButton>
      </div>
    </form>
  );
};

export default VacationsAdd;
