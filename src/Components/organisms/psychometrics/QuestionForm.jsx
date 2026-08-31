import { useState } from 'react';
import toast from 'react-hot-toast';
import { Loader2, Plus, Trash2 } from 'lucide-react';

import psychometricTestsApi from '../../../api/psychometricTestsApi';
import { mensajeDeError } from '../../../utils/apiError';
import { QUESTION_KIND } from '../../../utils/psychometricStatus';

import Label from '../../Label';
import TextInput from '../../TextInput';
import SelectInput from '../../SelectInput';
import CheckBoxInput from '../../CheckBoxInput';
import PrimaryButton from '../../PrimaryButton';
import SecondaryButton from '../../SecondaryButton';

const areaClass =
  'w-full resize-none rounded-md border border-stroke border-b-2 border-b-ink-muted ' +
  'bg-surface px-3 py-2 text-sm text-ink placeholder:text-ink-muted ' +
  'transition-colors focus:border-b-brand focus:outline-none';

const opcionVacia = () => ({ text: '', score: 0 });

/**
 * Alta / edición de un ítem del cuestionario.
 *
 * @param {number} testId
 * @param {Array} dimensions   Dimensiones de la prueba.
 * @param {object} [question]
 * @param {number} [nextOrder]
 * @param {boolean} [locked]   La prueba ya tiene respuestas: solo texto y orden.
 * @param {()=>void} [onSaved]
 * @param {()=>void} [onCancel]
 */
