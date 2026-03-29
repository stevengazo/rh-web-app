import { useState } from 'react';
import toast from 'react-hot-toast';
import salaryApi from '../../api/salaryApi';
import PrimaryButton from '../PrimaryButton';

const SalaryAdd = ({ userId, author, onAdded }) => {
  const today = new Date().toISOString().split('T')[0];

  const [newSalary, setNewSalary] = useState({
    salaryId: 0,
    salaryAmount: '',
    effectiveDate: today,
    type: '',
    currency: '',
    createdBy: author?.userName ?? '',
    createdAt: today,
    updatedBy: author?.userName ?? '',
    updatedAt: today,
    userId: userId,
    user: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewSalary((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await salaryApi.createSalary(newSalary);
      toast.success('Salario agregado correctamente');
      onAdded();
    } catch (err) {
      toast.error('Ocurrió un error');
      console.error(err);
    }
  };

  const inputStyle =
    'w-full mt-1 bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none transition';

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-white">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold">Agregar salario</h2>
        <p className="text-xs text-gray-300 mt-1">
          Información salarial del empleado
        </p>
      </div>

      {/* Monto */}
      <div>
        <label className="text-sm text-gray-200">Monto</label>
        <input
          type="number"
          name="salaryAmount"
          value={newSalary.salaryAmount}
          onChange={handleChange}
          placeholder="₡ 850000"
          className={inputStyle}
        />
      </div>

      {/* Fecha efectiva */}
      <div>
        <label className="text-sm text-gray-200">Fecha efectiva</label>
        <input
          type="date"
          name="effectiveDate"
          value={newSalary.effectiveDate}
          onChange={handleChange}
          className={inputStyle}
        />
      </div>

      {/* Tipo y Moneda */}
      <div className="flex flex-col gap-4">
        <div>
          <label className="text-sm text-gray-200">Tipo de salario</label>
          <select
            name="type"
            value={newSalary.type}
            onChange={handleChange}
            className={inputStyle}
          >
            <option value="">Seleccionar</option>
            <option value="Base">Base</option>
            <option value="Hora">Por hora</option>
            <option value="Contrato">Contrato</option>
          </select>
        </div>

        <div>
          <label className="text-sm text-gray-200">Moneda</label>
          <select
            name="currency"
            value={newSalary.currency}
            onChange={handleChange}
            className={inputStyle}
          >
            <option value="">Seleccionar</option>
            <option value="CRC">CRC</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </select>
        </div>
      </div>

      {/* Botón */}
      <PrimaryButton
        type="submit"
        className="w-full py-2 rounded-lg text-sm font-semibold hover:scale-[1.02] active:scale-[0.98] transition"
      >
        Agregar salario
      </PrimaryButton>
    </form>
  );
};

export default SalaryAdd;
