const PayrollResumeTable = ({ resume }) => {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full border-collapse text-sm">
        <tbody>
          {/* Monto Horas Extras */}
          <tr className="border-b last:border-none">
            <th className="px-4 py-3 text-left font-medium text-slate-600">
              Total Extras
            </th>
            <td className="px-4 py-3 text-right font-semibold text-slate-800">
              ₡0.00
            </td>
          </tr>

          {/* Monto Rebajos */}
          <tr className="border-b last:border-none">
            <th className="px-4 py-3 text-left font-medium text-slate-600">
              Total Rebajos
            </th>
            <td className="px-4 py-3 text-right font-semibold text-red-600">
              ₡0.00
            </td>
          </tr>

          {/* Monto Asociación */}
          <tr className="border-b last:border-none">
            <th className="px-4 py-3 text-left font-medium text-slate-600">
              Asociación
            </th>
            <td className="px-4 py-3 text-right font-semibold text-slate-800">
              ₡0.00
            </td>
          </tr>

          {/* Pago CCSS */}
          <tr className="border-b last:border-none">
            <th className="px-4 py-3 text-left font-medium text-slate-600">
              Pago CCSS
            </th>
            <td className="px-4 py-3 text-right font-semibold text-slate-800">
              ₡0.00
            </td>
          </tr>

          {/* Monto Por Pagar */}
          <tr className="bg-slate-50">
            <th className="px-4 py-4 text-left text-base font-semibold text-slate-700">
              Monto por Pagar
            </th>
            <td className="px-4 py-4 text-right text-lg font-bold text-emerald-600">
              ₡0.00
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default PayrollResumeTable;
