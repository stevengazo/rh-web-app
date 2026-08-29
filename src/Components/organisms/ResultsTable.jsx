import { format } from 'date-fns';

const formatDate = (date) => {
  if (!date) return '—';
  const d = new Date(date);
  if (isNaN(d)) return '—';
  return format(d, 'dd/MM/yyyy');
};

const getBadge = (value) => {
  if (value >= 80) return 'bg-green-100 text-green-700';
  if (value >= 60) return 'bg-yellow-100 text-yellow-700';
  return 'bg-red-100 text-red-700';
};

const ResultsTable = ({ results = [] }) => {
  if (!results.length) {
    return (
      <div className="bg-surface border border-stroke-soft rounded-xl p-6 text-center text-ink-muted">
        No hay resultados registrados
      </div>
    );
  }

  const values = results.map((r) => r.evaluation);
  const avg = (values.reduce((a, b) => a + b, 0) / values.length).toFixed(2);
  const min = Math.min(...values);
  const max = Math.max(...values);

  return (
    <div className="space-y-6">
      {/* Estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Promedio" value={avg} />
        <StatCard label="Mínimo" value={min} />
        <StatCard label="Máximo" value={max} />
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto border border-stroke-soft rounded-xl shadow-sm bg-surface">
        <table className="min-w-full text-sm">
          <thead className="bg-surface-alt text-ink-secondary">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Fecha</th>
              <th className="px-4 py-3 text-center font-semibold">
                Evaluación
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-stroke-soft">
            {results.map((item) => (
              <tr key={item.resultId} className="hover:bg-canvas transition-colors">
                <td className="px-4 py-3 text-ink-muted">
                  {formatDate(item.resultDate)}
                </td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getBadge(
                      item.evaluation
                    )}`}
                  >
                    {item.evaluation}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const StatCard = ({ label, value }) => (
  <div className="border border-stroke-soft bg-surface rounded-xl hover:shadow-md transition-shadow duration-300 p-4 text-center shadow-sm">
    <p className="text-sm text-ink-muted">{label}</p>
    <p className="text-2xl font-semibold text-ink">{value}</p>
  </div>
);

export default ResultsTable;
