import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { CalendarClock, Inbox, Loader2 } from 'lucide-react';

import payrollApi from '../../api/payrollApi';
import PrimaryButton from '../PrimaryButton';
import SecondaryButton from '../SecondaryButton';
import { formatMoney } from '../../utils/formatMoney';
import { mensajeDeError } from '../../utils/apiError';

const formatFecha = (valor) => {
  if (!valor) return '—';
  const f = new Date(valor);
  return Number.isNaN(f.getTime())
    ? '—'
    : f.toLocaleDateString('es-CR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
};

/** Fila seleccionable. */
const Opcion = ({ marcada, onToggle, titulo, subtitulo, monto, tono }) => (
  <li>
    <label className="flex cursor-pointer items-start gap-3 border-b border-stroke-soft py-2.5 last:border-0">
      <input
        type="checkbox"
        checked={marcada}
        onChange={onToggle}
        className="mt-1 h-4 w-4 shrink-0 accent-brand"
      />

      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium text-ink">
          {titulo}
        </span>
        <span className="block text-xs text-ink-muted">{subtitulo}</span>
      </span>

      <span className={`shrink-0 text-sm font-semibold ${tono}`}>{monto}</span>
    </label>
  </li>
);

/**
 * Trae a la planilla registros aprobados de **otros periodos** que nadie ha
 * liquidado.
 *
 * Existen porque las aprobaciones llegan tarde: una hora extra de la quincena
 * pasada que se aprobó ayer no entra en el rango de esta planilla y, sin esta
 * pantalla, se quedaría sin cobrar para siempre.
 *
 * @param {number} payrollId
 * @param {string} userId  Limita la búsqueda a un colaborador.
 * @param {() => void} onAplicado
 * @param {() => void} onCancelar
 */
const PayrollPendingPicker = ({ payrollId, userId, onAplicado, onCancelar }) => {
  const [datos, setDatos] = useState({ extras: [], absences: [] });
  const [cargando, setCargando] = useState(true);
  const [aplicando, setAplicando] = useState(false);
  const [extrasSel, setExtrasSel] = useState(() => new Set());
  const [ausenciasSel, setAusenciasSel] = useState(() => new Set());

  const cargar = useCallback(async () => {
    setCargando(true);
    try {
      const resp = await payrollApi.getPendingOutside(payrollId, userId);
      setDatos({
        extras: resp?.data?.extras ?? [],
        absences: resp?.data?.absences ?? [],
      });
    } catch (error) {
      console.error(error);
      toast.error(mensajeDeError(error, 'No se pudieron cargar los pendientes.'));
      setDatos({ extras: [], absences: [] });
    } finally {
      setCargando(false);
    }
  }, [payrollId, userId]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const alternar = (conjunto, setter) => (id) => {
    const siguiente = new Set(conjunto);
    if (siguiente.has(id)) siguiente.delete(id);
    else siguiente.add(id);
    setter(siguiente);
  };

  const total =
    datos.extras
      .filter((e) => extrasSel.has(e.extraId))
      .reduce((t, e) => t + (e.amount ?? 0), 0) -
    datos.absences
      .filter((a) => ausenciasSel.has(a.absenceId))
      .reduce((t, a) => t + (a.amount ?? 0), 0);

  const seleccionados = extrasSel.size + ausenciasSel.size;

  const aplicar = async () => {
    setAplicando(true);

    try {
      await payrollApi.attachItems(payrollId, {
        extraIds: [...extrasSel],
        absenceIds: [...ausenciasSel],
      });

      toast.success(
        `${seleccionados} registro${seleccionados === 1 ? '' : 's'} agregado${seleccionados === 1 ? '' : 's'} a la planilla`
      );
      onAplicado?.();
    } catch (error) {
      console.error(error);
      toast.error(mensajeDeError(error, 'No se pudieron agregar los registros.'));
    } finally {
      setAplicando(false);
    }
  };

  if (cargando) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-12 animate-pulse rounded-lg bg-surface-alt" />
        ))}
      </div>
    );
  }

  const vacio = datos.extras.length === 0 && datos.absences.length === 0;

  if (vacio) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-stroke bg-surface-alt py-10 text-ink-muted">
          <Inbox size={26} />
          <p className="text-sm font-medium">Nada pendiente de otros periodos</p>
          <p className="text-center text-xs">
            Todas las horas extra y ausencias aprobadas de este colaborador ya
            están liquidadas o caen dentro de este periodo.
          </p>
        </div>

        <div className="flex justify-end">
          <SecondaryButton onClick={onCancelar}>Cerrar</SecondaryButton>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-start gap-2 rounded-lg bg-surface-alt p-3 text-xs text-ink-muted">
        <CalendarClock size={14} className="mt-0.5 shrink-0" />
        Registros aprobados de fuera de este periodo que ninguna planilla ha
        liquidado. Al agregarlos quedan atados a esta planilla.
      </div>

      {datos.extras.length > 0 && (
        <section>
          <h3 className="mb-1 text-xs font-bold uppercase tracking-widest text-brand">
            Horas extra pendientes
          </h3>
          <ul>
            {datos.extras.map((e) => (
              <Opcion
                key={e.extraId}
                marcada={extrasSel.has(e.extraId)}
                onToggle={() => alternar(extrasSel, setExtrasSel)(e.extraId)}
                titulo={e.extraTypeName || 'Hora extra'}
                subtitulo={`${formatFecha(e.start)} · ${(e.hours ?? 0).toFixed(2)} h · recargo ×${e.factor}`}
                monto={formatMoney(e.amount)}
                tono="text-green-700"
              />
            ))}
          </ul>
        </section>
      )}

      {datos.absences.length > 0 && (
        <section>
          <h3 className="mb-1 text-xs font-bold uppercase tracking-widest text-brand">
            Rebajos pendientes
          </h3>
          <ul>
            {datos.absences.map((a) => (
              <Opcion
                key={a.absenceId}
                marcada={ausenciasSel.has(a.absenceId)}
                onToggle={() =>
                  alternar(ausenciasSel, setAusenciasSel)(a.absenceId)
                }
                titulo={a.title || 'Ausencia'}
                subtitulo={`${formatFecha(a.startDate)} · ${((a.hours ?? 0) / 8).toFixed(2)} d`}
                monto={`- ${formatMoney(a.amount)}`}
                tono="text-red-600"
              />
            ))}
          </ul>
        </section>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-stroke-soft pt-4">
        <p className="text-sm">
          <span className="text-ink-muted">
            {seleccionados} seleccionado{seleccionados === 1 ? '' : 's'} ·{' '}
          </span>
          <span className="font-bold text-ink">{formatMoney(total)}</span>
        </p>

        <div className="flex gap-3">
          <SecondaryButton onClick={onCancelar} disabled={aplicando}>
            Cancelar
          </SecondaryButton>

          <PrimaryButton
            onClick={aplicar}
            disabled={aplicando || seleccionados === 0}
          >
            {aplicando && <Loader2 size={15} className="animate-spin" />}
            Agregar a la planilla
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
};

export default PayrollPendingPicker;
