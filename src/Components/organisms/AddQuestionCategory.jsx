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

    const notify = () => toast.success('Agregado');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

      // Reset form
      setNewQuestion({
        questionCategoryId: 0,
        name: '',
        isActive: true,
        questions: [],
      });
      notify();
    } catch (err) {
      setError('Error al crear la categoría');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md space-y-4 rounded-lg border  border-gray-300 p-4"
    >
      <div>
        <label className="block text-sm font-medium">Nombre</label>
        <input
          type="text"
          name="name"
          value={newQuestion.name}
          onChange={handleChange}
          className="w-full rounded border border-gray-200  px-3 py-2"
          required
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          name="isActive"
          checked={newQuestion.isActive}
          onChange={handleChange}
        />
        <label className="text-sm">Activo</label>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
      >
        {loading ? 'Guardando...' : 'Guardar categoría'}
      </button>
    </form>
  );
};

export default AddQuestionCategory;
