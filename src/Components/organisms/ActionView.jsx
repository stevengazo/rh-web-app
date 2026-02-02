const formatDate = (date) => {
  if (!date || date.startsWith('0001-01-01')) return '—';
  return new Date(date).toLocaleDateString('es-CR');
};

const row = (label, value) => (
  <tr className="border-t">
    <td className="px-4 py-2 font-medium ">{label}</td>
    <td className="px-4 py-2 ">{value ?? '—'}</td>
  </tr>
);

const ActionView = ({ action }) => {
  if (!action) {
    return (
      <p className="text-center text-gray-500 py-6">
        No hay información de la acción.
      </p>
    );
  }

  return (
    <div className="text-white rounded-lg shadow-sm border  overflow-hidden">
      <table className="w-full">
        <thead className="">
          <tr>
            <th className="px-4 py-2 text-left ">Campo</th>
            <th className="px-4 py-2 text-left ">Valor</th>
          </tr>
        </thead>

        <tbody>
          {row('ID Acción', action.actionId)}
          {row('Tipo de acción', action.actionType?.name)}
          {row('Descripción', action.description)}
          {row('Fecha de acción', formatDate(action.actionDate))}

          {row('Creado por', action.createdBy)}
          {row('Fecha creación', formatDate(action.createdDate))}

          {row('Última edición por', action.lastUpdatedBy)}
          {row('Fecha última edición', formatDate(action.lastUpdatedDate))}

          {row(
            'Estado',
            action.approvedBy ? (
              <span className="text-green-600 font-medium">Aprobada</span>
            ) : (
              <span className="text-yellow-600 font-medium">Pendiente</span>
            )
          )}

          {row('Aprobado por', action.approvedBy)}
          {row('Fecha aprobación', formatDate(action.approvedDate))}
        </tbody>
      </table>
    </div>
  );
};

export default ActionView;
