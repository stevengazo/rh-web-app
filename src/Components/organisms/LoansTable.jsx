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

    return loans.filter(
      (loan) =>
        loan.loanId.toString().includes(term) ||
        loan.title.toLowerCase().includes(term) ||
        loan.state.toLowerCase().includes(term)
    );
  }, [search, loans]);

  return (
    <div className="bg-surface rounded-xl p-4">
      {/* Búsqueda */}
      <div className="mb-4 flex justify-between items-center">
        <input
          type="text"
          placeholder="Buscar por ID, título o estado…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="
            w-full md:w-1/3 px-4 py-2 text-sm
            border border-stroke rounded-md
            focus:outline-none focus:ring-2 focus:ring-brand
          "
        />
      </div>

      <div className="w-full overflow-x-auto">
        <table className="min-w-full border border-stroke-soft rounded-xl overflow-hidden shadow-sm bg-surface">
          {/* =========================
          HEADER
      ========================= */}
          <thead className="bg-surface-alt">
            <tr>
              {['ID', 'Título', 'Estado', 'Fecha', 'Monto'].map((h) => (
                <th
                  key={h}
                  className={`
                px-4 py-3 text-sm font-semibold text-ink-secondary
                ${h === 'Monto' ? 'text-right' : 'text-left'}
              `}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          {/* =========================
          BODY
      ========================= */}
          <tbody className="divide-y divide-stroke-soft">
            {filteredLoans.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-6 text-center text-sm text-ink-muted"
                >
                  No se encontraron préstamos
                </td>
              </tr>
            ) : (
              filteredLoans.map((loan) => (
                <tr
                  key={loan.loanId}
                  onClick={() => navigate(`/manager/loan/${loan.loanId}`)}
                  className="cursor-pointer transition hover:bg-canvas"
                >
                  {/* ID */}
                  <td className="px-4 py-3 text-sm text-ink">
                    {loan.loanId}
                  </td>

                  {/* TITULO */}
                  <td className="px-4 py-3 text-sm text-ink">
                    {loan.title}
                  </td>

                  {/* ESTADO */}
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`
                    inline-flex items-center
                    px-3 py-1 rounded-full text-xs font-medium
                    ${STATUS_STYLES[loan.state] ?? 'bg-surface-alt text-ink-muted'}
                  `}
                    >
                      {loan.state}
                    </span>
                  </td>

                  {/* FECHA */}
                  <td className="px-4 py-3 text-sm text-ink-muted">
                    {new Date(loan.createdAt).toLocaleDateString()}
                  </td>

                  {/* MONTO */}
                  <td className="px-4 py-3 text-sm text-right font-semibold text-emerald-600">
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
