const PayrollResumeTable = ({ resume }) => {
  const formatCurrency = (value) =>
    new Intl.NumberFormat('es-CR', {
      style: 'currency',
      currency: 'CRC',
    }).format(value || 0);

  return (
    <div className="overflow-hidden   bg-surface ">
      <table className="w-full border-collapse text-sm">
        <tbody>
          {resume?.empleados !== undefined && (
            <tr className="border-b border-stroke-soft">
              <th className="px-4 py-3 text-left font-medium text-ink-muted">
                Empleados
              </th>
              <td className="px-4 py-3 text-right font-semibold text-ink">
                {resume.empleados}
              </td>
            </tr>
          )}

          {resume?.totalBruto !== undefined && (
            <tr className="border-b border-stroke-soft">
              <th className="px-4 py-3 text-left font-medium text-ink-muted">
                Total Bruto
              </th>
              <td className="px-4 py-3 text-right font-semibold text-ink">
                {formatCurrency(resume.totalBruto)}
              </td>
            </tr>
          )}

          <tr className="border-b border-stroke-soft">
            <th className="px-4 py-3 text-left font-medium text-ink-muted">
              Total Extras
            </th>
            <td className="px-4 py-3 text-right font-semibold text-ink">
              {formatCurrency(resume?.totalExtras)}
            </td>
          </tr>

          <tr className="border-b border-stroke-soft">
            <th className="px-4 py-3 text-left font-medium text-ink-muted">
              Total Rebajos
            </th>
            <td className="px-4 py-3 text-right font-semibold text-red-600">
              {formatCurrency(resume?.totalDeductions)}
            </td>
          </tr>

          <tr className="border-b border-stroke-soft">
            <th className="px-4 py-3 text-left font-medium text-ink-muted">
              Asociación
            </th>
            <td className="px-4 py-3 text-right font-semibold text-ink">
              {formatCurrency(resume?.association)}
            </td>
          </tr>

          <tr className="border-b border-stroke-soft">
            <th className="px-4 py-3 text-left font-medium text-ink-muted">
              Pago CCSS
            </th>
            <td className="px-4 py-3 text-right font-semibold text-ink">
              {formatCurrency(resume?.ccss)}
            </td>
          </tr>

          <tr className="bg-surface-alt">
            <th className="px-4 py-4 text-left text-base font-semibold text-ink-secondary">
              Monto por Pagar
            </th>
            <td className="px-4 py-4 text-right text-lg font-semibold text-emerald-600">
              {formatCurrency(resume?.totalToPay)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default PayrollResumeTable;
