import { useNavigate } from 'react-router-dom';

const QuestionsByUser = ({ QuestionsByUser = [], Employees = [] }) => {
  const navigate = useNavigate();

  console.log("questionsbyuser", QuestionsByUser)
  if (!QuestionsByUser.length) {
    return (
      <p className="text-center text-gray-500 py-6">
        No hay preguntas asignadas.
      </p>
    );
  }

  const groupedByUser = QuestionsByUser.reduce((acc, item) => {
    const userId = String(item.userId);

    if (!acc[userId]) {
      acc[userId] = [];
    }

    acc[userId].push(item);
    return acc;
  }, {});

  const getEmployeeName = (userId) => {
    const employee = Employees.find((e) => e.id == userId);

    if (!employee) return 'Empleado no encontrado';

    return (
      employee.fullName ??
      employee.userName ??
      `${employee.name ?? ''} ${employee.lastName ?? ''}`.trim()
    );
  };

  return (
    <div className="space-y-4">
      {Object.entries(groupedByUser).map(([userId, questions]) => (
        <div
          key={userId}
          className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
        >
          {/* Usuario */}
          <h4
            className="mb-3 cursor-pointer text-sm font-semibold text-gray-700 transition hover:text-blue-600"
            onClick={() => navigate(`/manager/perfornance/${userId}`)}
          >
            {getEmployeeName(userId)}
            <span className="ml-2 font-mono text-xs text-gray-400">
              ({userId})
            </span>
          </h4>

          {/* Preguntas */}
          <ul className="space-y-2">
            {questions.map((q) => (
              <li
                key={q.user_QuestionId}
                className="rounded-lg bg-gray-50 p-3 text-sm"
              >
                <p className="font-medium text-gray-800">
                  {q.question?.text ?? 'Pregunta no disponible'}
                </p>

                <p className="text-xs text-gray-500">
                  {q.deleted ? 'Inactiva' : 'Activa'}
                </p>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default QuestionsByUser;
