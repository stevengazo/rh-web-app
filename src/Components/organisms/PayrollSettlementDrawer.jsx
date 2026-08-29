import { useState } from 'react';
import toast from 'react-hot-toast';
import {
  Calculator,
  CalendarDays,
  CalendarClock,
  Clock,
  Info,
  Link2Off,
  MinusCircle,
  PlusCircle,
  Sparkles,
  Unlink,
} from 'lucide-react';

import Divider from '../Divider';
import PrimaryButton from '../PrimaryButton';
import SecondaryButton from '../SecondaryButton';
import PayrollQuickAdd from './PayrollQuickAdd';
import PayrollPendingPicker from './PayrollPendingPicker';
import payrollApi from '../../api/payrollApi';
import { formatMoney } from '../../utils/formatMoney';
import { mensajeDeError } from '../../utils/apiError';

const formatFechaHora = (valor) => {
  if (!valor) return '—';
  const f = new Date(valor);
  return Number.isNaN(f.getTime())
    ? '—'
    : f.toLocaleString('es-CR', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      });
};

const formatFecha = (valor) => {
  if (!valor) return '—';
  const f = new Date(valor);
  return Number.isNaN(f.getTime())
    ? '—'
    : f.toLocaleDateString('es-CR', { day: '2-digit', month: 'short' });
};

const horas = (n) => `${(Number(n) || 0).toFixed(2)} h`;

/** Una línea del detalle. */
const Renglon = ({
  titulo,
  subtitulo,
  cantidad,
  monto,
  tono,
  onQuitar,
  quitando,
}) => (
  <li className="flex items-start gap-3 border-b border-stroke-soft py-2.5 last:border-0">
    <span className="min-w-0 flex-1">
      <span className="block truncate text-sm font-medium text-ink">
        {titulo}
      </span>
      <span className="block text-xs text-ink-muted">{subtitulo}</span>
    </span>

    <span className="shrink-0 text-right">
      <span className="block text-sm font-medium text-ink">{cantidad}</span>
      <span className={`block text-xs font-semibold ${tono}`}>{monto}</span>
    </span>

    {/* Solo se puede soltar lo que esta planilla tomó explícitamente. */}
    {onQuitar && (
      <button
        type="button"
        onClick={onQuitar}
        disabled={quitando}
        title="Quitar de esta planilla"
        aria-label="Quitar de esta planilla"
        className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-md
                   text-ink-muted transition-colors hover:bg-red-50 hover:text-red-600
                   disabled:opacity-40"
      >
        <Unlink size={14} />
      </button>
    )}
  </li>
);

/** Las tres formas de meter algo en la planilla. */
const Acciones = ({ onModo }) => (
  <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
    {[
      {
        id: 'extra',
        icon: PlusCircle,
        label: 'Hora extra',
        clase: 'hover:border-green-300 hover:text-green-700',
      },
      {
        id: 'rebajo',
        icon: MinusCircle,
        label: 'Rebajo',
        clase: 'hover:border-red-300 hover:text-red-600',
      },
      {
        id: 'pendientes',
        icon: CalendarClock,
        label: 'De otro periodo',
        clase: 'hover:border-brand hover:text-brand',
      },
    ].map(({ id, icon: Icono, label, clase }) => (
      <button
        key={id}
        type="button"
        onClick={() => onModo(id)}
        className={`flex items-center justify-center gap-1.5 rounded-lg border border-stroke
                    bg-surface px-3 py-2 text-xs font-semibold text-ink-secondary
                    transition-colors ${clase}`}
      >
        <Icono size={14} />
        {label}
      </button>
    ))}
  </div>
);

/** Bloque de una categoría (extras, extras de feriado, ausencias). */
const Grupo = ({ icon: Icon, titulo, vacio, children, total, tono }) => (
  <section>
    <div className="mb-1 flex items-center justify-between gap-2">
      <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand">
        <Icon size={14} />
        {titulo}
      </h3>
      {total && (
        <span className={`text-sm font-bold ${tono}`}>{total}</span>
      )}
    </div>

    {vacio ? (
      <p className="py-2 text-sm text-ink-muted">Sin registros en el periodo.</p>
    ) : (
      <ul>{children}</ul>
    )}
  </section>
);

