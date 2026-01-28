const formatDate = (date) => {
  if (!date) return '-';
  if (date.startsWith('0001-01-01')) return '-';
  return new Date(date).toLocaleDateString('es-CR');
};

const ComissionTable = ({ comissions = [] }) => {
  console.log(comissions);

  if (!comissions.length) {
    return (
      <p className="text-gray-500 text-sm">
        No hay comisiones registradas.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-200 rounded-lg">
        <thead className="bg-gray-100 text-sm text-gray-700">
          <tr>
            <th className="px-4 py-2 text-left">ID</th>
            <th className="px-4 py-2 text-left">Fecha</th>
            <th className="px-4 py-2 text-left">Monto</th>
            <th className="px-4 py-2 text-left">Descripción</th>
            <th className="px-4 py-2 text-left">Estado</th>
            <th className="px-4 py-2 text-left">Creado por</th>
            <th className="px-4 py-2 text-left">Última edición</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200 text-sm">
          {comissions.map((c) => (
            <tr key={c.comissionId} className="hover:bg-gray-50">
              <td className="px-4 py-2">{c.comissionId}</td>

              <td className="px-4 py-2">
                {formatDate(c.date)}
              </td>

              <td className="px-4 py-2 font-medium">
                ₡{Number(c.amount).toLocaleString('es-CR')}
              </td>

              <td className="px-4 py-2">
                {c.description || '-'}
              </td>

              <td className="px-4 py-2">
                {c.draft ? (
                  <span className="text-yellow-600 bg-yellow-100 px-2 py-1 rounded text-xs">
                    Borrador
                  </span>
                ) : (
                  <span className="text-green-600 bg-green-100 px-2 py-1 rounded text-xs">
                    Aprobada
                  </span>
                )}
              </td>

              <td className="px-4 py-2">
                {c.createdBy}
              </td>

              <td className="px-4 py-2">
                {formatDate(c.lastEditedAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ComissionTable;
