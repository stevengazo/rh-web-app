import { Calendar, ChevronRight } from 'lucide-react';

const getInitials = (first = '', last = '') => {
  const a = first?.trim?.()[0] ?? '';
  const b = last?.trim?.()[0] ?? '';
  return (a + b).toUpperCase() || '—';
};

const CardAction = ({ action, status, OnHandleClick }) => {
  const isPending = status === 'pending';

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
      className={`group cursor-pointer rounded-xl border border-stroke-soft bg-surface p-4 shadow-sm
        border-l-4 ${isPending ? 'border-l-amber-400' : 'border-l-green-500'}
        transition-all hover:shadow-md hover:border-brand
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-1`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {/* Avatar con iniciales */}
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-tint text-sm font-semibold text-brand">
            {getInitials(action.user?.firstName, action.user?.lastName)}
          </div>
          <div className="min-w-0">
            <p className="truncate font-semibold text-ink">
              {action.user?.firstName} {action.user?.lastName}
            </p>
            <p className="truncate text-sm text-ink-muted">
              {action.actionType?.name || 'Sin tipo'}
            </p>
          </div>
        </div>

        <span
          className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold
          ${isPending ? 'bg-amber-50 text-amber-800' : 'bg-green-50 text-green-700'}`}
        >
          {isPending ? 'Pendiente' : 'Aprobada'}
        </span>
      </div>

      {action.description && (
        <p className="mt-3 line-clamp-2 text-sm text-ink-secondary">
          {action.description}
        </p>
      )}

      <div className="mt-3 flex items-center justify-between">
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
    </div>
  );
};

export default CardAction;
