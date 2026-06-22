import { DollarSign, Calendar, Coins, Pencil, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import IconButton from '../IconButton';

const formatDate = (dateString) => {
  if (!dateString) return '—';
  return format(new Date(dateString), 'dd/MM/yyyy');
};

const formatAmount = (amount, currency) => {
  if (!amount) return '—';
  const value = Number(amount);
  if (isNaN(value)) return amount;

  return new Intl.NumberFormat('es-CR', {
    style: 'currency',
    currency: currency || 'CRC',
    minimumFractionDigits: 2,
  }).format(value);
};

const SalaryTable = ({ salaries = [], onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-stroke-soft rounded-xl overflow-hidden shadow-sm bg-surface">
        <thead className="bg-surface-alt text-ink-secondary">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold">
              <div className="flex items-center gap-2">
                <Calendar size={16} /> Fecha
              </div>
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold">
              <div className="flex items-center gap-2">
                <DollarSign size={16} /> Monto
              </div>
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold">
              <div className="flex items-center gap-2">
                <Coins size={16} /> Moneda
              </div>
            </th>
            <th className="px-4 py-3 text-center text-sm font-semibold">
              Acciones
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-stroke-soft">
          {salaries.length === 0 && (
            <tr>
              <td
                colSpan={4}
                className="px-4 py-6 text-center text-sm text-ink-muted"
              >
                No hay salarios registrados
              </td>
            </tr>
          )}

          {salaries.map((item) => (
            <tr key={item.salaryId} className="text-sm hover:bg-canvas">
              <td className="px-4 py-3 text-ink-muted">
                {formatDate(item.effectiveDate)}
              </td>
              <td className="px-4 py-3 font-medium text-ink">
                {formatAmount(item.salaryAmount, item.currency)}
              </td>
              <td className="px-4 py-3 text-ink-muted">
                {item.currency || '—'}
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-center gap-2">
                  <IconButton
                    icon={Pencil}
                    onClick={() => onEdit?.(item)}
                    variant="primary"
                    size={16}
                    title="Editar"
                  />
                  <IconButton
                    icon={Trash2}
                    onClick={() => onDelete?.(item)}
                    variant="danger"
                    size={16}
                    title="Eliminar"
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SalaryTable;
