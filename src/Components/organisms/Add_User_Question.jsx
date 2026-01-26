import { useEffect, useState } from 'react';
import user_questionApi from '../../api/user_questionApi';
import employeesApi from '../../api/employeesApi';
import questionApi from '../../api/questionsApi';
import toast from 'react-hot-toast';

const Add_User_Question = () => {
  const [employees, setEmployees] = useState([]);
  const [questions, setQuestions] = useState([]);

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
        // Employees
        const respEmployees = await employeesApi.getAllEmployees();
        setEmployees(respEmployees.data);

        // Questions
        const respQuestions = await questionApi.getAllQuestions();
        setQuestions(respQuestions.data);
      } catch (error) {
        console.error('Error cargando datos', error);
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
    console.log(newUserQuestion);
    try {
      await user_questionApi.createUser_Question(newUserQuestion);
      console.log('Pregunta asignada al usuario correctamente');
      notify();
      // Reset form
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
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Usuario */}
      <div>
        <label className="block mb-1">Empleado</label>
        <select
          name="userId"
          value={newUserQuestion.userId}
          onChange={handleChange}
          className="border border-gray-300 px-2 py-1 w-full"
          required
        >
          <option value="">Seleccione un empleado</option>
          {employees.map((emp) => (
            <option key={emp.userId} value={emp.id}>
              {emp.fullName ?? `${emp.firstName} ${emp.lastName}`}
            </option>
          ))}
        </select>
      </div>

      {/* Pregunta */}
      <div>
        <label className="block mb-1">Pregunta</label>
        <select
          name="questionId"
          value={newUserQuestion.questionId}
          onChange={handleChange}
          className="border border-gray-300 rounded px-2 py-1 w-full"
          required
        >
          <option value="">Seleccione una pregunta</option>
          {questions.map((q) => (
            <option key={q.questionId} value={q.questionId}>
              {q.text}
            </option>
          ))}
        </select>
      </div>

      {/* Eliminado */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          name="deleted"
          checked={newUserQuestion.deleted}
          onChange={handleChange}
        />
        <label>Eliminado</label>
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Asignar Pregunta
      </button>
    </form>
  );
};

export default Add_User_Question;
