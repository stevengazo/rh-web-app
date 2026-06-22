const QuestionsTable = ({ Questions }) => {
  if (!Questions || Questions.length === 0) {
    return (
      <div className="text-center text-ink-muted py-6">
        No hay preguntas registradas.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl shadow-md border border-stroke-soft">
      <table className="min-w-full divide-y divide-stroke-soft">
        <thead className="bg-surface-alt">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold text-ink-secondary tracking-wide">
              Pregunta
            </th>
          </tr>
        </thead>

        <tbody className="bg-surface divide-y divide-stroke-soft">
          {Questions.map((q) => (
            <tr
              key={q.questionId}
              className="hover:bg-brand-tint transition-colors"
            >
              <td className="px-4 py-3 text-sm text-ink-secondary">{q.text}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QuestionsTable;
