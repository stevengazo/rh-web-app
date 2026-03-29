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
    <div className="space-y-6 text-gray-200">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <SectionTitle className="text-white">
            {action.actionType?.name || 'Acción'}
          </SectionTitle>

          <p className="text-sm text-gray-400 mt-1">
            {action.user?.firstName} {action.user?.lastName}
          </p>
        </div>

        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide
          ${
            isApproved
              ? 'bg-green-600/20 text-green-400 border border-green-500/30'
              : 'bg-yellow-600/20 text-yellow-400 border border-yellow-500/30'
          }
        `}
        >
          {isApproved ? 'Aprobada' : 'Pendiente'}
        </span>
      </div>

      <Divider />

      {/* Info Card */}
      <div className="bg-gray-700/60 rounded-xl p-4 space-y-4 border border-gray-600">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          {/* Fecha */}
          <div>
            <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">
              Fecha
            </p>

            {editMode ? (
              <input
                type="date"
                name="actionDate"
                value={form.actionDate}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            ) : (
              <p className="font-medium text-gray-100">
                {new Date(action.actionDate).toLocaleDateString()}
              </p>
            )}
          </div>

          {/* Tipo */}
          <div>
            <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">
              Tipo de acción
            </p>

            {editMode ? (
              <select
                name="actionTypeId"
                value={form.actionTypeId}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                {types.map((t) => (
                  <option key={t.actionTypeId} value={t.actionTypeId}>
                    {t.name}
                  </option>
                ))}
              </select>
            ) : (
              <p className="font-medium text-gray-100">
                {action.actionType?.name}
              </p>
            )}
          </div>

          {/* Creado por */}
          <div>
            <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">
              Creado por
            </p>
            <p className="font-medium text-gray-100">{action.createdBy}</p>
          </div>
        </div>
      </div>

      {/* Descripción */}
      <div className="bg-gray-700/60 rounded-xl p-4 border border-gray-600">
        <p className="text-gray-400 text-xs uppercase tracking-wide mb-2">
          Descripción
        </p>

        {editMode ? (
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
          />
        ) : (
          <p className="text-sm text-gray-100 leading-relaxed">
            {action.description || 'Sin descripción'}
          </p>
        )}
      </div>

      {/* Actions */}
      {!isApproved && (
        <div className="flex justify-end gap-3 pt-2">
          {editMode ? (
            <>
              <button
                onClick={() => setEditMode(false)}
                className="px-4 py-2 text-sm rounded-lg border border-gray-600 hover:bg-gray-700 transition"
              >
                Cancelar
              </button>

              <PrimaryButton
                onClick={handleSave}
                className="px-5 py-2 rounded-lg"
              >
                Guardar cambios
              </PrimaryButton>
            </>
          ) : (
            <>
              <PrimaryButton
                onClick={() => setEditMode(true)}
                className="px-5 py-2 rounded-lg"
              >
                Editar
              </PrimaryButton>

              <SecondaryButton
                onClick={handleApprove}
                disabled={loadingApprove}
                className="bg-green-600 hover:bg-green-700 px-5 py-2 rounded-lg"
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
