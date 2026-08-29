import { useState } from 'react';
import resultsApi from '../../api/resultsApi';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import PrimaryButton from '../PrimaryButton';

const ResultAdd = ({ user_ObjetiveId, onSuccess }) => {
  const [formData, setFormData] = useState({
    evaluation: '',
    resultDate: null, // ahora es Date
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({
      ...prev,
      resultDate: date,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.evaluation || !formData.resultDate) {
      setError('Todos los campos son obligatorios');
      return;
    }

    try {
      setLoading(true);

      const payload = {
        evaluation: Number(formData.evaluation),
        resultDate: formData.resultDate.toISOString(), // 🔑 importante
        user_ObjetiveId,
      };

      await resultsApi.createResult(payload);

      setFormData({
        evaluation: '',
        resultDate: null,
      });

      onSuccess?.();
    } catch (err) {
      console.error(err);
      setError('Error al guardar el resultado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border p-3 rounded-xl border-stroke"
    >
      {/* Title */}
      <div>
        <h2 className="text-lg font-semibold text-ink dark:text-gray-100">
          Agregar Resultado
        </h2>
        <p className="text-sm text-ink-muted dark:text-gray-400">
          Registra una nueva evaluación del objetivo.
        </p>
      </div>

      {/* Evaluación */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-ink-secondary dark:text-gray-300">
          Evaluación
        </label>

        <input
          type="number"
          name="evaluation"
          value={formData.evaluation}
          onChange={handleChange}
          placeholder="Ej: 85"
          className="
            w-full
            border border-stroke dark:border-gray-700
            bg-surface dark:bg-gray-950
            rounded-md
            px-3 py-2
            text-sm
            focus:outline-none
            focus:ring-2
            focus:ring-brand
            focus:border-brand
            transition
          "
        />
      </div>

      {/* DatePicker */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-ink-secondary dark:text-gray-300">
          Fecha del resultado
        </label>

        <DatePicker
          selected={formData.resultDate}
          onChange={handleDateChange}
          dateFormat="yyyy-MM-dd"
          placeholderText="Selecciona una fecha"
          className="
            w-full
            border border-stroke dark:border-gray-700
            bg-surface dark:bg-gray-950
            rounded-md
            px-3 py-2
            text-sm
            text-ink dark:text-gray-200
            focus:outline-none
            focus:ring-2
            focus:ring-brand
            focus:border-brand
          "
          calendarClassName="bg-surface text-ink border border-stroke rounded-xl"
        />
      </div>

      {/* Error */}
      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
          {error}
        </div>
      )}

      {/* Button */}
      <div className="flex justify-end">
        <PrimaryButton type="submit" disabled={loading} className="my-2">
          {loading && (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          )}

          {loading ? 'Guardando...' : 'Guardar'}
        </PrimaryButton>
      </div>
    </form>
  );
};

export default ResultAdd;