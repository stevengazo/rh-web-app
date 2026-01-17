import { useEffect, useState } from 'react';
import loansApi from '../../api/loansApi';
import EmployeeApi from '../../api/employeesApi';
import { useAppContext } from '../../context/AppContext';

const LoansAdd = ({ userId }) => {
  const { user } = useAppContext();
  console.log('user', user);
  const today = new Date().toISOString().split('T')[0];
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
      console.log(response.data);
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
      alert('✅ Préstamo registrado correctamente');

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
      className=" p-6 rounded-xl shadow-md space-y-4 max-w-lg"
    >
      <h2 className="text-xl font-semibold text-gray-700">
        ➕ Solicitud de Préstamo
      </h2>

      {/* Título */}
      <div>
        <label className="block text-sm font-medium">Empleado</label>
        <select
          name="userId"
          value={newLoan.userId}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2"
        >
          {employees.map((e) => (
            <option key={e.id} value={e.id} className="text-black">
              {e.firstName} {e.lastName}{' '}
            </option>
          ))}
        </select>
      </div>

      {/* Título */}
      <div>
        <label className="block text-sm font-medium">Título</label>
        <input
          type="text"
          name="title"
          value={newLoan.title}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2"
          required
        />
      </div>

      {/* Monto */}
      <div>
        <label className="block text-sm font-medium">Monto</label>
        <input
          type="number"
          name="amount"
          value={newLoan.amount}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2"
          required
        />
      </div>

      {/* Plazo */}
      <div>
        <label className="block text-sm font-medium">Meses de pago</label>
        <input
          type="number"
          name="paymentMonths"
          value={newLoan.paymentMonths}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2"
          required
        />
      </div>

      {/* Fecha */}
      <div>
        <label className="block text-sm font-medium">Fecha de solicitud</label>
        <input
          type="date"
          name="requestAt"
          value={newLoan.requestAt}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2"
        />
      </div>

      {/* Descripción */}
      <div>
        <label className="block text-sm font-medium">Descripción</label>
        <textarea
          name="description"
          value={newLoan.description}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2"
          rows={3}
        />
      </div>

      {/* Error */}
      {error && <p className="text-red-600 text-sm">{error}</p>}

      {/* Botón */}
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
      >
        {loading ? 'Guardando...' : 'Guardar préstamo'}
      </button>
    </form>
  );
};

export default LoansAdd;
