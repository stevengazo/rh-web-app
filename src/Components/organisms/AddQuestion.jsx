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

  const notify = () => toast.success('Agregado');

  const [categories, setCategories] = useState([]);

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
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Texto de la pregunta */}
      <div>
        <label className="block mb-1">Pregunta</label>
        <input
          type="text"
          name="text"
          value={question.text}
          onChange={handleChange}
          className="border border-gray-300 rounded px-2 py-1 w-full"
          required
        />
      </div>

      {/* Categoría */}
      <div>
        <label className="block mb-1">Categoría</label>
        <select
          name="questionCategoryId"
          value={question.questionCategoryId}
          onChange={handleChange}
          className="border border-gray-300 rounded px-2 py-1 w-full"
          required
        >
          <option value="">Seleccione una categoría</option>
          {categories.map((c) => (
            <option key={c.questionCategoryId} value={c.questionCategoryId}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Activo */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          name="isActive"
          checked={question.isActive}
          onChange={handleChange}
        />
        <label>Activo</label>
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Guardar Pregunta
      </button>
    </form>
  );
};

export default AddQuestion;
