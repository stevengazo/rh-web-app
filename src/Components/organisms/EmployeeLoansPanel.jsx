import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Eye, HandCoins } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import ReviewStatusBadge from '../molecules/ReviewStatusBadge';
import RowActionButton from '../molecules/RowActionButton';
import { formatMoney } from '../../utils/formatMoney';
import {
  LOAN_STATUS,
  estadoDePrestamo,
  saldoDePrestamo,
} from '../../utils/loanStatus';

const formatFecha = (valor) => {
  if (!valor || String(valor).startsWith('0001-01-01')) return '—';
  const f = new Date(valor);
  return Number.isNaN(f.getTime())
    ? '—'
    : f.toLocaleDateString('es-CR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
};

/** Cifra destacada del resumen. */
const Cifra = ({ label, valor, tono = 'text-ink' }) => (
  <div className="rounded-xl border border-stroke-soft bg-surface-alt p-4">
    <p className="text-xs uppercase tracking-wide text-ink-muted">{label}</p>
    <p className={`mt-1 text-xl font-bold ${tono}`}>{valor}</p>
  </div>
);

/**
 * Préstamos del colaborador dentro de su expediente.
 *
 * Es una vista de consulta: lo que interesa aquí es cuánto debe y cuánto le
 * descuentan al mes. La gestión (aprobar, abonar) vive en `/manager/loans`,
 * a donde lleva el botón de detalle.
 */
const EmployeeLoansPanel = ({ loans = [] }) => {
  const navigate = useNavigate();

  const resumen = useMemo(() => {
    const activos = loans.filter(
      (l) => estadoDePrestamo(l) === LOAN_STATUS.APPROVED
    );

    return {
      activos: activos.length,
      saldo: activos.reduce((t, l) => t + saldoDePrestamo(l), 0),
      cuota: activos.reduce((t, l) => t + (l.monthlyFee ?? 0), 0),
    };
  }, [loans]);

  if (!loans.length) {
    return (
      <div
        className="flex flex-col items-center justify-center gap-2 rounded-xl
                   border border-dashed border-stroke bg-surface-alt py-12 text-ink-muted"
      >
        <HandCoins size={26} />
        <p className="text-sm">Este colaborador no tiene préstamos.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Cifra label="Préstamos activos" valor={resumen.activos} />
        <Cifra
          label="Saldo pendiente"
          valor={formatMoney(resumen.saldo)}
          tono="text-ink"
        />
        <Cifra
          label="Deducción mensual"
          valor={formatMoney(resumen.cuota)}
          tono="text-brand"
        />
      </div>

      <div className="w-full overflow-x-auto rounded-xl border border-stroke-soft shadow-sm">
        <table className="min-w-full">
          <thead className="bg-surface-alt text-ink-secondary">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold">Concepto</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Fecha</th>
              <th className="px-4 py-3 text-right text-sm font-semibold">Monto</th>
              <th className="px-4 py-3 text-right text-sm font-semibold">Abonado</th>
              <th className="px-4 py-3 text-right text-sm font-semibold">Saldo</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Estado</th>
              <th className="px-4 py-3 text-center text-sm font-semibold">Ver</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-stroke-soft bg-surface text-sm">
            {loans.map((l, i) => {
              const estado = estadoDePrestamo(l);
              const abonado = l.paidAmount ?? 0;

              return (
                <motion.tr
                  key={l.loanId ?? i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: Math.min(i * 0.03, 0.3) }}
                  onClick={() => navigate(`/manager/loan/${l.loanId}`)}
                  className="cursor-pointer transition-colors hover:bg-canvas"
                >
                  <td className="px-4 py-3 font-medium text-ink">
                    {l.title || `Préstamo #${l.loanId}`}
                    {l.paymentMonths > 0 && (
                      <span className="block text-xs font-normal text-ink-muted">
                        {l.paymentMonths} cuotas · {formatMoney(l.monthlyFee ?? 0)}
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-3 whitespace-nowrap text-ink-secondary">
                    {formatFecha(l.createdAt ?? l.requestAt)}
                  </td>

                  <td className="px-4 py-3 text-right text-ink">
                    {formatMoney(l.amount)}
                  </td>

                  <td className="px-4 py-3 text-right text-green-700">
                    {formatMoney(abonado)}
                  </td>

                  <td className="px-4 py-3 text-right font-semibold text-ink">
                    {formatMoney(saldoDePrestamo(l))}
                  </td>

                  <td className="px-4 py-3">
                    <ReviewStatusBadge status={estado} />
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex justify-center">
                      <RowActionButton
                        icon={Eye}
                        label="Ver detalle y abonos"
                        tono="brand"
                        onClick={() => navigate(`/manager/loan/${l.loanId}`)}
                      />
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeLoansPanel;
