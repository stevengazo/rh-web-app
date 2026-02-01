import { useNavigate } from 'react-router-dom';
import { useState, useMemo } from 'react';

const STATUS_STYLES = {
  Aprobado: 'bg-green-100 text-green-700',
  Pendiente: 'bg-yellow-100 text-yellow-700',
  Rechazado: 'bg-red-100 text-red-700',
};

const LoansTable = ({ loans = [] }) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const filteredLoans = useMemo(() => {
    if (!search.trim()) return loans;

    const term = search.toLowerCase();

    return loans.filter((loan) =>
      loan.loanId.toString().includes(term) ||
      loan.title.toLowerCase().includes(term) ||
      loan.state.toLowerCase().includes(term)
    );
  }, [search, loans]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      {/* Búsqueda */}
      <div className="mb-4 flex justify-between items-center">
        <input
          type="text"
          placeholder="Buscar por ID, título o estado…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="
            w-full md:w-1/3 px-4 py-2 text-sm
            border border-gray-300 rounded-lg
            focus:outline-none focus:ring-2 focus:ring-blue-500
          "
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              {['ID', 'Título', 'Estado', 'Fecha', 'Monto'].map((h) => (
                <th
                  key={h}
                  className={`
                    px-4 py-3 text-sm font-semibold text-gray-600
                    ${h === 'Monto' ? 'text-right' : 'text-left'}
                  `}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {filteredLoans.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center text-sm text-gray-500"
                >
                  No se encontraron préstamos
                </td>
              </tr>
            ) : (
              filteredLoans.map((loan) => (
                <tr
                  key={loan.loanId}
                  onClick={() => navigate(`/manager/loan/${loan.loanId}`)}
                  className="
                    cursor-pointer transition
                    hover:bg-blue-50
                  "
                >
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {loan.loanId}
                  </td>

                  <td className="px-4 py-3 text-sm text-gray-700">
                    {loan.title}
                  </td>

                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`
                        inline-flex items-center
                        px-3 py-1 rounded-full text-xs font-medium
                        ${STATUS_STYLES[loan.state] ?? 'bg-gray-100 text-gray-600'}
                      `}
                    >
                      {loan.state}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-sm text-gray-600">
                    {new Date(loan.createdAt).toLocaleDateString()}
                  </td>

                  <td className="px-4 py-3 text-sm text-right font-semibold text-gray-800">
                    ₡{Number(loan.amount).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LoansTable;
