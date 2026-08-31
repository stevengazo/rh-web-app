import { Pencil, Trash2 } from 'lucide-react';

import RowActionButton from '../molecules/RowActionButton';
import { formatMoney } from '../../utils/formatMoney';

const formatDate = (valor) => {
  if (!valor || String(valor).startsWith('0001-01-01')) return '—';
  const f = new Date(valor);
  return Number.isNaN(f.getTime())
    ? '—'
    : f.toLocaleDateString('es-CR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
};

/**
 * Tabla de abonos de un préstamo.
 *
 * @param {Array} payments
 * @param {(payment: Object) => void} [onEdit]   Si se pasa, muestra el botón de editar.
 * @param {(payment: Object) => void} [onDelete] Si se pasa, muestra el botón de eliminar.
 */
const PaymentTable = ({ payments = [], onEdit, onDelete }) => {
  if (!payments.length) {
    return (
      <p className="py-6 text-center text-ink-muted">
        No hay abonos registrados.
      </p>
    );
  }

  const conAcciones = Boolean(onEdit || onDelete);
  const total = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto rounded-xl border border-stroke-soft">
        <table className="min-w-full">
          <thead className="bg-surface-alt text-ink-secondary">
            <tr>
              <th className="px-4 py-2.5 text-left text-sm font-semibold">
                Fecha
              </th>
              <th className="px-4 py-2.5 text-right text-sm font-semibold">
                Monto
              </th>
              <th className="px-4 py-2.5 text-left text-sm font-semibold">
                Registrado por
              </th>
              <th className="px-4 py-2.5 text-left text-sm font-semibold">
                Última edición
              </th>
              {conAcciones && (
                <th className="px-4 py-2.5 text-center text-sm font-semibold">
                  Acciones
                </th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-stroke-soft bg-surface">
            {payments.map((payment) => (
              <tr
                key={payment.paymentId}
                className="transition-colors hover:bg-canvas"
              >
                <td className="px-4 py-2.5 text-sm text-ink-secondary">
                  {formatDate(payment.createdDate)}
                </td>

                <td className="px-4 py-2.5 text-right text-sm font-medium text-ink">
                  {formatMoney(payment.amount)}
                </td>

                <td className="px-4 py-2.5 text-sm text-ink-secondary">
                  {payment.createdBy || '—'}
                </td>

                <td className="px-4 py-2.5 text-sm text-ink-muted">
                  {payment.editedBy
                    ? `${payment.editedBy} · ${formatDate(payment.editedAt)}`
                    : '—'}
                </td>

                {conAcciones && (
                  <td className="px-4 py-2.5">
                    <div className="flex items-center justify-center gap-1">
                      {onEdit && (
                        <RowActionButton
                          icon={Pencil}
                          label="Editar abono"
                          tono="brand"
                          onClick={() => onEdit(payment)}
                        />
                      )}
                      {onDelete && (
                        <RowActionButton
                          icon={Trash2}
                          label="Eliminar abono"
                          tono="danger"
                          onClick={() => onDelete(payment)}
                        />
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end">
        <div className="rounded-md bg-surface-alt px-4 py-2 text-sm font-semibold text-ink">
          Total abonado:{' '}
          <span className="ml-2 text-green-700">{formatMoney(total)}</span>
        </div>
      </div>
    </div>
  );
};

export default PaymentTable;
