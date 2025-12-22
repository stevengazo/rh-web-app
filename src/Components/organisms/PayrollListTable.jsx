
const PayrollListTable = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <table className="min-w-full border-collapse">
        {/* Header */}
        <thead className="bg-slate-100">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
              ID
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
              Fecha
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
              Tipo
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 uppercase">
              Monto
            </th>
          </tr>
        </thead>

        {/* Body */}
        <tbody className="divide-y divide-slate-100">
          <tr className="hover:bg-slate-50 transition">
            <td className="px-4 py-3 text-sm text-slate-700">
              #1
            </td>
            <td className="px-4 py-3 text-sm text-slate-600">
              15/05/2023
            </td>
            <td className="px-4 py-3 text-sm text-slate-600">
              Quincenal
            </td>
            <td className="px-4 py-3 text-sm text-right font-semibold text-emerald-600">
              $1,500.00
            </td>
          </tr>

          {/* Placeholder para más filas */}
          <tr className="hover:bg-slate-50 transition">
            <td className="px-4 py-3 text-sm text-slate-700">
              #2
            </td>
            <td className="px-4 py-3 text-sm text-slate-600">
              31/05/2023
            </td>
            <td className="px-4 py-3 text-sm text-slate-600">
              Mensual
            </td>
            <td className="px-4 py-3 text-sm text-right font-semibold text-emerald-600">
              $2,300.00
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default PayrollListTable;
