const VacationsTable = ({ vacationsList = [], showUser = false }) => {
  if (!vacationsList.length) {
    return (
      <p className="text-ink-muted italic">
        No hay solicitudes de vacaciones registradas.
      </p>
    );
  }

  const formatDate = (date) => new Date(date).toLocaleDateString('es-CR');

  const calculateDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diff = end - start;

    return diff >= 0 ? diff / (1000 * 60 * 60 * 24) + 1 : 0;
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-stroke-soft rounded-md">
        <thead className="bg-surface-alt text-ink-secondary">
          <tr>
            {showUser && (
              <th className="px-4 py-2 text-left text-sm font-semibold text-ink-secondary">
                Usuario
              </th>
            )}
            <th className="px-4 py-2 text-left text-sm font-semibold text-ink-secondary">
              Fecha de inicio
            </th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-ink-secondary">
              Fecha de finalización
            </th>
            <th className="px-4 py-2 text-center text-sm font-semibold text-ink-secondary">
              Días solicitados
            </th>
            <th className="px-4 py-2 text-center text-sm font-semibold text-ink-secondary">
              Estado
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-stroke-soft">
          {vacationsList.map((vacation) => (
            <tr key={vacation.vacationId} className="hover:bg-canvas transition-colors">
              {showUser && (
                <td className="px-4 py-2 text-sm text-ink">
                  {vacation.userId}
                </td>
              )}

              <td className="px-4 py-2 text-sm text-ink">
                {formatDate(vacation.startDate)}
              </td>

              <td className="px-4 py-2 text-sm text-ink">
                {formatDate(vacation.endDate)}
              </td>

              <td className="px-4 py-2 text-sm text-center text-ink">
                {calculateDays(vacation.startDate, vacation.endDate)}
              </td>

              <td className="px-4 py-2 text-center">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-semibold
                    ${
                      vacation.status === 'Pendiente'
                        ? 'bg-yellow-100 text-yellow-700'
                        : vacation.status === 'Aprobado'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                    }`}
                >
                  {vacation.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VacationsTable;
