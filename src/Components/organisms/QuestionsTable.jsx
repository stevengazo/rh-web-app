const QuestionsTable = ({ Questions }) => {
  if (!Questions || Questions.length === 0) {
    return (
      <div className="text-center text-gray-500 py-6">
        No hay preguntas registradas.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl shadow-md border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gradient-to-r from-blue-600 to-blue-500">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold text-white tracking-wide">
              Pregunta
            </th>
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-gray-100">
          {Questions.map((q) => (
            <tr
              key={q.questionId}
              className="hover:bg-blue-50 transition-colors"
            >
              <td className="px-4 py-3 text-sm text-gray-700">
                {q.text}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QuestionsTable;