/**
 * Detalle de lo que la planilla va a liquidarle a un colaborador.
 *
 * Muestra una por una las horas extra aprobadas y las ausencias del periodo
 * que ninguna otra planilla pagó, con el monto con el que se aprobó cada una,
 * y permite aplicar ese cálculo a la fila o desvincularse para capturarlo a
 * mano.
 *
 * Los montos **no se recalculan**: una hora extra se paga como se aprobó,
 * aunque el salario haya cambiado después.
 *
 * @param {object} empleado
 * @param {object} liquidables  Cubo de `agruparLiquidables` para este usuario.
 * @param {boolean} desdeRegistros ¿La fila está tomando estas cifras?
 * @param {(desdeRegistros: boolean) => void} onCambiarOrigen
 * @param {() => void} onClose
 */
const PayrollSettlementDrawer = ({
  empleado,
  liquidables,
  desdeRegistros,
  onCambiarOrigen,
  onClose,
  payrollId,
  periodo,
  autor,
  readOnly = false,
  onCambios,
}) => {
  /* 'detalle' | 'extra' | 'rebajo' | 'pendientes' */
  const [modo, setModo] = useState('detalle');
  const [soltando, setSoltando] = useState(null);

  const datos = liquidables;

  const recargar = () => {
    setModo('detalle');
    onCambios?.();
  };

  /** Suelta un registro: vuelve a quedar pendiente para otra planilla. */
  const soltar = async (tipo, id) => {
    setSoltando(id);

    try {
      await payrollApi.detachItems(payrollId, {
        extraIds: tipo === 'extra' ? [id] : [],
        absenceIds: tipo === 'ausencia' ? [id] : [],
      });
      toast.success('Registro quitado de la planilla');
      onCambios?.();
    } catch (error) {
      console.error(error);
      toast.error(mensajeDeError(error, 'No se pudo quitar el registro.'));
    } finally {
      setSoltando(null);
    }
  };

  /* Los formularios y el selector reemplazan al detalle mientras están
     abiertos: el panel es estrecho y apilarlos lo volvería ilegible. */
  if (modo === 'extra' || modo === 'rebajo') {
    return (
      <PayrollQuickAdd
        tipo={modo}
        userId={empleado?.id}
        periodo={periodo}
        payrollId={payrollId}
        autor={autor}
        onCreado={recargar}
        onCancelar={() => setModo('detalle')}
      />
    );
  }

  if (modo === 'pendientes') {
    return (
      <PayrollPendingPicker
        payrollId={payrollId}
        userId={empleado?.id}
        onAplicado={recargar}
        onCancelar={() => setModo('detalle')}
      />
    );
  }

  /* Sin registros el panel sigue siendo útil: es desde donde se agregan. */
  if (!datos) {
    return (
      <div className="space-y-5">
        <div className="flex flex-col items-center gap-2 py-10 text-ink-muted">
          <Calculator size={28} />
          <p className="text-sm font-medium">Nada que liquidar</p>
          <p className="text-center text-xs">
            Este colaborador no tiene horas extra aprobadas ni ausencias dentro
            del periodo de la planilla.
          </p>
        </div>

        {!readOnly && <Acciones onModo={setModo} />}
      </div>
    );
  }

  const totalSuma = datos.montoExtra + datos.montoExtraFeriado;
  const efecto = totalSuma - datos.montoAusencia;

  const nombre =
    [empleado?.firstName, empleado?.lastName].filter(Boolean).join(' ').trim() ||
    'Colaborador';

  return (
    <div className="space-y-5 text-ink">
      <div>
        <h2 className="text-lg font-semibold text-ink">{nombre}</h2>
        <p className="mt-0.5 text-sm text-ink-muted">
          Horas extra y ausencias que esta planilla liquidaría.
        </p>
      </div>

      {/* Efecto neto: es la cifra por la que se abre este panel. */}
      <div className="rounded-xl border border-stroke-soft bg-surface-alt p-4">
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="text-xs uppercase tracking-wide text-ink-muted">
              Suma
            </p>
            <p className="mt-1 text-sm font-bold text-green-700">
              {formatMoney(totalSuma)}
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide text-ink-muted">
              Rebaja
            </p>
            <p className="mt-1 text-sm font-bold text-red-600">
              {datos.montoAusencia > 0
                ? `- ${formatMoney(datos.montoAusencia)}`
                : formatMoney(0)}
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide text-ink-muted">
              Efecto neto
            </p>
            <p className="mt-1 text-base font-bold text-ink">
              {formatMoney(efecto)}
            </p>
          </div>
        </div>
      </div>

      <Divider />

      <Grupo
        icon={Clock}
        titulo="Horas extra"
        vacio={datos.extras.length === 0}
        total={
          datos.extras.length > 0
            ? `${horas(datos.horasExtra)} · ${formatMoney(datos.montoExtra)}`
            : null
        }
        tono="text-green-700"
      >
        {datos.extras.map((e) => (
          <Renglon
            key={e.extraId}
            titulo={e.extraTypeName || 'Hora extra'}
            subtitulo={`${formatFechaHora(e.start)} → ${formatFechaHora(e.end)} · recargo ×${e.factor}`}
            cantidad={horas(e.hours)}
            monto={formatMoney(e.amount)}
            tono="text-green-700"
            onQuitar={
              readOnly || !e.payrollId ? undefined : () => soltar('extra', e.extraId)
            }
            quitando={soltando === e.extraId}
          />
        ))}
      </Grupo>

      <Grupo
        icon={Sparkles}
        titulo="Extras en feriado"
        vacio={datos.extrasFeriado.length === 0}
        total={
          datos.extrasFeriado.length > 0
            ? `${horas(datos.horasExtraFeriado)} · ${formatMoney(datos.montoExtraFeriado)}`
            : null
        }
        tono="text-green-700"
      >
        {datos.extrasFeriado.map((e) => (
          <Renglon
            key={e.extraId}
            titulo={e.extraTypeName || 'Extra en feriado'}
            subtitulo={`${formatFechaHora(e.start)} → ${formatFechaHora(e.end)} · recargo ×${e.factor}`}
            cantidad={horas(e.hours)}
            monto={formatMoney(e.amount)}
            tono="text-green-700"
            onQuitar={
              readOnly || !e.payrollId ? undefined : () => soltar('extra', e.extraId)
            }
            quitando={soltando === e.extraId}
          />
        ))}
      </Grupo>

      <Grupo
        icon={CalendarDays}
        titulo="Ausencias a rebajar"
        vacio={datos.ausencias.length === 0}
        total={
          datos.ausencias.length > 0
            ? `${datos.diasAusencia} d · ${formatMoney(datos.montoAusencia)}`
            : null
        }
        tono="text-red-600"
      >
        {datos.ausencias.map((a) => (
          <Renglon
            key={a.absenceId}
            titulo={a.title || 'Ausencia'}
            subtitulo={`${formatFecha(a.startDate)} → ${formatFecha(a.endDate)} · ${horas(a.hours)}`}
            cantidad={`${(a.hours / 8).toFixed(2)} d`}
            monto={`- ${formatMoney(a.amount)}`}
            tono="text-red-600"
            onQuitar={
              readOnly || !a.payrollId
                ? undefined
                : () => soltar('ausencia', a.absenceId)
            }
            quitando={soltando === a.absenceId}
          />
        ))}
      </Grupo>

      {!readOnly && <Acciones onModo={setModo} />}

      <p className="flex items-start gap-2 rounded-lg bg-surface-alt p-3 text-xs text-ink-muted">
        <Info size={14} className="mt-0.5 shrink-0" />
        Cada monto es el que se aprobó en su momento; no se recalcula con el
        salario actual. Al aprobar la planilla, estos registros quedan marcados
        como pagados y ninguna otra planilla podrá tomarlos.
      </p>

      <div className="flex flex-wrap justify-end gap-3 border-t border-stroke-soft pt-4">
        {desdeRegistros ? (
          <>
            <SecondaryButton onClick={() => onCambiarOrigen(false)}>
              <Link2Off size={15} />
              Capturar a mano
            </SecondaryButton>

            <PrimaryButton onClick={onClose}>Cerrar</PrimaryButton>
          </>
        ) : (
          <>
            <SecondaryButton onClick={onClose}>Cancelar</SecondaryButton>

            <PrimaryButton onClick={() => onCambiarOrigen(true)}>
              <Calculator size={15} />
              Aplicar cálculo
            </PrimaryButton>
          </>
        )}
      </div>
    </div>
  );
};

export default PayrollSettlementDrawer;
