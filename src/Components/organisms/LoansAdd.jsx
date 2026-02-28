import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import loansApi from '../../api/loansApi';
import EmployeeApi from '../../api/employeesApi';
import { useAppContext } from '../../context/AppContext';

const LoansAdd = ({ userId }) => {
  const { user } = useAppContext();
  const today = new Date().toISOString().split('T')[0];

  const notify = () => toast.success('Agregado');
  const [employees, setEmployees] = useState([]);
  const [newLoan, setNewLoan] = useState({
    loanId: 0,
    amount: 0,
    requestAt: today,
    paymentMonths: 0,
    state: 'Pending',
    description: '',
    title: '',
    createdBy: '',
    createdAt: today,
    lastUpdatedAt: today,
    lastUpdatedBy: '',
    deleted: false,
    approvedBy: '',
    approvedAt: today,
    userId: userId,
    user: null,
    payments: [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function GetData() {
      const response = await EmployeeApi.getAllEmployees();
      setEmployees(response.data);
    }
    GetData();
  }, []);

  // Manejar cambios
  const handleChange = (e) => {
    const { name, value } = e.target;

    setNewLoan((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Guardar préstamo
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log(newLoan);
      await loansApi.createLoan(newLoan);
      notify();

      // Reset form
      setNewLoan((prev) => ({
        ...prev,
        amount: 0,
        paymentMonths: 0,
        description: '',
        title: '',
      }));
    } catch (err) {
      console.error(err);
      setError('❌ Error al registrar el préstamo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="
      bg-gray-800 text-gray-100
      p-6 rounded-2xl shadow-xl
      space-y-6
      w-full max-w-xl
    "
    >
      <div>
        <h2 className="text-xl font-semibold tracking-wide">
          ➕ Solicitud de Préstamo
        </h2>
        <p className="text-sm text-gray-400">
          Completa la información para registrar el préstamo
        </p>
      </div>

      {/* Empleado */}
      <div className="space-y-1">
        <label className="text-sm text-gray-300">Empleado</label>
        <select
          name="userId"
          value={newLoan.userId}
          onChange={handleChange}
          className="
          w-full bg-gray-700 border border-gray-600
          rounded-xl px-3 py-2
          text-sm
          focus:outline-none focus:ring-2 focus:ring-indigo-500
          transition
        "
        >
          {employees.map((e) => (
            <option key={e.id} value={e.id} className="text-black">
              {e.firstName} {e.lastName}
            </option>
          ))}
        </select>
      </div>

      {/* Grid Responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Título */}
        <div className="space-y-1">
          <label className="text-sm text-gray-300">Título</label>
          <input
            type="text"
            name="title"
            value={newLoan.title}
            onChange={handleChange}
            required
            className="
            w-full bg-gray-700 border border-gray-600
            rounded-xl px-3 py-2 text-sm
            focus:outline-none focus:ring-2 focus:ring-indigo-500
            transition
          "
          />
        </div>

        {/* Monto */}
        <div className="space-y-1">
          <label className="text-sm text-gray-300">Monto</label>
          <input
            type="number"
            name="amount"
            value={newLoan.amount}
            onChange={handleChange}
            required
            className="
            w-full bg-gray-700 border border-gray-600
            rounded-xl px-3 py-2 text-sm
            focus:outline-none focus:ring-2 focus:ring-indigo-500
            transition
          "
          />
        </div>

        {/* Plazo */}
        <div className="space-y-1">
          <label className="text-sm text-gray-300">Meses de pago</label>
          <input
            type="number"
            name="paymentMonths"
            value={newLoan.paymentMonths}
            onChange={handleChange}
            required
            className="
            w-full bg-gray-700 border border-gray-600
            rounded-xl px-3 py-2 text-sm
            focus:outline-none focus:ring-2 focus:ring-indigo-500
            transition
          "
          />
        </div>

        {/* Fecha */}
        <div className="space-y-1">
          <label className="text-sm text-gray-300">Fecha de solicitud</label>
          <input
            type="date"
            name="requestAt"
            value={newLoan.requestAt}
            onChange={handleChange}
            className="
            w-full bg-gray-700 border border-gray-600
            rounded-xl px-3 py-2 text-sm
            focus:outline-none focus:ring-2 focus:ring-indigo-500
            transition
          "
          />
        </div>
      </div>

      {/* Descripción */}
      <div className="space-y-1">
        <label className="text-sm text-gray-300">Descripción</label>
        <textarea
          name="description"
          value={newLoan.description}
          onChange={handleChange}
          rows={3}
          className="
          w-full bg-gray-700 border border-gray-600
          rounded-xl px-3 py-2 text-sm
          focus:outline-none focus:ring-2 focus:ring-indigo-500
          transition resize-none
        "
        />
      </div>

      {/* Error */}
      {error && (
        <p className="text-red-400 text-sm bg-red-500/10 px-3 py-2 rounded-lg">
          {error}
        </p>
      )}

      {/* Botón */}
      <button
        type="submit"
        disabled={loading}
        className="
        w-full sm:w-auto
        bg-indigo-600 hover:bg-indigo-700
        px-5 py-2.5
        rounded-xl
        text-sm font-medium
        transition
        disabled:opacity-50 disabled:cursor-not-allowed
        active:scale-[0.98]
      "
      >
        {loading ? 'Guardando...' : 'Guardar préstamo'}
      </button>
    </form>
  );
};

export default LoansAdd;
