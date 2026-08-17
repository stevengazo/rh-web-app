import { Check, RotateCcw, X } from 'lucide-react';
import Divider from '../Divider';
import SecondaryButton from '../SecondaryButton';
import ReviewStatusBadge from '../molecules/ReviewStatusBadge';
import { ABSENCE_STATUS, diasDeAusencia, estadoDeAusencia } from '../../hooks/useAbsences';

const formatDate = (fecha) =>
  fecha ? new Date(fecha).toLocaleDateString('es-CR') : '—';

const nombreDe = (user) =>
  [user?.firstName, user?.lastName].filter(Boolean).join(' ').trim() ||
  user?.userName ||
  user?.email ||
  'Sin nombre';

const Dato = ({ label, children }) => (
  <div>
    <p className="mb-1 text-xs uppercase tracking-wide text-ink-muted">
      {label}
    </p>
    <div className="text-sm font-medium text-ink">{children}</div>
  </div>
);

/**
 * Detalle de una ausencia con sus acciones de aprobación.
 *
 * @param {object} absence
 * @param {(a: object) => void} [onApprove]
 * @param {(a: object) => void} [onReject]
 * @param {(a: object) => void} [onReopen]
 */
const AbsenceView = ({ absence, onApprove, onReject, onReopen }) => {
  if (!absence) return null;

  const estado = estadoDeAusencia(absence);
  const pendiente = estado === ABSENCE_STATUS.PENDING;
  const dias = diasDeAusencia(absence);

  return (
    <div className="space-y-5 text-ink">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="truncate text-lg font-semibold text-ink">
            {absence.title || 'Ausencia'}
          </h2>
          <p className="mt-0.5 text-sm text-ink-muted">
            {nombreDe(absence.user)}
          </p>
        </div>

        <ReviewStatusBadge status={estado} />
      </div>

      <Divider />

      <div className="grid grid-cols-1 gap-4 rounded-xl border border-stroke-soft bg-surface-alt p-4 sm:grid-cols-2">
        <Dato label="Desde">{formatDate(absence.startDate)}</Dato>
        <Dato label="Hasta">{formatDate(absence.endDate)}</Dato>

        <Dato label="Duración">
          {dias} día{dias === 1 ? '' : 's'}
        </Dato>

        <Dato label="Justificada">
          {absence.justified ? 'Sí' : 'No'}
        </Dato>

        <Dato label="Registrada por">
          {absence.createdBy || '—'}
          {absence.createdAt && (
            <span className="ml-1 text-xs font-normal text-ink-muted">
              · {formatDate(absence.createdAt)}
            </span>
          )}
        </Dato>

        {estado === ABSENCE_STATUS.APPROVED && (
          <Dato label="Aprobada por">
            {absence.approvedBy || '—'}
            {absence.approvedAt && (
              <span className="ml-1 text-xs font-normal text-ink-muted">
                · {formatDate(absence.approvedAt)}
              </span>
            )}
          </Dato>
        )}

        {estado === ABSENCE_STATUS.REJECTED && (
          <Dato label="Rechazada por">
            {absence.rejectedBy || '—'}
            {absence.rejectedAt && (
              <span className="ml-1 text-xs font-normal text-ink-muted">
                · {formatDate(absence.rejectedAt)}
              </span>
            )}
          </Dato>
        )}
      </div>

      {estado === ABSENCE_STATUS.REJECTED && absence.rejectionReason && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="mb-1 text-xs uppercase tracking-wide text-red-700">
            Motivo del rechazo
          </p>
          <p className="text-sm text-red-800">{absence.rejectionReason}</p>
        </div>
      )}

      <div className="rounded-xl border border-stroke-soft bg-surface-alt p-4">
        <p className="mb-2 text-xs uppercase tracking-wide text-ink-muted">
          Motivo
        </p>
        <p className="text-sm leading-relaxed text-ink">
          {absence.reason || 'Sin motivo indicado'}
        </p>
      </div>

      <div className="flex flex-wrap justify-end gap-3 pt-1">
        {!pendiente && onReopen && (
          <SecondaryButton onClick={() => onReopen(absence)}>
            <RotateCcw size={15} />
            Volver a pendiente
          </SecondaryButton>
        )}

        {pendiente && onReject && (
          <button
            type="button"
            onClick={() => onReject(absence)}
            className="inline-flex h-8 items-center justify-center gap-2 rounded-md border border-stroke
                       bg-surface px-3 text-sm font-semibold text-ink-secondary transition-colors
                       hover:border-red-300 hover:bg-red-50 hover:text-red-600
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
          >
            <X size={15} />
            Rechazar
          </button>
        )}

        {pendiente && onApprove && (
          <button
            type="button"
            onClick={() => onApprove(absence)}
            className="inline-flex h-8 items-center justify-center gap-2 rounded-md border border-transparent
                       bg-green-600 px-3 text-sm font-semibold text-white transition-colors
                       hover:bg-green-700 active:bg-green-800
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-1"
          >
            <Check size={15} />
            Aprobar
          </button>
        )}
      </div>
    </div>
  );
};

export default AbsenceView;
