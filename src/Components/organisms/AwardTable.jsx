const AwardTable = ({ awards = [] }) => {
  const formatDate = (dateString) => {
    if (!dateString) return '-';

    const date = new Date(dateString);
    return date.toLocaleDateString('es-CR', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    });
  };

  if (!awards.length) {
    return (
      <p className="text-center text-gray-500 py-6">
        No hay reconocimientos registrados.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
              Título
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
              Descripción
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
              Fecha
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
              Creado por
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {awards.map((award) => (
            <tr
              key={award.awardId}
              className="hover:bg-gray-50 transition"
            >
              <td className="px-4 py-3 text-sm text-gray-800 font-medium">
                {award.title}
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">
                {award.description}
              </td>
              <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                {formatDate(award.createdAt)}
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">
                {award.createdBy || '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

new Date(dateString).toLocaleDateString('es-CR', {
  year: 'numeric',
  month: 'short',
  day: '2-digit',
});


export default AwardTable;
