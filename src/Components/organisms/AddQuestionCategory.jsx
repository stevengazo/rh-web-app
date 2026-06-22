import { useState } from 'react';
import toast from 'react-hot-toast';
import questionCategoryApi from '../../api/QuestionCategories';
import PrimaryButton from '../PrimaryButton';

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
      <form onSubmit={handleSubmit} className="space-y-4   ">
        <h3 className="text-sm font-semibold text-ink">Nueva Categoría</h3>

        {/* Nombre */}
        <div className="space-y-1">
          <label className="text-xs text-ink-muted">Nombre</label>
          <input
            type="text"
            name="name"
            value={newQuestion.name}
            onChange={handleChange}
            required
            className="w-full rounded-md border border-stroke bg-surface px-3 py-2 text-sm text-ink
              placeholder:text-ink-muted
              focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand"
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
            className="h-4 w-4 rounded border-stroke bg-surface text-brand
              focus:ring-2 focus:ring-brand"
          />
          <span className="text-xs text-ink-muted">Activa</span>
        </div>

        {/* Error */}
        {error && (
          <p className="rounded-md bg-red-50 border border-transparent px-3 py-2 text-xs text-red-700">
            {error}
          </p>
        )}

        {/* Botón */}
        <div className="flex justify-end pt-2">
          <PrimaryButton type="submit" disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar'}
          </PrimaryButton>
        </div>
      </form>
    </div>
  );
};

export default AddQuestionCategory;
