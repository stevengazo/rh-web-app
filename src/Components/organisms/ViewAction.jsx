import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Check, Pencil, RotateCcw, X } from 'lucide-react';

import SectionTitle from '../SectionTitle';
import Divider from '../Divider';
import PrimaryButton from '../PrimaryButton';
import SecondaryButton from '../SecondaryButton';
import ActionStatusBadge, {
  ACTION_STATUS,
  estadoDeAccion,
} from '../molecules/ActionStatusBadge';

import actionApi from '../../api/actionApi';
import actionTypeApi from '../../api/actionTypeApi';

const formatDate = (fecha) =>
  fecha ? new Date(fecha).toLocaleDateString('es-CR') : '—';

const nombreDe = (user) =>
  [user?.firstName, user?.lastName].filter(Boolean).join(' ').trim() ||
  user?.userName ||
  user?.email ||
  'Sin nombre';

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
 * Detalle de una acción de personal, con su edición y su aprobación.
 *
 * @param {object} action
 * @param {(a: object) => void} [onApprove]
 * @param {(a: object) => void} [onReject]
 * @param {(a: object) => void} [onReopen]
 * @param {() => void} [onUpdated]
 */
const ViewAction = ({ action, onApprove, onReject, onReopen, onUpdated }) => {
  /* Los hooks van antes de cualquier return: la versión anterior hacía
     `if (!action) return null` arriba y los declaraba después, lo que rompe
     las reglas de hooks en cuanto `action` cambia a nulo. */
  const [editMode, setEditMode] = useState(false);
  const [types, setTypes] = useState([]);
  const [guardando, setGuardando] = useState(false);

  const [form, setForm] = useState({
    actionDate: action?.actionDate?.split('T')[0] ?? '',
    description: action?.description ?? '',
    actionTypeId: action?.actionTypeId ?? '',
  });

  useEffect(() => {
    const loadTypes = async () => {
      try {
        const res = await actionTypeApi.getAllActionTypes();
        setTypes(res?.data ?? []);
      } catch (error) {
        console.error('Error cargando tipos de acción:', error);
      }
    };

    if (editMode && types.length === 0) loadTypes();
  }, [editMode, types.length]);

  if (!action) return null;

  const estado = estadoDeAccion(action);
  const pendiente = estado === ACTION_STATUS.PENDING;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setGuardando(true);

    try {
      await actionApi.updateAction(action.actionId, {
        ...action,
        actionDate: form.actionDate,
        description: form.description,
        actionTypeId: Number(form.actionTypeId) || null,
        // Las navegaciones no se reenvían: el backend solo espera escalares.
        user: null,
        actionType: null,
      });

      toast.success('Acción actualizada');
      setEditMode(false);
      onUpdated?.();
    } catch (error) {
      console.error(error);
      toast.error('Error al actualizar la acción');
    } finally {
      setGuardando(false);
    }
  };

  const inputClase =
    'w-full rounded-md border border-stroke bg-surface px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand';

  return (
    <div className="space-y-6 text-ink">
      {/* Encabezado */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <SectionTitle className="mb-0">
            {action.actionType?.name || 'Acción'}
          </SectionTitle>
          <p className="mt-1 text-sm text-ink-muted">
            {nombreDe(action.user)}
          </p>
        </div>

        <ActionStatusBadge status={estado} />
      </div>

      <Divider />

      {/* Datos */}
      <div className="space-y-4 rounded-xl border border-stroke-soft bg-surface-alt p-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Dato label="Fecha">
            {editMode ? (
              <input
                type="date"
                name="actionDate"
                value={form.actionDate}
                onChange={handleChange}
                className={inputClase}
              />
            ) : (
              formatDate(action.actionDate)
            )}
          </Dato>

          <Dato label="Tipo de acción">
            {editMode ? (
              <select
                name="actionTypeId"
                value={form.actionTypeId}
                onChange={handleChange}
                className={inputClase}
              >
                <option value="">Seleccione…</option>
                {types.map((t) => (
                  <option key={t.actionTypeId} value={t.actionTypeId}>
                    {t.name}
                  </option>
                ))}
              </select>
            ) : (
              (action.actionType?.name ?? '—')
            )}
          </Dato>

          <Dato label="Creado por">
            {action.createdBy || '—'}
            {action.createdDate && (
              <span className="ml-1 text-xs font-normal text-ink-muted">
                · {formatDate(action.createdDate)}
              </span>
            )}
          </Dato>

          {estado === ACTION_STATUS.APPROVED && (
            <Dato label="Aprobada por">
              {action.approvedBy || '—'}
              {action.approvedDate && (
                <span className="ml-1 text-xs font-normal text-ink-muted">
                  · {formatDate(action.approvedDate)}
                </span>
              )}
            </Dato>
          )}

          {estado === ACTION_STATUS.REJECTED && (
            <Dato label="Rechazada por">
              {action.rejectedBy || '—'}
              {action.rejectedDate && (
                <span className="ml-1 text-xs font-normal text-ink-muted">
                  · {formatDate(action.rejectedDate)}
                </span>
              )}
            </Dato>
          )}
        </div>
      </div>

      {/* Motivo de rechazo */}
      {estado === ACTION_STATUS.REJECTED && action.rejectionReason && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="mb-1 text-xs uppercase tracking-wide text-red-700">
            Motivo del rechazo
          </p>
          <p className="text-sm text-red-800">{action.rejectionReason}</p>
        </div>
      )}

      {/* Descripción */}
      <div className="rounded-xl border border-stroke-soft bg-surface-alt p-4">
        <p className="mb-2 text-xs uppercase tracking-wide text-ink-muted">
          Descripción
        </p>

        {editMode ? (
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            className={`${inputClase} resize-none`}
          />
        ) : (
          <p className="text-sm leading-relaxed text-ink">
            {action.description || 'Sin descripción'}
          </p>
        )}
      </div>

      {/* Acciones */}
      <div className="flex flex-wrap justify-end gap-3 pt-2">
        {editMode ? (
          <>
            <SecondaryButton
              onClick={() => setEditMode(false)}
              disabled={guardando}
            >
              Cancelar
            </SecondaryButton>
            <PrimaryButton onClick={handleSave} disabled={guardando}>
              {guardando ? 'Guardando…' : 'Guardar cambios'}
            </PrimaryButton>
          </>
        ) : (
          <>
            {pendiente && (
              <SecondaryButton onClick={() => setEditMode(true)}>
                <Pencil size={15} />
                Editar
              </SecondaryButton>
            )}

            {!pendiente && onReopen && (
              <SecondaryButton onClick={() => onReopen(action)}>
                <RotateCcw size={15} />
                Volver a pendiente
              </SecondaryButton>
            )}

            {pendiente && onReject && (
              <button
                type="button"
                onClick={() => onReject(action)}
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
                onClick={() => onApprove(action)}
                className="inline-flex h-8 items-center justify-center gap-2 rounded-md border border-transparent
                           bg-green-600 px-3 text-sm font-semibold text-white transition-colors
                           hover:bg-green-700 active:bg-green-800
                           focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-1"
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

export default ViewAction;
