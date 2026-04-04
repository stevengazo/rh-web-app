import { useState } from 'react';
import toast from 'react-hot-toast';
import questionCategoryApi from '../../api/QuestionCategories';

const AddQuestionCategory = () => {
  const [newQuestion, setNewQuestion] = useState({
    questionCategoryId: 0,
    name: '',
    isActive: true,
    questions: [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const notify = () => toast.success('Agregado');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setNewQuestion((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await questionCategoryApi.createQuestionCategory(newQuestion);

      setNewQuestion({
        questionCategoryId: 0,
        name: '',
        isActive: true,
        questions: [],
      });

      notify();
    } catch (err) {
      console.error(err);
      setError('Error al crear la categoría');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <form
        onSubmit={handleSubmit}
        className="space-y-4   "
      >
        <h3 className="text-sm font-semibold text-gray-200">
          Nueva Categoría
        </h3>

        {/* Nombre */}
        <div className="space-y-1">
          <label className="text-xs text-gray-400">
            Nombre
          </label>
          <input
            type="text"
            name="name"
            value={newQuestion.name}
            onChange={handleChange}
            required
            className="w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-100
              placeholder-gray-500
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Nombre de la categoría..."
          />
        </div>

        {/* Activo */}
        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            name="isActive"
            checked={newQuestion.isActive}
            onChange={handleChange}
            className="h-4 w-4 rounded border-gray-600 bg-gray-800 text-blue-500
              focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-xs text-gray-400">
            Activa
          </span>
        </div>

        {/* Error */}
        {error && (
          <p className="rounded-md bg-red-900/40 border border-red-700 px-3 py-2 text-xs text-red-300">
            {error}
          </p>
        )}

        {/* Botón */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white
              hover:bg-blue-600 transition
              disabled:opacity-50
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            {loading ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddQuestionCategory;