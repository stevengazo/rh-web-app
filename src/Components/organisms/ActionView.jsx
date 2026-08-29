import { Briefcase, Check, RotateCcw, X } from 'lucide-react';

import Divider from '../Divider';
import SecondaryButton from '../SecondaryButton';
import RecordAttachments from './RecordAttachments';
import ActionStatusBadge, {
  ACTION_STATUS,
  estadoDeAccion,
} from '../molecules/ActionStatusBadge';

const formatFecha = (valor) => {
  if (!valor || String(valor).startsWith('0001-01-01')) return '—';
  const f = new Date(valor);
  return Number.isNaN(f.getTime())
    ? '—'
    : f.toLocaleDateString('es-CR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });
};

const nombreDe = (user) =>
  [user?.firstName, user?.lastName].filter(Boolean).join(' ').trim() ||
  user?.userName ||
  user?.email ||
  null;

/** Dato de solo lectura. */
const Dato = ({ label, children, ancho }) => (
  <div className={ancho === 'completo' ? 'sm:col-span-2' : undefined}>
    <p className="mb-1 text-xs uppercase tracking-wide text-ink-muted">
      {label}
    </p>
    <div className="text-sm font-medium leading-relaxed text-ink">
      {children ?? '—'}
    </div>
  </div>
);

/**
 * Detalle de una acción de personal, con su flujo de aprobación.
 *
 * Antes se mostraba como una tabla «Campo | Valor» con el `actionId` y las
 * fechas de auditoría al mismo nivel que el contenido: lo importante —qué
 * movimiento es, sobre quién y en qué estado está— quedaba enterrado entre
 * metadatos. Ahora sigue el mismo patrón que ausencias y horas extra.
 *
 * @param {object} action
 * @param {(a: object) => void} [onApprove]
 * @param {(a: object) => void} [onReject]
 * @param {(a: object) => void} [onReopen]
 */
const ActionView = ({ action, onApprove, onReject, onReopen }) => {
  if (!action) {
    return (
      <p className="py-6 text-center text-ink-muted">
        No hay información de la acción.
      </p>
    );
  }

  const estado = estadoDeAccion(action);
  const pendiente = estado === ACTION_STATUS.PENDING;
  const hayRevision = onApprove || onReject || onReopen;

  return (
    <div className="space-y-5 text-ink">
      {/* Encabezado: qué acción es y en qué estado está */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-tint text-brand">
            <Briefcase size={18} />
          </span>

          <div className="min-w-0">
            <h2 className="truncate text-lg font-semibold text-ink">
              {action.actionType?.name || 'Acción de personal'}
            </h2>
            <p className="mt-0.5 text-sm text-ink-muted">
              {nombreDe(action.user) ?? formatFecha(action.actionDate)}
            </p>
          </div>
        </div>

        <ActionStatusBadge status={estado} />
      </div>

      {/* Motivo del rechazo: es lo primero que se busca al abrir una rechazada */}
      {estado === ACTION_STATUS.REJECTED && action.rejectionReason && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-red-700">
            Motivo del rechazo
          </p>
          <p className="mt-1 text-sm leading-relaxed text-red-700">
            {action.rejectionReason}
          </p>
        </div>
      )}

      <Divider />

      <div className="grid grid-cols-1 gap-4 rounded-xl border border-stroke-soft bg-surface-alt p-4 sm:grid-cols-2">
        <Dato label="Fecha de la acción">{formatFecha(action.actionDate)}</Dato>

        <Dato label="Tipo">{action.actionType?.name}</Dato>

        <Dato label="Descripción" ancho="completo">
          {action.description || 'Sin descripción'}
        </Dato>

        {estado === ACTION_STATUS.APPROVED && (
          <Dato label="Aprobada por">
            {action.approvedBy || '—'}
            {action.approvedDate && (
              <span className="ml-1 text-xs font-normal text-ink-muted">
                · {formatFecha(action.approvedDate)}
              </span>
            )}
          </Dato>
        )}

        {estado === ACTION_STATUS.REJECTED && (
          <Dato label="Rechazada por">
            {action.rejectedBy || '—'}
            {action.rejectedAt && (
              <span className="ml-1 text-xs font-normal text-ink-muted">
                · {formatFecha(action.rejectedAt)}
              </span>
            )}
          </Dato>
        )}
      </div>

      {/* Auditoría: importa, pero no compite con el contenido */}
      <p className="text-xs text-ink-muted">
        Registrada por{' '}
        <span className="font-medium text-ink-secondary">
          {action.createdBy || '—'}
        </span>{' '}
        el {formatFecha(action.createdDate)}
        {action.lastUpdatedBy && (
          <>
            {' · '}última edición de{' '}
            <span className="font-medium text-ink-secondary">
              {action.lastUpdatedBy}
            </span>{' '}
            el {formatFecha(action.lastUpdatedDate)}
          </>
        )}
        {action.actionId && <> · #{action.actionId}</>}
      </p>

      {/* Respaldos: una acción de personal casi siempre lleva documento firmado */}
      {action.actionId && (
        <RecordAttachments
          tabla="Action"
          referenciaId={action.actionId}
          titulo="Respaldos de la acción"
        />
      )}

      {hayRevision && (
        <div className="flex flex-wrap justify-end gap-3 border-t border-stroke-soft pt-4">
          {pendiente ? (
            <>
              {onReject && (
                <SecondaryButton onClick={() => onReject(action)}>
                  <X size={15} />
                  Rechazar
                </SecondaryButton>
              )}

              {onApprove && (
                <button
                  type="button"
                  onClick={() => onApprove(action)}
                  className="inline-flex h-8 items-center gap-2 rounded-md border border-transparent
                             bg-green-600 px-3 text-sm font-semibold text-white
                             transition-colors hover:bg-green-700"
                >
                  <Check size={15} />
                  Aprobar
                </button>
              )}
            </>
          ) : (
            onReopen && (
              <SecondaryButton onClick={() => onReopen(action)}>
                <RotateCcw size={15} />
                Volver a pendiente
              </SecondaryButton>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default ActionView;
