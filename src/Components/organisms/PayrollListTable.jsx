import { useNavigate } from 'react-router-dom';
import {
  Ban,
  CheckCircle2,
  Eye,
  PencilIcon,
  RotateCcw,
  Users,
  Wallet,
} from 'lucide-react';

import PayrollStatusBadge, {
  PAYROLL_STATUS,
  esPlanillaEditable,
} from '../molecules/PayrollStatusBadge';

const formatDate = (date) =>
  date ? new Date(date).toLocaleDateString('es-CR') : '—';

const formatMoney = (amount) =>
  (amount ?? 0).toLocaleString('es-CR', {
    style: 'currency',
    currency: 'CRC',
    maximumFractionDigits: 0,
  });

/** Acción con tooltip. */
const AccionIcono = ({ icon: Icon, label, onClick, tono = 'default' }) => {
  const tonos = {
    default: 'text-ink-muted hover:bg-canvas hover:text-brand',
    success: 'text-ink-muted hover:bg-green-50 hover:text-green-700',
    danger: 'text-ink-muted hover:bg-red-50 hover:text-red-600',
  };

  return (
    <div className="relative flex items-center group">
      <button
        type="button"
        onClick={onClick}
        aria-label={label}
        className={`grid h-8 w-8 place-items-center rounded-md transition-colors
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${tonos[tono]}`}
      >
        <Icon size={17} />
      </button>

      <span
        className="pointer-events-none absolute -top-8 left-1/2 z-10 -translate-x-1/2
                   whitespace-nowrap rounded-md bg-nav px-2 py-1 text-xs text-white
                   opacity-0 transition-opacity group-hover:opacity-100"
      >
        {label}
      </span>
    </div>
  );
};

/**
 * Listado de planillas.
 *
 * @param {Array} payrolls
 * @param {(p: object) => void} [onApprove]
 * @param {(p: object) => void} [onPay]
 * @param {(p: object) => void} [onReopen]
 * @param {(p: object) => void} [onVoid]
 */
const PayrollListTable = ({
  payrolls = [],
  onApprove,
  onPay,
  onReopen,
  onVoid,
}) => {
  const nav = useNavigate();

  if (!payrolls.length) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-stroke bg-surface-alt py-16 text-ink-muted">
        <Wallet size={30} />
        <p className="text-sm font-medium">No hay planillas registradas</p>
        <p className="text-xs">Genera la primera con el botón de arriba.</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-stroke-soft shadow-sm">
      <table className="min-w-full">
        <thead className="bg-surface-alt text-ink-secondary">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold">ID</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">
              Periodo
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Tipo</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">
              Estado
            </th>
            <th className="px-4 py-3 text-right text-sm font-semibold">
              Empleados
            </th>
            <th className="px-4 py-3 text-right text-sm font-semibold">
              Neto a pagar
            </th>
            <th className="px-4 py-3 text-center text-sm font-semibold">
              Acciones
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-stroke-soft bg-surface">
          {payrolls.map((p) => {
            const estado = p.status ?? PAYROLL_STATUS.DRAFT;
            const editable = esPlanillaEditable(estado);
            const anulada = estado === PAYROLL_STATUS.VOIDED;

            return (
              <tr
                key={p.payrollId}
                className={`transition hover:bg-canvas ${anulada ? 'opacity-60' : ''}`}
              >
                <td className="px-4 py-3 text-sm font-medium text-ink">
                  #{p.payrollId}
                </td>

                <td className="px-4 py-3 text-sm text-ink-secondary">
                  {formatDate(p.initialDate)} – {formatDate(p.finalDate)}
                  {p.payrollDescription && (
                    <span className="block truncate text-xs text-ink-muted">
                      {p.payrollDescription}
                    </span>
                  )}
                </td>

                <td className="px-4 py-3 text-sm text-ink-muted">
                  {p.payrollType ?? '—'}
                </td>

                <td className="px-4 py-3">
                  <PayrollStatusBadge status={estado} />
                  {p.approvedBy && estado !== PAYROLL_STATUS.DRAFT && (
                    <span className="mt-1 block text-xs text-ink-muted">
                      por {p.approvedBy}
                    </span>
                  )}
                </td>

                <td className="px-4 py-3 text-right text-sm text-ink-secondary">
                  <span className="inline-flex items-center gap-1.5">
                    <Users size={14} className="text-ink-muted" />
                    {p.employeeCount ?? 0}
                  </span>
                </td>

                <td className="px-4 py-3 text-right text-sm font-semibold text-ink">
                  {formatMoney(p.totalAmount)}
                </td>

                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-1">
                    <AccionIcono
                      icon={Eye}
                      label="Ver detalle"
                      onClick={() => nav(`/manager/payroll/${p.payrollId}`)}
                    />

                    {editable && (
                      <AccionIcono
                        icon={PencilIcon}
                        label="Editar planilla"
                        onClick={() => nav(`/payroll/new/${p.payrollId}`)}
                      />
                    )}

                    {editable && onApprove && (
                      <AccionIcono
                        icon={CheckCircle2}
                        label="Aprobar"
                        tono="success"
                        onClick={() => onApprove(p)}
                      />
                    )}

                    {estado === PAYROLL_STATUS.APPROVED && onPay && (
                      <AccionIcono
                        icon={Wallet}
                        label="Marcar como pagada"
                        tono="success"
                        onClick={() => onPay(p)}
                      />
                    )}

                    {estado === PAYROLL_STATUS.APPROVED && onReopen && (
                      <AccionIcono
                        icon={RotateCcw}
                        label="Reabrir como borrador"
                        onClick={() => onReopen(p)}
                      />
                    )}

                    {!anulada && estado !== PAYROLL_STATUS.PAID && onVoid && (
                      <AccionIcono
                        icon={Ban}
                        label="Anular"
                        tono="danger"
                        onClick={() => onVoid(p)}
                      />
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default PayrollListTable;
