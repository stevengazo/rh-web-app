import { RUN_STATUS_STYLE } from '../../../utils/automations';

const fechaHora = (v) => {
  if (!v) return '—';
  const f = new Date(v);
  return Number.isNaN(f.getTime())
    ? '—'
    : f.toLocaleString('es-CR', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      });
};

/** Bitácora de ejecuciones de una regla. */
const AutomationRunsTable = ({ runs = [] }) => {
  if (!runs.length) {
    return (
      <p className="rounded-lg bg-surface-alt p-4 text-sm text-ink-muted">
        Esta automatización todavía no se ha ejecutado.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-stroke-soft">
      <table className="min-w-full">
        <thead className="bg-surface-alt text-ink-secondary">
          <tr>
            <th className="px-4 py-2.5 text-left text-sm font-semibold">Cuándo</th>
            <th className="px-4 py-2.5 text-left text-sm font-semibold">Estado</th>
            <th className="px-4 py-2.5 text-left text-sm font-semibold">Detalle</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stroke-soft bg-surface">
          {runs.map((r) => (
            <tr key={r.automationRunId} className="hover:bg-canvas">
              <td className="whitespace-nowrap px-4 py-2.5 text-sm text-ink-secondary">
                {fechaHora(r.triggeredAt)}
              </td>
              <td className="px-4 py-2.5">
                <span
                  className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                    RUN_STATUS_STYLE[r.status] ?? RUN_STATUS_STYLE.Omitida
                  }`}
                >
                  {r.status}
                </span>
              </td>
              <td className="px-4 py-2.5 text-sm text-ink-secondary">{r.detail}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AutomationRunsTable;
