const LoansTable = ({ loans = [] }) => {
  return (
    <div className="overflow-x-auto bg-white shadow-md rounded-lg">
      <table className="min-w-full border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
              ID
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
              Título
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
              Estado
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
              Fecha
            </th>
            <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">
              Monto
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {loans.length === 0 ? (
            <tr>
              <td
                colSpan={5}
                className="px-4 py-6 text-center text-gray-500"
              >
                No hay préstamos registrados
              </td>
            </tr>
          ) : (
            loans.map((e) => (
              <tr
                key={e.loanId}
                className="hover:bg-gray-50 transition"
              >
                <td className="px-4 py-3 text-sm text-gray-700">
                  {e.loanId}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {e.title}
                </td>
                <td className="px-4 py-3 text-sm">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium
                      ${
                        e.state === 'Aprobado'
                          ? 'bg-green-100 text-green-700'
                          : e.state === 'Pendiente'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                  >
                    {e.state}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {new Date(e.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-sm text-right font-semibold text-gray-800">
                  ₡{Number(e.amount).toLocaleString()}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default LoansTable;
