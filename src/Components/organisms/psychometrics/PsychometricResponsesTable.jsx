import { QUESTION_KIND, LIKERT_LABELS } from '../../../utils/psychometricStatus';

/**
 * Respuestas ítem por ítem de una aplicación (solo lectura, para RH).
 *
 * @param {Array} questions  Ítems de la prueba (con `options`).
 * @param {Array} dimensions Dimensiones (para el nombre).
 * @param {Array} responses  `[{ psychometricQuestionId, value, psychometricOptionId }]`
 */
const PsychometricResponsesTable = ({
  questions = [],
  dimensions = [],
  responses = [],
}) => {
  const dimNombre = new Map(
    dimensions.map((d) => [d.psychometricDimensionId, d.name])
  );
  const respPorItem = new Map(
    responses.map((r) => [r.psychometricQuestionId, r])
  );

  const textoRespuesta = (q) => {
    const r = respPorItem.get(q.psychometricQuestionId);
    if (!r) return '—';

    if (q.questionType === QUESTION_KIND.MULTIPLE_CHOICE) {
      const op = (q.options ?? []).find(
        (o) => o.psychometricOptionId === r.psychometricOptionId
      );
      return op ? `${op.text} (${op.score})` : '—';
    }

    if (r.value == null) return '—';
    const etiqueta = LIKERT_LABELS[r.value - 1] ?? '';
    const efectivo = q.reverseScored ? 6 - r.value : r.value;
    return `${r.value} · ${etiqueta}${q.reverseScored ? ` → ${efectivo}` : ''}`;
  };

  if (!questions.length) {
    return <p className="text-sm text-ink-muted">La prueba no tiene ítems.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-stroke-soft">
      <table className="min-w-full">
        <thead className="bg-surface-alt text-ink-secondary">
          <tr>
            <th className="px-4 py-2.5 text-left text-sm font-semibold">Ítem</th>
            <th className="px-4 py-2.5 text-left text-sm font-semibold">Dimensión</th>
            <th className="px-4 py-2.5 text-left text-sm font-semibold">Respuesta</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stroke-soft bg-surface">
          {questions.map((q) => (
            <tr key={q.psychometricQuestionId} className="hover:bg-canvas">
              <td className="px-4 py-2.5 text-sm text-ink">
                {q.text}
                {q.reverseScored && (
                  <span className="ml-1 rounded bg-amber-50 px-1 text-[11px] font-semibold text-amber-700">
                    invertido
                  </span>
                )}
              </td>
              <td className="px-4 py-2.5 text-sm text-ink-secondary">
                {dimNombre.get(q.psychometricDimensionId) ?? '—'}
              </td>
              <td className="px-4 py-2.5 text-sm text-ink-secondary">
                {textoRespuesta(q)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PsychometricResponsesTable;
