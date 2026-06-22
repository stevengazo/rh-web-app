import { useEffect, useState } from 'react';
import SectionTitle from '../SectionTitle';
import Divider from '../Divider';
import PrimaryButton from '../PrimaryButton';

import actionApi from '../../api/actionApi';
import actionTypeApi from '../../api/actionTypeApi';
import toast from 'react-hot-toast';
import SecondaryButton from '../SecondaryButton';
import { useAppContext } from '../../context/AppContext';

const ViewAction = ({ action, onUpdated }) => {
  const { user } = useAppContext();
  if (!action) return null;

  const isApproved = !!action.approvedBy;

  const [editMode, setEditMode] = useState(false);
  const [types, setTypes] = useState([]);
  const [loadingApprove, setLoadingApprove] = useState(false);

  const [form, setForm] = useState({
    actionDate: action.actionDate?.split('T')[0],
    description: action.description ?? '',
    actionTypeId: action.actionTypeId,
  });

  /* =========================
     Load action types
     ========================= */
  useEffect(() => {
    const loadTypes = async () => {
      const res = await actionTypeApi.getAllActionTypes();
      setTypes(res.data);
    };
    loadTypes();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  /* =========================
     Update action
     ========================= */
  const handleSave = async () => {
    const payload = {
      ...action,
      actionDate: form.actionDate,
      description: form.description,
      actionTypeId: form.actionTypeId,
      user: null,
      actionType: null,
    };

    try {
      await actionApi.updateAction(payload.actionId, payload);
      toast.success('Acción actualizada');
      setEditMode(false);
      onUpdated?.();
    } catch (err) {
      toast.error('Error al actualizar');
    }
  };

  /* =========================
     Approve action
     ========================= */
  const handleApprove = async () => {
    try {
      setLoadingApprove(true);
      const payload = {
        ...action,
        approvedBy: user.email,
      };
      await actionApi.updateAction(action.actionId, payload);
      toast.success('Acción aprobada');
      onUpdated?.();
    } catch (err) {
      toast.error('Error al aprobar la acción');
    } finally {
      setLoadingApprove(false);
    }
  };

  return (
    <div className="space-y-6 text-ink">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <SectionTitle>
            {action.actionType?.name || 'Acción'}
          </SectionTitle>

          <p className="text-sm text-ink-muted mt-1">
            {action.user?.firstName} {action.user?.lastName}
          </p>
        </div>

        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide
          ${
            isApproved
              ? 'bg-green-50 text-green-700 border border-transparent'
              : 'bg-amber-50 text-amber-800 border border-transparent'
          }
        `}
        >
          {isApproved ? 'Aprobada' : 'Pendiente'}
        </span>
      </div>

      <Divider />

      {/* Info Card */}
      <div className="bg-surface-alt rounded-xl p-4 space-y-4 border border-stroke-soft">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          {/* Fecha */}
          <div>
            <p className="text-ink-muted text-xs uppercase tracking-wide mb-1">
              Fecha
            </p>

            {editMode ? (
              <input
                type="date"
                name="actionDate"
                value={form.actionDate}
                onChange={handleChange}
                className="w-full bg-surface border border-stroke text-ink rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-brand focus:border-brand focus:outline-none"
              />
            ) : (
              <p className="font-medium text-ink">
                {new Date(action.actionDate).toLocaleDateString()}
              </p>
            )}
          </div>

          {/* Tipo */}
          <div>
            <p className="text-ink-muted text-xs uppercase tracking-wide mb-1">
              Tipo de acción
            </p>

            {editMode ? (
              <select
                name="actionTypeId"
                value={form.actionTypeId}
                onChange={handleChange}
                className="w-full bg-surface border border-stroke text-ink rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-brand focus:border-brand focus:outline-none"
              >
                {types.map((t) => (
                  <option key={t.actionTypeId} value={t.actionTypeId}>
                    {t.name}
                  </option>
                ))}
              </select>
            ) : (
              <p className="font-medium text-ink">
                {action.actionType?.name}
              </p>
            )}
          </div>

          {/* Creado por */}
          <div>
            <p className="text-ink-muted text-xs uppercase tracking-wide mb-1">
              Creado por
            </p>
            <p className="font-medium text-ink">{action.createdBy}</p>
          </div>
        </div>
      </div>

      {/* Descripción */}
      <div className="bg-surface-alt rounded-xl p-4 border border-stroke-soft">
        <p className="text-ink-muted text-xs uppercase tracking-wide mb-2">
          Descripción
        </p>

        {editMode ? (
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            className="w-full bg-surface border border-stroke text-ink rounded-md p-3 text-sm focus:ring-2 focus:ring-brand focus:border-brand focus:outline-none resize-none"
          />
        ) : (
          <p className="text-sm text-ink leading-relaxed">
            {action.description || 'Sin descripción'}
          </p>
        )}
      </div>

      {/* Actions */}
      {!isApproved && (
        <div className="flex justify-end gap-3 pt-2">
          {editMode ? (
            <>
              <SecondaryButton onClick={() => setEditMode(false)}>
                Cancelar
              </SecondaryButton>

              <PrimaryButton onClick={handleSave}>
                Guardar cambios
              </PrimaryButton>
            </>
          ) : (
            <>
              <PrimaryButton onClick={() => setEditMode(true)}>
                Editar
              </PrimaryButton>

              <SecondaryButton
                onClick={handleApprove}
                disabled={loadingApprove}
                className="bg-green-600 hover:bg-green-700 text-white border-transparent"
              >
                {loadingApprove ? 'Aprobando...' : 'Aprobar'}
              </SecondaryButton>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ViewAction;
