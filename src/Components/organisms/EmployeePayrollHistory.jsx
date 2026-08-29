import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Eye, ReceiptText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import PayrollStatusBadge from '../molecules/PayrollStatusBadge';
import RowActionButton from '../molecules/RowActionButton';
import { formatMoney } from '../../utils/formatMoney';

const formatFecha = (valor) => {
  if (!valor || String(valor).startsWith('0001-01-01')) return null;
  const f = new Date(valor);
  return Number.isNaN(f.getTime())
    ? null
    : f.toLocaleDateString('es-CR', { day: '2-digit', month: 'short' });
};

/** "01 ago – 15 ago 2026", o el nombre de la planilla si no hay fechas. */
const periodo = (planilla) => {
  const p = planilla?.payrollData;
  const desde = formatFecha(p?.initialDate);
  const hasta = formatFecha(p?.finalDate);

  if (desde && hasta) {
    const anio = new Date(p.finalDate).getFullYear();
    return `${desde} – ${hasta} ${anio}`;
  }

  return p?.name || `Planilla #${planilla?.payrollId ?? '—'}`;
};

/**
 * Historial de planillas del colaborador.
 *
 * Une la fila `Employee_Payroll` (sus montos) con la planilla a la que
 * pertenece (`payrollData`), que es la que lleva el periodo y el estado.
 */
const EmployeePayrollHistory = ({ payrolls = [] }) => {
  const navigate = useNavigate();

  /* De la más reciente a la más antigua: es como se consulta un histórico. */
  const ordenadas = useMemo(
    () =>
      [...payrolls].sort(
        (a, b) =>
          new Date(b.payrollData?.finalDate ?? 0) -
          new Date(a.payrollData?.finalDate ?? 0)
      ),
    [payrolls]
  );

  const totalNeto = useMemo(
    () => payrolls.reduce((t, p) => t + (p.netAmount ?? 0), 0),
    [payrolls]
  );

  if (!payrolls.length) {
    return (
      <div
        className="flex flex-col items-center justify-center gap-2 rounded-xl
                   border border-dashed border-stroke bg-surface-alt py-12 text-ink-muted"
      >
        <ReceiptText size={26} />
        <p className="text-sm">
          Este colaborador aún no aparece en ninguna planilla.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-stroke-soft bg-surface-alt p-4">
          <p className="text-xs uppercase tracking-wide text-ink-muted">
            Periodos pagados
          </p>
          <p className="mt-1 text-xl font-bold text-ink">{payrolls.length}</p>
        </div>

        <div className="rounded-xl border border-stroke-soft bg-surface-alt p-4">
          <p className="text-xs uppercase tracking-wide text-ink-muted">
            Neto acumulado
          </p>
          <p className="mt-1 text-xl font-bold text-brand">
            {formatMoney(totalNeto)}
          </p>
        </div>
      </div>

      <div className="w-full overflow-x-auto rounded-xl border border-stroke-soft shadow-sm">
        <table className="min-w-full">
          <thead className="bg-surface-alt text-ink-secondary">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold">Periodo</th>
              <th className="px-4 py-3 text-right text-sm font-semibold">Bruto</th>
              <th className="px-4 py-3 text-right text-sm font-semibold">
                Deducciones
              </th>
              <th className="px-4 py-3 text-right text-sm font-semibold">Neto</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Estado</th>
              <th className="px-4 py-3 text-center text-sm font-semibold">Ver</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-stroke-soft bg-surface text-sm">
            {ordenadas.map((p, i) => {
              const bruto = p.grossSalary ?? 0;
              const neto = p.netAmount ?? 0;
              const deducciones = bruto - neto;
              const irA = () =>
                p.payrollId && navigate(`/manager/payroll/${p.payrollId}`);

              return (
                <motion.tr
                  key={p.employee_PayrollId ?? i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: Math.min(i * 0.03, 0.3) }}
                  onClick={irA}
                  className="cursor-pointer transition-colors hover:bg-canvas"
                >
                  <td className="px-4 py-3 whitespace-nowrap font-medium text-ink">
                    {periodo(p)}
                  </td>

                  <td className="px-4 py-3 text-right text-ink">
                    {formatMoney(bruto)}
                  </td>

                  <td className="px-4 py-3 text-right text-red-600">
                    {deducciones > 0 ? `- ${formatMoney(deducciones)}` : '—'}
                  </td>

                  <td className="px-4 py-3 text-right font-semibold text-ink">
                    {formatMoney(neto)}
                  </td>

                  <td className="px-4 py-3">
                    <PayrollStatusBadge status={p.payrollData?.status} />
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex justify-center">
                      <RowActionButton
                        icon={Eye}
                        label="Ver la planilla completa"
                        tono="brand"
                        onClick={irA}
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

export default EmployeePayrollHistory;
