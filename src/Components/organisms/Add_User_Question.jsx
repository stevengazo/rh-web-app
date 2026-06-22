import { useEffect, useState } from 'react';
import user_questionApi from '../../api/user_questionApi';
import employeesApi from '../../api/employeesApi';
import questionApi from '../../api/questionsApi';
import toast from 'react-hot-toast';
import PrimaryButton from '../PrimaryButton';

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
      <form onSubmit={handleSubmit} className="space-y-4 bg-surface p-4 ">
        <h3 className="text-sm font-semibold text-ink">
          Asignar Pregunta
        </h3>

        {/* Error */}
        {error && (
          <p className="rounded-md bg-red-50 border border-transparent px-3 py-2 text-xs text-red-700">
            {error}
          </p>
        )}

        {/* Empleado */}
        <div className="space-y-1">
          <label className="text-xs text-ink-muted">Empleado</label>
          <select
            name="userId"
            value={newUserQuestion.userId}
            onChange={handleChange}
            disabled={loading}
            required
            className="w-full rounded-md border border-stroke bg-surface px-3 py-2 text-sm text-ink
              disabled:opacity-50
              focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand"
          >
            <option value="" className="bg-surface">
              Seleccione un empleado
            </option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id} className="bg-surface">
                {emp.fullName ?? `${emp.firstName} ${emp.lastName}`}
              </option>
            ))}
          </select>
        </div>

        {/* Pregunta */}
        <div className="space-y-1">
          <label className="text-xs text-ink-muted">Pregunta</label>
          <select
            name="questionId"
            value={newUserQuestion.questionId}
            onChange={handleChange}
            disabled={loading}
            required
            className="w-full rounded-md border border-stroke bg-surface px-3 py-2 text-sm text-ink
              disabled:opacity-50
              focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand"
          >
            <option value="" className="bg-surface">
              Seleccione una pregunta
            </option>
            {questions.map((q) => (
              <option
                key={q.questionId}
                value={q.questionId}
                className="bg-surface"
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
            className="h-4 w-4 rounded border-stroke bg-surface text-brand
              focus:ring-2 focus:ring-brand"
          />
          <span className="text-xs text-ink-muted">Eliminado</span>
        </div>

        {/* Botón */}
        <div className="flex justify-end pt-2">
          <PrimaryButton type="submit" disabled={loading}>
            {loading ? 'Guardando...' : 'Asignar'}
          </PrimaryButton>
        </div>
      </form>
    </div>
  );
};

export default Add_User_Question;
