import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

import questionApi from '../../api/questionsApi';
import questionCategoryApi from '../../api/QuestionCategories';
import { mensajeDeError } from '../../utils/apiError';

import Label from '../Label';
import TextInput from '../TextInput';
import SelectInput from '../SelectInput';
import CheckBoxInput from '../CheckBoxInput';
import PrimaryButton from '../PrimaryButton';
import SecondaryButton from '../SecondaryButton';

/**
 * Alta / edición de una pregunta de desempeño.
 *
 * @param {object} [question]  Si viene, edita.
 * @param {() => void} [onSaved]
 * @param {() => void} [onCancel]
 */
const AddQuestion = ({ question, onSaved, onCancel }) => {
  const esEdicion = Boolean(question);

  const [form, setForm] = useState({
    text: question?.text ?? '',
    isActive: question?.isActive ?? true,
    questionCategoryId: question?.questionCategoryId
      ? String(question.questionCategoryId)
      : '',
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    questionCategoryApi
      .getAllQuestionCategories()
      .then((r) => setCategories(Array.isArray(r.data) ? r.data : []))
      .catch((e) => console.error('Error cargando categorías', e));
  }, []);

  const categoriasActivas = useMemo(
    () =>
      categories.filter(
        (c) =>
          c.isActive || String(c.questionCategoryId) === form.questionCategoryId
      ),
    [categories, form.questionCategoryId]
  );

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.text.trim()) {
      setError('El texto de la pregunta es obligatorio.');
      return;
    }
    if (!form.questionCategoryId) {
      setError('Selecciona una categoría.');
      return;
    }

    setLoading(true);
    try {
      const dto = {
        text: form.text.trim(),
        isActive: form.isActive,
        questionCategoryId: Number(form.questionCategoryId),
      };

      if (esEdicion) {
        await questionApi.updateQuestion(question.questionId, dto);
        toast.success('Pregunta actualizada.');
      } else {
        await questionApi.createQuestion(dto);
        toast.success('Pregunta creada.');
      }
      onSaved?.();
    } catch (err) {
      console.error(err);
      setError(mensajeDeError(err, 'No se pudo guardar la pregunta.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 text-ink">
      <div>
        <h2 className="text-lg font-semibold">
          {esEdicion ? 'Editar pregunta' : 'Nueva pregunta'}
        </h2>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      <div>
        <Label htmlFor="q-text">Pregunta *</Label>
        <TextInput
          id="q-text"
          name="text"
          value={form.text}
          onChange={handleChange}
          placeholder="Ej: ¿Cumple con los plazos acordados?"
        />
      </div>

      <div>
        <Label htmlFor="q-cat">Categoría *</Label>
        <SelectInput
          id="q-cat"
          name="questionCategoryId"
          value={form.questionCategoryId}
          onChange={handleChange}
        >
          <option value="">Selecciona una categoría…</option>
          {categoriasActivas.map((c) => (
            <option key={c.questionCategoryId} value={c.questionCategoryId}>
              {c.name}
            </option>
          ))}
        </SelectInput>
      </div>

      <CheckBoxInput
        label="Activa"
        name="isActive"
        checked={form.isActive}
        onChange={handleChange}
      />

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
          ) : esEdicion ? (
            'Guardar cambios'
          ) : (
            'Crear pregunta'
          )}
        </PrimaryButton>
      </div>
    </form>
  );
};

export default AddQuestion;
