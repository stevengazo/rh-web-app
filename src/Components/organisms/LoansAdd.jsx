import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import loansApi from '../../api/loansApi';
import EmployeeApi from '../../api/employeesApi';
import { useAppContext } from '../../context/AppContext';
import PrimaryButton from '../PrimaryButton';

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
      bg-surface-alt border border-stroke-soft text-ink
      p-6 rounded-2xl shadow-xl
      space-y-6
      w-full max-w-xl
    "
    >
      <div>
        <h2 className="text-xl font-semibold tracking-wide">
          ➕ Solicitud de Préstamo
        </h2>
        <p className="text-sm text-ink-muted">
          Completa la información para registrar el préstamo
        </p>
      </div>

      {/* Empleado */}
      <div className="space-y-1">
        <label className="text-sm text-ink-secondary">Empleado</label>
        <select
          name="userId"
          value={newLoan.userId}
          onChange={handleChange}
          className="
          w-full bg-surface border border-stroke text-ink
          rounded-md px-3 py-2
          text-sm
          focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand
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
          <label className="text-sm text-ink-secondary">Título</label>
          <input
            type="text"
            name="title"
            value={newLoan.title}
            onChange={handleChange}
            required
            className="
            w-full bg-surface border border-stroke text-ink
            rounded-md px-3 py-2 text-sm
            focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand
            transition
          "
          />
        </div>

        {/* Monto */}
        <div className="space-y-1">
          <label className="text-sm text-ink-secondary">Monto</label>
          <input
            type="number"
            name="amount"
            value={newLoan.amount}
            onChange={handleChange}
            required
            className="
            w-full bg-surface border border-stroke text-ink
            rounded-md px-3 py-2 text-sm
            focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand
            transition
          "
          />
        </div>

        {/* Plazo */}
        <div className="space-y-1">
          <label className="text-sm text-ink-secondary">Meses de pago</label>
          <input
            type="number"
            name="paymentMonths"
            value={newLoan.paymentMonths}
            onChange={handleChange}
            required
            className="
            w-full bg-surface border border-stroke text-ink
            rounded-md px-3 py-2 text-sm
            focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand
            transition
          "
          />
        </div>

        {/* Fecha */}
        <div className="space-y-1">
          <label className="text-sm text-ink-secondary">Fecha de solicitud</label>
          <input
            type="date"
            name="requestAt"
            value={newLoan.requestAt}
            onChange={handleChange}
            className="
            w-full bg-surface border border-stroke text-ink
            rounded-md px-3 py-2 text-sm
            focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand
            transition
          "
          />
        </div>
      </div>

      {/* Descripción */}
      <div className="space-y-1">
        <label className="text-sm text-ink-secondary">Descripción</label>
        <textarea
          name="description"
          value={newLoan.description}
          onChange={handleChange}
          rows={3}
          className="
          w-full bg-surface border border-stroke text-ink
          rounded-md px-3 py-2 text-sm
          focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand
          transition resize-none
        "
        />
      </div>

      {/* Error */}
      {error && (
        <p className="text-red-700 text-sm bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
          {error}
        </p>
      )}

      {/* Botón */}
      <PrimaryButton
        type="submit"
        disabled={loading}
        className="w-full sm:w-auto active:scale-[0.98]"
      >
        {loading ? 'Guardando...' : 'Guardar préstamo'}
      </PrimaryButton>
    </form>
  );
};

export default LoansAdd;
