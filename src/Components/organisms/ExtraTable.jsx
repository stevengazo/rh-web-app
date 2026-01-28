const formatDate = (date) => {
  if (!date) return '-';
  if (date.startsWith('0001-01-01')) return '-';
  return new Date(date).toLocaleDateString('es-CR');
};

const ExtraTable = ({ extras = [] }) => {


  if (!extras.length) {
    return (
      <p className="text-gray-500 text-sm">
        No hay extras registrados.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-200 rounded-lg">
        <thead className="bg-gray-100 text-sm text-gray-700">
          <tr>
            <th className="px-4 py-2 text-left">ID</th>
            <th className="px-4 py-2 text-left">Tipo</th>
            <th className="px-4 py-2 text-left">Inicio</th>
            <th className="px-4 py-2 text-left">Fin</th>
            <th className="px-4 py-2 text-left">Monto</th>
            <th className="px-4 py-2 text-left">Notas</th>
            <th className="px-4 py-2 text-left">Estado</th>
            <th className="px-4 py-2 text-left">Creado por</th>
            <th className="px-4 py-2 text-left">Última edición</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200 text-sm">
          {extras.map((e) => (
            <tr
              key={e.extraId}
              className={`hover:bg-gray-50 ${
                e.isDeleted ? 'opacity-50' : ''
              }`}
            >
              <td className="px-4 py-2">{e.extraId}</td>

              <td className="px-4 py-2">
                {e.extraType?.name || '-'}
              </td>

              <td className="px-4 py-2">
                {formatDate(e.start)}
              </td>

              <td className="px-4 py-2">
                {formatDate(e.end)}
              </td>

              <td className="px-4 py-2 font-medium">
                ₡{Number(e.amount).toLocaleString('es-CR')}
              </td>

              <td className="px-4 py-2">
                {e.notes || '-'}
              </td>

              <td className="px-4 py-2">
                {e.isAproved ? (
                  <span className="text-green-600 bg-green-100 px-2 py-1 rounded text-xs">
                    Aprobado
                  </span>
                ) : (
                  <span className="text-yellow-600 bg-yellow-100 px-2 py-1 rounded text-xs">
                    Pendiente
                  </span>
                )}
              </td>

              <td className="px-4 py-2">
                {e.createdBy}
              </td>

              <td className="px-4 py-2">
                {formatDate(e.updatedAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExtraTable;
