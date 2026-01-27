const VacationsTable = ({ vacationsList = [], showUser= false }) => {
  if (!vacationsList.length) {
    return (
      <p className="text-gray-500 italic">
        No hay solicitudes de vacaciones registradas.
      </p>
    );
  }

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("es-CR");

  const calculateDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diff = end - start;

    return diff >= 0 ? diff / (1000 * 60 * 60 * 24) + 1 : 0;
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-200 rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            {showUser && (
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                Usuario
              </th>
            )}
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
              Fecha de inicio
            </th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
              Fecha de finalización
            </th>
            <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700">
              Días solicitados
            </th>
            <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700">
              Estado
            </th>
          </tr>
        </thead>

        <tbody className="divide-y">
          {vacationsList.map((vacation) => (
            <tr key={vacation.vacationId} className="hover:bg-gray-50">
            {
              showUser && (<td className="px-4 py-2 text-sm text-gray-800">
                {vacation.userId}
              </td>
              )
            }
            
       

              <td className="px-4 py-2 text-sm text-gray-800">
                {formatDate(vacation.startDate)}
              </td>

              <td className="px-4 py-2 text-sm text-gray-800">
                {formatDate(vacation.endDate)}
              </td>

              <td className="px-4 py-2 text-sm text-center text-gray-800">
                {calculateDays(vacation.startDate, vacation.endDate)}
              </td>

              <td className="px-4 py-2 text-center">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-semibold
                    ${
                      vacation.status === "Pendiente"
                        ? "bg-yellow-100 text-yellow-700"
                        : vacation.status === "Aprobado"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
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
