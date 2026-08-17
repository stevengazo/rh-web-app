import { Calendar, Check, ChevronRight, X } from 'lucide-react';
import ActionStatusBadge, {
  ACTION_STATUS,
  bordeDeEstado,
  estadoDeAccion,
} from './molecules/ActionStatusBadge';

const getInitials = (first = '', last = '') => {
  const a = first?.trim?.()[0] ?? '';
  const b = last?.trim?.()[0] ?? '';
  return (a + b).toUpperCase() || '—';
};

const nombreDe = (user) =>
  [user?.firstName, user?.lastName].filter(Boolean).join(' ').trim() ||
  user?.userName ||
  user?.email ||
  'Sin nombre';

/**
 * Tarjeta de una acción de personal.
 *
 * @param {object} action
 * @param {() => void} OnHandleClick   Abre el detalle.
 * @param {(a: object) => void} [onApprove]
 * @param {(a: object) => void} [onReject]
 */
const CardAction = ({ action, OnHandleClick, onApprove, onReject }) => {
  const estado = estadoDeAccion(action);
  const pendiente = estado === ACTION_STATUS.PENDING;

  return (
    <div
      onClick={OnHandleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          OnHandleClick?.();
        }
      }}
      role="button"
      tabIndex={0}
      className={`group flex cursor-pointer flex-col rounded-xl border border-stroke-soft bg-surface p-4 shadow-sm
        border-l-4 ${bordeDeEstado(estado)}
        transition-all hover:border-brand hover:shadow-md
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-1`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-tint text-sm font-semibold text-brand">
            {getInitials(action.user?.firstName, action.user?.lastName)}
          </div>

          <div className="min-w-0">
            <p className="truncate font-semibold text-ink">
              {nombreDe(action.user)}
            </p>
            <p className="truncate text-sm text-ink-muted">
              {action.actionType?.name || 'Sin tipo'}
            </p>
          </div>
        </div>

        <ActionStatusBadge status={estado} />
      </div>

      {action.description && (
        <p className="mt-3 line-clamp-2 text-sm text-ink-secondary">
          {action.description}
        </p>
      )}

      {estado === ACTION_STATUS.REJECTED && action.rejectionReason && (
        <p className="mt-2 rounded-md bg-red-50 px-2.5 py-1.5 text-xs text-red-700">
          <span className="font-semibold">Motivo:</span>{' '}
          {action.rejectionReason}
        </p>
      )}

      <div className="mt-3 flex items-center justify-between gap-2">
        <p className="flex items-center gap-1.5 text-xs text-ink-muted">
          <Calendar size={14} />
          {action.actionDate
            ? new Date(action.actionDate).toLocaleDateString('es-CR')
            : '—'}
        </p>

        <span className="flex items-center gap-1 text-xs font-medium text-brand opacity-0 transition-opacity group-hover:opacity-100">
          Ver detalle
          <ChevronRight size={14} />
        </span>
      </div>

      {/* Aprobar / rechazar sin abrir el detalle */}
      {pendiente && (onApprove || onReject) && (
        <div
          className="mt-3 flex gap-2 border-t border-stroke-soft pt-3"
          onClick={(e) => e.stopPropagation()}
        >
          {onApprove && (
            <button
              type="button"
              onClick={() => onApprove(action)}
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md
                         bg-green-600 px-3 py-1.5 text-xs font-semibold text-white
                         transition-colors hover:bg-green-700
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600"
            >
              <Check size={14} />
              Aprobar
            </button>
          )}

          {onReject && (
            <button
              type="button"
              onClick={() => onReject(action)}
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md
                         border border-stroke bg-surface px-3 py-1.5 text-xs font-semibold text-ink-secondary
                         transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-600
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
            >
              <X size={14} />
              Rechazar
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default CardAction;
