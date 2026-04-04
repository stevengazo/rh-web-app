import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import questionApi from '../../api/questionsApi';
import questionCategoryApi from '../../api/QuestionCategories';

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
        <h3 className="text-sm font-semibold text-gray-200">Nueva Pregunta</h3>

        {/* Pregunta */}
        <div className="space-y-1">
          <label className="text-xs text-gray-400">Pregunta</label>
          <input
            type="text"
            name="text"
            value={question.text}
            onChange={handleChange}
            required
            className="w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-100
              placeholder-gray-500
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Escribe la pregunta..."
          />
        </div>

        {/* Categoría */}
        <div className="space-y-1">
          <label className="text-xs text-gray-400">Categoría</label>
          <select
            name="questionCategoryId"
            value={question.questionCategoryId}
            onChange={handleChange}
            required
            className="w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-100
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="" className="bg-gray-800">
              Seleccione una categoría
            </option>
            {categories.map((c) => (
              <option
                key={c.questionCategoryId}
                value={c.questionCategoryId}
                className="bg-gray-800"
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
            className="h-4 w-4 rounded border-gray-600 bg-gray-800 text-blue-500
              focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-xs text-gray-400">Activo</span>
        </div>

        {/* Botón */}
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white
              hover:bg-blue-600 transition
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddQuestion;
