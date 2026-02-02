import { useState } from 'react';
import { Edit, Trash2, CheckCircle, XCircle, Save } from 'lucide-react';
import extrasApi from '../../api/extrasApi';
import toast from 'react-hot-toast';

const formatDate = (date) => {
  if (!date || date.startsWith('0001-01-01')) return '—';
  return new Date(date).toLocaleDateString('es-CR', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });
};

const ExtraView = ({ extra, onDelete, onUpdated, OnClose }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    start: extra?.start?.substring(0, 10),
    end: extra?.end?.substring(0, 10),
    amount: extra?.amount,
    notes: extra?.notes,
  });

  if (!extra) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await extrasApi.updateExtra(extra.extraId, {
        ...extra,
        start: form.start,
        end: form.end,
        amount: Number(form.amount),
        notes: form.notes,
      });

      toast.success('Hora extra actualizada');
      setIsEditing(false);
      onUpdated?.();
    } catch {
      toast.error('Error al guardar cambios');
    }
  };

  const handleApprove = async () => {
    try {
      await extrasApi.updateExtra(extra.extraId, { ...extra, isAproved: true });
      toast.success('Hora extra aprobada');
      onUpdated?.();
      OnClose?.();
    } catch {
      toast.error('No se pudo aprobar');
    }
  };

  const handleReject = async () => {
    try {
        await extrasApi.updateExtra(extra.extraId, { ...extra, isAproved: false });
      toast.success('Hora extra rechazada');
      onUpdated?.();
      OnClose?.();
    } catch {
      toast.error('No se pudo rechazar');
    }
  };

  return (
    <div className="max-w-md text-slate-100">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Hora Extra</h3>
        <p className="text-sm text-slate-400">{extra.extraType?.name}</p>
      </div>

      {/* Content */}
      <div className="space-y-3 text-sm">
        <div>
          <span className="text-slate-400">Monto</span>
          {isEditing ? (
            <input
              name="amount"
              type="number"
              value={form.amount}
              onChange={handleChange}
              className="w-full mt-1 bg-transparent border border-slate-600
                         rounded px-2 py-1 text-slate-100"
            />
          ) : (
            <p className="font-semibold">
              ₡{Number(extra.amount).toLocaleString('es-CR')}
            </p>
          )}
        </div>

        <div>
          <span className="text-slate-400">Inicio</span>
          {isEditing ? (
            <input
              name="start"
              type="date"
              value={form.start}
              onChange={handleChange}
              className="w-full mt-1 bg-transparent border border-slate-600
                         rounded px-2 py-1"
            />
          ) : (
            <p>{formatDate(extra.start)}</p>
          )}
        </div>

        <div>
          <span className="text-slate-400">Fin</span>
          {isEditing ? (
            <input
              name="end"
              type="date"
              value={form.end}
              onChange={handleChange}
              className="w-full mt-1 bg-transparent border border-slate-600
                         rounded px-2 py-1"
            />
          ) : (
            <p>{formatDate(extra.end)}</p>
          )}
        </div>

        <div>
          <span className="text-slate-400">Notas</span>
          {isEditing ? (
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={3}
              className="w-full mt-1 bg-transparent border border-slate-600
                         rounded px-2 py-1"
            />
          ) : (
            <p>{extra.notes || '—'}</p>
          )}
        </div>

        <div>
          <span className="text-slate-400">Estado</span>
          <p
            className={
              extra.isAproved
                ? 'text-green-400 font-medium'
                : 'text-amber-400 font-medium'
            }
          >
            {extra.isAproved ? 'Aprobado' : 'Pendiente'}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap justify-end gap-2 mt-5">
        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs
                         rounded-md border border-green-400 text-green-400
                         hover:bg-green-400/10"
            >
              <Save size={14} />
              Guardar
            </button>

            <button
              onClick={() => setIsEditing(false)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs
                         rounded-md border border-slate-500
                         hover:bg-slate-700"
            >
              Cancelar
            </button>
          </>
        ) : (
          <>
            {!extra.isAproved && (
              <>
                <button
                  onClick={handleApprove}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs
                             rounded-md border border-green-400 text-green-400
                             hover:bg-green-400/10"
                >
                  <CheckCircle size={14} />
                  Aprobar
                </button>

                <button
                  onClick={handleReject}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs
                             rounded-md border border-red-400 text-red-400
                             hover:bg-red-400/10"
                >
                  <XCircle size={14} />
                  Rechazar
                </button>
              </>
            )}

            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs
                         rounded-md border border-slate-500
                         hover:bg-slate-700"
            >
              <Edit size={14} />
              Editar
            </button>

            <button
              onClick={() => onDelete?.(extra)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs
                         rounded-md border border-red-500 text-red-400
                         hover:bg-red-500/10"
            >
              <Trash2 size={14} />
              Eliminar
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ExtraView;
