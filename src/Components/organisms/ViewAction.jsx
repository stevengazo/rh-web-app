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
  const {user} = useAppContext();
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
        approvedBy : user.email
      }
      await actionApi.updateAction (action.actionId, payload);
      toast.success('Acción aprobada');
      onUpdated?.();
    } catch (err) {
      toast.error('Error al aprobar la acción');
    } finally {
      setLoadingApprove(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <SectionTitle>
            {action.actionType?.name || 'Acción'}
          </SectionTitle>
          <p className="text-sm">
            {action.user?.firstName} {action.user?.lastName}
          </p>
        </div>

        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold
            ${
              isApproved
                ? 'bg-green-100 text-green-700'
                : 'bg-yellow-100 text-yellow-700'
            }
          `}
        >
          {isApproved ? 'Aprobada' : 'Pendiente'}
        </span>
      </div>

      <Divider />

      {/* Info */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        {/* Fecha */}
        <div>
          <p>Fecha</p>
          {editMode ? (
            <input
              type="date"
              name="actionDate"
              value={form.actionDate}
              onChange={handleChange}
              className="w-full border rounded-md px-2 py-1"
            />
          ) : (
            <p className="font-medium">
              {new Date(action.actionDate).toLocaleDateString()}
            </p>
          )}
        </div>

        {/* Tipo */}
        <div>
          <p>Tipo de acción</p>
          {editMode ? (
            <select
              name="actionTypeId"
              value={form.actionTypeId}
              onChange={handleChange}
              className="w-full border rounded-md px-2 py-1"
            >
              {types.map((t) => (
                <option key={t.actionTypeId} value={t.actionTypeId}>
                  {t.name}
                </option>
              ))}
            </select>
          ) : (
            <p className="font-medium">
              {action.actionType?.name}
            </p>
          )}
        </div>

        {/* Creado por */}
        <div>
          <p>Creado por</p>
          <p className="font-medium">{action.createdBy}</p>
        </div>
      </div>

      {/* Descripción */}
      <div>
        <p className="text-sm mb-1">Descripción</p>
        {editMode ? (
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            className="w-full border rounded-md p-2 text-sm"
          />
        ) : (
          <div className="rounded-lg border bg-slate-50 p-3 text-sm">
            {action.description || 'Sin descripción'}
          </div>
        )}
      </div>

      {/* Actions */}
      {!isApproved && (
        <div className="flex justify-end gap-2 pt-4">
          {editMode ? (
            <>
              <button
                onClick={() => setEditMode(false)}
                className="px-4 py-2 text-sm rounded-md border"
              >
                Cancelar
              </button>

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
                className="bg-green-600 hover:bg-green-700"
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
