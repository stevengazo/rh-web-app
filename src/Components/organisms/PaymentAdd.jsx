import { useState } from "react";
import toast from "react-hot-toast";
import paymentApi from "../../api/paymentsApi";
import { useAppContext } from "../../context/AppContext";
import PrimaryButton from "../PrimaryButton";

const PaymentAdd = ({ loanId = 0 }) => {
  const today = new Date().toISOString().split("T")[0];
  const { user } = useAppContext();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [newPayment, setNewPayment] = useState({
    paymentId: 0,
    createdDate: today,
    amount: "",
    createdBy: user.userName,
    createdAt: today,
    editedBy: user.userName,
    editedAt: today,
    deleted: false,
    loanId: loanId,
    loan: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setNewPayment((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!newPayment.amount) {
      setError("El monto es obligatorio");
      return;
    }

    try {
      setLoading(true);

      await paymentApi.createPayment({
        ...newPayment,
        amount: Number(newPayment.amount),
      });

      toast.success("Pago registrado correctamente");

      setNewPayment((prev) => ({
        ...prev,
        amount: "",
        createdDate: today,
      }));
    } catch (err) {
      console.error(err);
      setError("Error al registrar el pago");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle =
    "w-full mt-1 bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none transition";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-white">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold">
          Registrar pago
        </h2>
        <p className="text-xs text-gray-300 mt-1">
          Registro de abono a préstamo
        </p>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-400 text-red-300 px-3 py-2 rounded text-sm">
          {error}
        </div>
      )}

      {/* Fecha */}
      <div>
        <label className="text-sm text-gray-200">
          Fecha de pago
        </label>
        <input
          type="date"
          name="createdDate"
          value={newPayment.createdDate}
          onChange={handleChange}
          className={inputStyle}
          required
        />
      </div>

      {/* Monto */}
      <div>
        <label className="text-sm text-gray-200">
          Monto
        </label>
        <input
          type="number"
          name="amount"
          value={newPayment.amount}
          onChange={handleChange}
          className={inputStyle}
          min="0"
          step="0.01"
          required
        />
      </div>

      <PrimaryButton
        type="submit"
        disabled={loading || !loanId}
        className="w-full py-2 rounded-lg text-sm font-semibold hover:scale-[1.02] active:scale-[0.98] transition disabled:opacity-50"
      >
        {loading ? "Guardando..." : "Guardar pago"}
      </PrimaryButton>
    </form>
  );
};

export default PaymentAdd;