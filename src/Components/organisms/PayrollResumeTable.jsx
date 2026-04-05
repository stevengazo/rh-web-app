const PayrollResumeTable = ({ resume }) => {
  const formatCurrency = (value) =>
    new Intl.NumberFormat('es-CR', {
      style: 'currency',
      currency: 'CRC',
    }).format(value || 0);

  return (
    <div className="overflow-hidden   bg-white ">
      <table className="w-full border-collapse text-sm">
        <tbody>
          <tr className="border-b">
            <th className="px-4 py-3 text-left font-medium text-slate-600">
              Total Extras
            </th>
            <td className="px-4 py-3 text-right font-semibold text-slate-800">
              {formatCurrency(resume?.totalExtras)}
            </td>
          </tr>

          <tr className="border-b">
            <th className="px-4 py-3 text-left font-medium text-slate-600">
              Total Rebajos
            </th>
            <td className="px-4 py-3 text-right font-semibold text-red-600">
              {formatCurrency(resume?.totalDeductions)}
            </td>
          </tr>

          <tr className="border-b">
            <th className="px-4 py-3 text-left font-medium text-slate-600">
              Asociación
            </th>
            <td className="px-4 py-3 text-right font-semibold text-slate-800">
              {formatCurrency(resume?.association)}
            </td>
          </tr>

          <tr className="border-b">
            <th className="px-4 py-3 text-left font-medium text-slate-600">
              Pago CCSS
            </th>
            <td className="px-4 py-3 text-right font-semibold text-slate-800">
              {formatCurrency(resume?.ccss)}
            </td>
          </tr>

          <tr className="bg-slate-50">
            <th className="px-4 py-4 text-left text-base font-semibold text-slate-700">
              Monto por Pagar
            </th>
            <td className="px-4 py-4 text-right text-lg font-bold text-emerald-600">
              {formatCurrency(resume?.totalToPay)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default PayrollResumeTable;
