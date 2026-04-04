import { useEffect, useState } from 'react';
import user_questionApi from '../../api/user_questionApi';
import employeesApi from '../../api/employeesApi';
import questionApi from '../../api/questionsApi';
import toast from 'react-hot-toast';

const Add_User_Question = () => {
  const [employees, setEmployees] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const notify = () => toast.success('Agregado');

  const [newUserQuestion, setNewUserQuestion] = useState({
    user_QuestionId: 0,
    userId: '',
    user: null,
    questionId: '',
    question: null,
    deleted: false,
    answers: [],
  });

  useEffect(() => {
    const getData = async () => {
      try {
        const [respEmployees, respQuestions] = await Promise.all([
          employeesApi.getAllEmployees(),
          questionApi.getAllQuestions(),
        ]);

        setEmployees(respEmployees.data);
        setQuestions(respQuestions.data);
      } catch (error) {
        console.error('Error cargando datos', error);
        setError('Error cargando datos');
      }
    };

    getData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setNewUserQuestion((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newUserQuestion.userId || !newUserQuestion.questionId) {
      setError('Debe seleccionar empleado y pregunta');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await user_questionApi.createUser_Question(newUserQuestion);

      notify();

      setNewUserQuestion({
        user_QuestionId: 0,
        userId: '',
        user: null,
        questionId: '',
        question: null,
        deleted: false,
        answers: [],
      });
    } catch (error) {
      console.error('Error al asignar la pregunta', error);
      setError('Error al asignar la pregunta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-gray-900 p-4 rounded-xl border border-gray-700"
      >
        <h3 className="text-sm font-semibold text-gray-200">
          Asignar Pregunta
        </h3>

        {/* Error */}
        {error && (
          <p className="rounded-md bg-red-900/40 border border-red-700 px-3 py-2 text-xs text-red-300">
            {error}
          </p>
        )}

        {/* Empleado */}
        <div className="space-y-1">
          <label className="text-xs text-gray-400">
            Empleado
          </label>
          <select
            name="userId"
            value={newUserQuestion.userId}
            onChange={handleChange}
            disabled={loading}
            required
            className="w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-100
              disabled:opacity-50
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="" className="bg-gray-800">
              Seleccione un empleado
            </option>
            {employees.map((emp) => (
              <option
                key={emp.id}
                value={emp.id}
                className="bg-gray-800"
              >
                {emp.fullName ?? `${emp.firstName} ${emp.lastName}`}
              </option>
            ))}
          </select>
        </div>

        {/* Pregunta */}
        <div className="space-y-1">
          <label className="text-xs text-gray-400">
            Pregunta
          </label>
          <select
            name="questionId"
            value={newUserQuestion.questionId}
            onChange={handleChange}
            disabled={loading}
            required
            className="w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-100
              disabled:opacity-50
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="" className="bg-gray-800">
              Seleccione una pregunta
            </option>
            {questions.map((q) => (
              <option
                key={q.questionId}
                value={q.questionId}
                className="bg-gray-800"
              >
                {q.text}
              </option>
            ))}
          </select>
        </div>

        {/* Eliminado */}
        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            name="deleted"
            checked={newUserQuestion.deleted}
            onChange={handleChange}
            className="h-4 w-4 rounded border-gray-600 bg-gray-800 text-blue-500
              focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-xs text-gray-400">
            Eliminado
          </span>
        </div>

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
            {loading ? 'Guardando...' : 'Asignar'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Add_User_Question;