const PaymentTable = ({ payments = [] }) => {
  if (!payments.length) {
    return (
      <p className="text-center text-ink-muted py-6">
        No hay pagos registrados.
      </p>
    );
  }

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('es-CR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const formatAmount = (amount) =>
    new Intl.NumberFormat('es-CR', {
      style: 'currency',
      currency: 'CRC',
    }).format(amount);

  const totalAmount = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto">
        <table className="min-w-full border border-stroke-soft rounded-md">
          <thead className="bg-surface-alt text-ink-secondary">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold text-ink-secondary">
                ID
              </th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-ink-secondary">
                Fecha
              </th>
              <th className="px-4 py-2 text-right text-sm font-semibold text-ink-secondary">
                Monto
              </th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-ink-secondary">
                Creado por
              </th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-ink-secondary">
                Última edición
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-stroke-soft">
            {payments.map((payment) => (
              <tr key={payment.paymentId} className="hover:bg-canvas transition-colors">
                <td className="px-4 py-2 text-sm">{payment.paymentId}</td>

                <td className="px-4 py-2 text-sm">
                  {formatDate(payment.createdDate)}
                </td>

                <td className="px-4 py-2 text-sm text-right font-medium">
                  {formatAmount(payment.amount)}
                </td>

                <td className="px-4 py-2 text-sm">{payment.createdBy}</td>

                <td className="px-4 py-2 text-sm text-ink-muted">
                  {formatDate(payment.editedAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* TOTAL */}
      <div className="flex justify-end">
        <div className="bg-surface-alt px-4 py-2 rounded-md text-sm font-semibold">
          Total pagado:{' '}
          <span className="ml-2 text-green-600">
            {formatAmount(totalAmount)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PaymentTable;
