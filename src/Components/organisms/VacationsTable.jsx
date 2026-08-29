import { motion } from 'framer-motion';
import { Check, Eye, Plane, RotateCcw, X } from 'lucide-react';

import RowActionButton from '../molecules/RowActionButton';
import ReviewStatusBadge from '../molecules/ReviewStatusBadge';
import {
  VACATION_STATUS,
  diasDeVacacion,
  estadoDeVacacion,
} from '../../utils/vacationStatus';

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

/**
 * Solicitudes de vacaciones con su flujo de aprobación.
 *
 * Las columnas de colaborador solo aparecen cuando la tabla se usa fuera del
 * expediente de una persona (`mostrarEmpleado`).
 *
 * @param {Array} vacations
 * @param {(v: object) => void} [onView]
 * @param {(v: object) => void} [onApprove]
 * @param {(v: object) => void} [onReject]
 * @param {(v: object) => void} [onReopen]
 * @param {boolean} [mostrarEmpleado]
 */
const VacationsTable = ({
  vacations = [],
  onView,
  onApprove,
  onReject,
  onReopen,
  mostrarEmpleado = false,
}) => {
  if (!vacations.length) {
    return (
      <div
        className="flex flex-col items-center justify-center gap-2 rounded-xl
                   border border-dashed border-stroke bg-surface-alt py-12 text-ink-muted"
      >
        <Plane size={26} />
        <p className="text-sm">No hay solicitudes de vacaciones.</p>
      </div>
    );
  }

  const hayAcciones = onView || onApprove || onReject || onReopen;

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-stroke-soft shadow-sm">
      <table className="min-w-full">
        <thead className="bg-surface-alt text-ink-secondary">
          <tr>
            {mostrarEmpleado && (
              <th className="px-4 py-3 text-left text-sm font-semibold">
                Colaborador
              </th>
            )}
            <th className="px-4 py-3 text-left text-sm font-semibold">Desde</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Hasta</th>
            <th className="px-4 py-3 text-right text-sm font-semibold">Días</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Motivo</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Estado</th>
            {hayAcciones && (
              <th className="px-4 py-3 text-center text-sm font-semibold">
                Acciones
              </th>
            )}
          </tr>
        </thead>

        <tbody className="divide-y divide-stroke-soft bg-surface text-sm">
          {vacations.map((v, i) => {
            const est = estadoDeVacacion(v);
            const pendiente = est === VACATION_STATUS.PENDING;

            return (
              <motion.tr
                key={v.vacationId ?? i}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: Math.min(i * 0.03, 0.3) }}
                onClick={() => onView?.(v)}
                className={`transition-colors hover:bg-canvas ${onView ? 'cursor-pointer' : ''}`}
              >
                {mostrarEmpleado && (
                  <td className="px-4 py-3 whitespace-nowrap font-medium text-ink">
                    {v.user
                      ? `${v.user.name ?? ''} ${v.user.lastName ?? ''}`.trim() ||
                        '—'
                      : '—'}
                  </td>
                )}

                <td className="px-4 py-3 whitespace-nowrap font-medium text-ink">
                  {formatFecha(v.startDate)}
                </td>

                <td className="px-4 py-3 whitespace-nowrap text-ink-secondary">
                  {formatFecha(v.endDate)}
                </td>

                <td className="px-4 py-3 text-right font-semibold text-ink">
                  {diasDeVacacion(v)}
                </td>

                <td className="max-w-xs px-4 py-3 text-ink-muted">
                  <span className="line-clamp-1">
                    {v.reason || v.description || '—'}
                  </span>
                </td>

                <td className="px-4 py-3">
                  <ReviewStatusBadge status={est} />
                </td>

                {hayAcciones && (
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      {onView && (
                        <RowActionButton
                          icon={Eye}
                          label="Ver detalle"
                          tono="brand"
                          onClick={() => onView(v)}
                        />
                      )}

                      {pendiente ? (
                        <>
                          {onApprove && (
                            <RowActionButton
                              icon={Check}
                              label="Aprobar"
                              onClick={() => onApprove(v)}
                            />
                          )}
                          {onReject && (
                            <RowActionButton
                              icon={X}
                              label="Rechazar"
                              tono="danger"
                              onClick={() => onReject(v)}
                            />
                          )}
                        </>
                      ) : (
                        onReopen && (
                          <RowActionButton
                            icon={RotateCcw}
                            label="Volver a pendiente"
                            onClick={() => onReopen(v)}
                          />
                        )
                      )}
                    </div>
                  </td>
                )}
              </motion.tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default VacationsTable;
