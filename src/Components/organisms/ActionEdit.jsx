import { useEffect, useState } from 'react';
import actionApi from '../../api/actionApi';
import actionTypeApi from '../../api/actionTypeApi';
import toast from 'react-hot-toast';

const ActionEdit = ({ action, OnEdited }) => {
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    actionTypeId: '',
    actionDate: '',
    description: '',
  });

  useEffect(() => {
    if (action) {
      setForm({
        actionTypeId: action.actionTypeId || '',
        actionDate: action.actionDate?.substring(0, 10) || '',
        description: action.description || '',
      });
    }
  }, [action]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await actionTypeApi.getAllActionTypes();
        setTypes(response.data);
      } catch (error) {
        toast.error('Error al cargar tipos de acción');
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.actionTypeId || !form.actionDate) {
      toast.error('Complete los campos obligatorios');
      return;
    }

    try {
      setLoading(true);

      await actionApi.updateAction(action.actionId, {
        ...action,
        ...form,
      });

      toast.success('Acción actualizada correctamente');
      OnEdited?.();
    } catch (error) {
      console.error(error);
      toast.error('Error al actualizar la acción');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Tipo */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Tipo de acción
        </label>
        <select
          name="actionTypeId"
          value={form.actionTypeId}
          onChange={handleChange}
          className="w-full border rounded-md px-3 py-2 text-sm"
        >
          <option value="">Seleccione un tipo</option>
          {types.map((t) => (
            <option key={t.actionTypeId} value={t.actionTypeId}>
              {t.name}
            </option>
          ))}
        </select>
      </div>

      {/* Fecha */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Fecha de la acción
        </label>
        <input
          type="date"
          name="actionDate"
          value={form.actionDate}
          onChange={handleChange}
          className="w-full border rounded-md px-3 py-2 text-sm"
        />
      </div>

      {/* Descripción */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Descripción
        </label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={4}
          className="w-full border rounded-md px-3 py-2 text-sm resize-none"
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm bg-slate-900 text-white rounded-md hover:bg-slate-800 disabled:opacity-50"
        >
          Guardar cambios
        </button>
      </div>
    </form>
  );
};

export default ActionEdit;