const QuestionForm = ({
  testId,
  dimensions = [],
  question,
  nextOrder = 0,
  locked = false,
  onSaved,
  onCancel,
}) => {
  const esEdicion = Boolean(question);

  const [form, setForm] = useState({
    text: question?.text ?? '',
    questionType: question?.questionType ?? QUESTION_KIND.LIKERT5,
    reverseScored: question?.reverseScored ?? false,
    dimensionId: question?.psychometricDimensionId
      ? String(question.psychometricDimensionId)
      : '',
    displayOrder: question?.displayOrder ?? nextOrder,
  });
  const [options, setOptions] = useState(
    question?.options?.length
      ? question.options.map((o) => ({ text: o.text ?? '', score: o.score ?? 0 }))
      : [opcionVacia(), opcionVacia()]
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const esMC = form.questionType === QUESTION_KIND.MULTIPLE_CHOICE;

  const set = (name, value) => setForm((prev) => ({ ...prev, [name]: value }));

  const setOpcion = (i, patch) =>
    setOptions((prev) => prev.map((o, j) => (j === i ? { ...o, ...patch } : o)));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.text.trim()) {
      setError('El texto del ítem es obligatorio.');
      return;
    }

    const opcionesLimpias = options
      .map((o) => ({ text: o.text.trim(), score: Number(o.score) || 0 }))
      .filter((o) => o.text);

    if (esMC && opcionesLimpias.length < 2) {
      setError('Un ítem de opción múltiple necesita al menos dos opciones.');
      return;
    }

    setLoading(true);
    try {
      const dto = {
        text: form.text.trim(),
        questionType: form.questionType,
        reverseScored: !esMC && form.reverseScored,
        psychometricDimensionId: form.dimensionId ? Number(form.dimensionId) : null,
        displayOrder: Number(form.displayOrder) || 0,
        options: esMC
          ? opcionesLimpias.map((o, i) => ({ ...o, displayOrder: i }))
          : [],
      };

      if (esEdicion) {
        await psychometricTestsApi.updateQuestion(
          testId,
          question.psychometricQuestionId,
          dto
        );
      } else {
        await psychometricTestsApi.addQuestion(testId, dto);
      }

      toast.success(esEdicion ? 'Ítem actualizado.' : 'Ítem agregado.');
      onSaved?.();
    } catch (err) {
      console.error(err);
      setError(mensajeDeError(err, 'No se pudo guardar el ítem.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 text-ink">
      <div>
        <h2 className="text-lg font-semibold">
          {esEdicion ? 'Editar ítem' : 'Nuevo ítem'}
        </h2>
        {locked && (
          <p className="mt-1 text-xs text-amber-700">
            La prueba ya tiene respuestas: solo se puede corregir el texto y el orden.
          </p>
        )}
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      <div>
        <Label htmlFor="q-text">Enunciado *</Label>
        <textarea
          id="q-text"
          rows={2}
          value={form.text}
          onChange={(e) => set('text', e.target.value)}
          placeholder="Ej: Mantengo la calma bajo presión"
          className={areaClass}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="q-type">Tipo</Label>
          <SelectInput
            id="q-type"
            value={form.questionType}
            onChange={(e) => set('questionType', e.target.value)}
            disabled={locked}
          >
            <option value={QUESTION_KIND.LIKERT5}>Likert 1–5</option>
            <option value={QUESTION_KIND.MULTIPLE_CHOICE}>Opción múltiple</option>
          </SelectInput>
        </div>

        <div>
          <Label htmlFor="q-dim">Dimensión</Label>
          <SelectInput
            id="q-dim"
            value={form.dimensionId}
            onChange={(e) => set('dimensionId', e.target.value)}
            disabled={locked}
          >
            <option value="">Sin dimensión (no puntúa)</option>
            {dimensions.map((d) => (
              <option key={d.psychometricDimensionId} value={d.psychometricDimensionId}>
                {d.name}
              </option>
            ))}
          </SelectInput>
        </div>

        <div>
          <Label htmlFor="q-order">Orden</Label>
          <TextInput
            id="q-order"
            type="number"
            min="0"
            value={form.displayOrder}
            onChange={(e) => set('displayOrder', e.target.value)}
          />
        </div>

        {!esMC && (
          <div className="flex items-end">
            <CheckBoxInput
              label="Ítem invertido (puntúa 6 − valor)"
              checked={form.reverseScored}
              onChange={(e) => set('reverseScored', e.target.checked)}
              disabled={locked}
            />
          </div>
        )}
      </div>

      {esMC && (
        <div className="rounded-xl border border-stroke-soft bg-surface-alt p-4">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-semibold text-ink">Opciones y puntaje</p>
            {!locked && (
              <button
                type="button"
                onClick={() => setOptions((prev) => [...prev, opcionVacia()])}
                className="inline-flex items-center gap-1 text-xs font-semibold text-brand hover:underline"
              >
                <Plus size={13} />
                Agregar opción
              </button>
            )}
          </div>

          <div className="space-y-2">
            {options.map((o, i) => (
              <div key={i} className="flex items-center gap-2">
                <TextInput
                  value={o.text}
                  onChange={(e) => setOpcion(i, { text: e.target.value })}
                  placeholder={`Opción ${i + 1}`}
                  disabled={locked}
                  className="flex-1"
                />
                <TextInput
                  type="number"
                  value={o.score}
                  onChange={(e) => setOpcion(i, { score: e.target.value })}
                  disabled={locked}
                  className="w-20"
                  aria-label={`Puntaje opción ${i + 1}`}
                />
                {!locked && options.length > 2 && (
                  <button
                    type="button"
                    onClick={() =>
                      setOptions((prev) => prev.filter((_, j) => j !== i))
                    }
                    aria-label="Quitar opción"
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-md text-ink-muted
                               transition-colors hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-end gap-3 border-t border-stroke-soft pt-4">
        {onCancel && (
          <SecondaryButton onClick={onCancel} disabled={loading}>
            Cancelar
          </SecondaryButton>
        )}
        <PrimaryButton type="submit" disabled={loading}>
          {loading ? (
            <>
              <Loader2 size={15} className="animate-spin" />
              Guardando…
            </>
          ) : (
            'Guardar'
          )}
        </PrimaryButton>
      </div>
    </form>
  );
};

export default QuestionForm;
