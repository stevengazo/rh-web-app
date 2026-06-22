import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import questionApi from '../../api/questionsApi';
import questionCategoryApi from '../../api/QuestionCategories';
import PrimaryButton from '../PrimaryButton';

const AddQuestion = () => {
  const [question, setQuestion] = useState({
    questionId: 0,
    text: '',
    isActive: true,
    questionCategoryId: '',
    questionCategory: null,
    user_Questions: [],
    user_Objetive: null,
  });

  const [categories, setCategories] = useState([]);

  const notify = () => toast.success('Agregado');

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await questionCategoryApi.getAllQuestionCategories();
        setCategories(response.data);
      } catch (error) {
        console.error('Error cargando categorías', error);
      }
    };
    getData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setQuestion((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await questionApi.createQuestion(question);
      notify();
    } catch (error) {
      console.error('Error al crear la pregunta', error);
      toast.error('Error al guardar');
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-4 ">
        <h3 className="text-sm font-semibold text-ink">Nueva Pregunta</h3>

        {/* Pregunta */}
        <div className="space-y-1">
          <label className="text-xs text-ink-muted">Pregunta</label>
          <input
            type="text"
            name="text"
            value={question.text}
            onChange={handleChange}
            required
            className="w-full rounded-md border border-stroke bg-surface px-3 py-2 text-sm text-ink
              placeholder:text-ink-muted
              focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand"
            placeholder="Escribe la pregunta..."
          />
        </div>

        {/* Categoría */}
        <div className="space-y-1">
          <label className="text-xs text-ink-muted">Categoría</label>
          <select
            name="questionCategoryId"
            value={question.questionCategoryId}
            onChange={handleChange}
            required
            className="w-full rounded-md border border-stroke bg-surface px-3 py-2 text-sm text-ink
              focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand"
          >
            <option value="" className="bg-surface">
              Seleccione una categoría
            </option>
            {categories.map((c) => (
              <option
                key={c.questionCategoryId}
                value={c.questionCategoryId}
                className="bg-surface"
              >
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Activo */}
        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            name="isActive"
            checked={question.isActive}
            onChange={handleChange}
            className="h-4 w-4 rounded border-stroke bg-surface text-brand
              focus:ring-2 focus:ring-brand"
          />
          <span className="text-xs text-ink-muted">Activo</span>
        </div>

        {/* Botón */}
        <div className="pt-2 flex justify-end">
          <PrimaryButton type="submit">
            Guardar
          </PrimaryButton>
        </div>
      </form>
    </div>
  );
};

export default AddQuestion;
