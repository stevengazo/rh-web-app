import { motion } from 'framer-motion';
import { CheckCircle2, Clock, Eye, XCircle } from 'lucide-react';

import RowActionButton from '../molecules/RowActionButton';
import { formatMoney } from '../../utils/formatMoney';

const formatFechaHora = (valor) => {
  if (!valor || String(valor).startsWith('0001-01-01')) return '—';
  const f = new Date(valor);
  if (Number.isNaN(f.getTime())) return '—';

  return f.toLocaleString('es-CR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/** Horas entre inicio y fin, para no hacer la cuenta a ojo. */
const horasEntre = (inicio, fin) => {
  const a = new Date(inicio);
  const b = new Date(fin);
  if (Number.isNaN(a.getTime()) || Number.isNaN(b.getTime())) return null;

  const h = (b - a) / 3_600_000;
  return h > 0 ? h : null;
};

/**
 * Tabla de horas extra.
 *
 * @param {Array} extras
 * @param {(e: object) => void} [onSelect] Abre el detalle.
 */
const ExtraTable = ({ extras = [], onSelect }) => {
  if (!extras.length) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-xl
                      border border-dashed border-stroke bg-surface-alt py-12 text-ink-muted">
        <Clock size={26} />
        <p className="text-sm">No hay horas extra registradas.</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-stroke-soft shadow-sm">
      <table className="min-w-full">
        <thead className="bg-surface-alt text-ink-secondary">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold">Tipo</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Inicio</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Fin</th>
            <th className="px-4 py-3 text-right text-sm font-semibold">Horas</th>
            <th className="px-4 py-3 text-right text-sm font-semibold">Monto</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Estado</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Registrado por</th>
            <th className="px-4 py-3 text-center text-sm font-semibold">Acciones</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-stroke-soft bg-surface text-sm">
          {extras.map((e, i) => {
            const horas = horasEntre(e.start, e.end);

            return (
              <motion.tr
                key={e.extraId}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: Math.min(i * 0.03, 0.3) }}
                onClick={() => onSelect?.(e)}
                /* El hover se hace con clases para que respete el modo oscuro:
                   antes era un color fijo (#f8fafc) y en oscuro quedaba blanco. */
                className={`cursor-pointer transition-colors hover:bg-canvas
                  ${e.deleted ? 'opacity-50' : ''}`}
              >
                <td className="px-4 py-3 font-medium text-ink">
                  {e.extraType?.name || '—'}
                  {e.extraType?.factor && (
                    <span className="ml-1.5 text-xs font-normal text-ink-muted">
                      ×{e.extraType.factor}
                    </span>
                  )}
                </td>

                <td className="px-4 py-3 whitespace-nowrap text-ink-secondary">
                  {formatFechaHora(e.start)}
                </td>

                <td className="px-4 py-3 whitespace-nowrap text-ink-secondary">
                  {formatFechaHora(e.end)}
                </td>

                <td className="px-4 py-3 text-right text-ink-secondary">
                  {horas === null ? '—' : `${horas.toFixed(2)} h`}
                </td>

                <td className="px-4 py-3 text-right font-semibold text-ink">
                  {formatMoney(e.amount)}
                </td>

                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5
                      text-xs font-semibold ${
                        e.isApproved
                          ? 'bg-green-50 text-green-700'
                          : 'bg-amber-50 text-amber-800'
                      }`}
                  >
                    {e.isApproved ? (
                      <CheckCircle2 size={13} />
                    ) : (
                      <XCircle size={13} />
                    )}
                    {e.isApproved ? 'Aprobado' : 'Pendiente'}
                  </span>
                </td>

                <td className="px-4 py-3 text-ink-muted">{e.createdBy || '—'}</td>

                <td className="px-4 py-3">
                  <div className="flex justify-center">
                    <RowActionButton
                      icon={Eye}
                      label="Ver detalle"
                      tono="brand"
                      onClick={() => onSelect?.(e)}
                    />
                  </div>
                </td>
              </motion.tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ExtraTable;
