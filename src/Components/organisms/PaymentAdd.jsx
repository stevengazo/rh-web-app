import { useState } from 'react';
import paymentApi from '../../api/paymentsApi';
import { useAppContext } from '../../context/AppContext';

const PaymentAdd = ({ loanId = 0 }) => {
  const today = new Date().toISOString().split('T')[0];

  const { user } = useAppContext();
  console.log(user);
  const [newPayment, setNewPayment] = useState({
    paymentId: 0,
    createdDate: today,
    amount: 0.0,
    createdBy: user.userName,
    createdAt: today,
    editedBy: user.userName,
    editedAt: today,
    deleted: false,
    loanId: loanId,
    loan: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;

    setNewPayment((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await paymentApi.createPayment(newPayment);
      alert('✅ Pago registrado correctamente');

      // Reset campos
      setNewPayment((prev) => ({
        ...prev,
        amount: '',
        createdDate: today,
      }));
    } catch (err) {
      console.error(err);
      setError('❌ Error al registrar el pago');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className=" rounded-xl shadow p-4 space-y-4 max-w-md"
    >
      <h3 className="text-lg font-semibold text-gray-700">➕ Registrar pago</h3>

      {/* Fecha */}
      <div>
        <label className="block text-sm text-gray-600 mb-1">
          Fecha de pago
        </label>
        <input
          type="date"
          name="createdDate"
          value={newPayment.createdDate}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2"
          required
        />
      </div>

      {/* Monto */}
      <div>
        <label className="block text-sm text-gray-600 mb-1">Monto</label>
        <input
          type="number"
          name="amount"
          value={newPayment.amount}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2"
          min="0"
          step="0.01"
          required
        />
      </div>

      {/* Error */}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {/* Botón */}
      <button
        type="submit"
        disabled={loading || !loanId}
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
      >
        {loading ? 'Guardando...' : 'Guardar pago'}
      </button>
    </form>
  );
};

export default PaymentAdd;
