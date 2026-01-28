import { useState } from 'react';
import comissionsApi from '../../api/comissionsApi';
import PrimaryButton from '../PrimaryButton';
import toast from 'react-hot-toast';

// --- Helpers ---
const formatDateYYYYMMDD = (date) => {
  if (!date) return null;
  return new Date(date).toISOString().split('T')[0];
};

const ComissionAdd = ({ userId, author }) => {
  console.log('ComissionAdd author:', author);

  const [form, setForm] = useState({
    comissionId: 0,
    date: '',
    amount: '',
    description: '',
    approvedBy: null,
    approvedAt: null,
    createdBy: author?.email || author || '',
    createdAt: new Date().toISOString(),
    lastEditedBy: null,
    lastEditedAt: null,
    draft: true,
    deleted: false,
    userId: userId || '',
    user: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      lastEditedAt: new Date().toISOString(),
      lastEditedBy: prev.createdBy,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.date || !form.amount) {
      setError('La fecha y el monto son obligatorios');
      return;
    }

    // --- Payload seguro para ASP.NET ---
    const payload = {
      ...form,
      date: formatDateYYYYMMDD(form.date),
      amount: Number(form.amount),
    };

    // ❌ Eliminar DateTime nulos (rompen System.DateTime)
    if (!payload.approvedAt) delete payload.approvedAt;
    if (!payload.lastEditedAt) delete payload.lastEditedAt;
    if (!payload.approvedBy) delete payload.approvedBy;
    if (!payload.lastEditedBy) delete payload.lastEditedBy;

    try {
      setLoading(true);
      await comissionsApi.createComission(payload);

      toast.success('Comisión guardada exitosamente');

      // Opcional: reset parcial
      setForm((prev) => ({
        ...prev,
        date: '',
        amount: '',
        description: '',
        draft: true,
      }));
    } catch (err) {
      setError('Error al guardar la comisión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg text-black bg-white p-6 rounded-xl shadow-md space-y-5"
    >
      <h2 className="text-xl font-semibold text-gray-800">
        Registrar comisión
      </h2>

      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-2 rounded text-sm">
          {error}
        </div>
      )}

      {/* Fecha */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Fecha
        </label>
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-300 px-3 py-2
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Monto */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Monto
        </label>
        <input
          type="number"
          step="0.01"
          name="amount"
          value={form.amount}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-300 px-3 py-2
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Descripción */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Descripción
        </label>
        <textarea
          name="description"
          rows={3}
          value={form.description}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-300 px-3 py-2
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Draft */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          name="draft"
          checked={form.draft}
          onChange={handleChange}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500"
        />
        <span className="text-sm text-gray-700">Guardar como borrador</span>
      </div>

      {/* Botón */}
      <div className="pt-2">
        <PrimaryButton type="submit" disabled={loading}>
          {loading ? 'Guardando...' : 'Guardar comisión'}
        </PrimaryButton>
      </div>
    </form>
  );
};

export default ComissionAdd;
