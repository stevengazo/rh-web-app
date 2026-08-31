import { useState } from 'react';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

import questionCategoryApi from '../../api/QuestionCategories';
import { mensajeDeError } from '../../utils/apiError';

import Label from '../Label';
import TextInput from '../TextInput';
import CheckBoxInput from '../CheckBoxInput';
import PrimaryButton from '../PrimaryButton';
import SecondaryButton from '../SecondaryButton';

/**
 * Alta / edición de una categoría de preguntas.
 *
 * @param {object} [category]
 * @param {() => void} [onSaved]
 * @param {() => void} [onCancel]
 */
const AddQuestionCategory = ({ category, onSaved, onCancel }) => {
  const esEdicion = Boolean(category);

  const [form, setForm] = useState({
    name: category?.name ?? '',
    isActive: category?.isActive ?? true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.name.trim()) {
      setError('El nombre es obligatorio.');
      return;
    }

    setLoading(true);
    try {
      const dto = { name: form.name.trim(), isActive: form.isActive };
      if (esEdicion) {
        await questionCategoryApi.updateQuestionCategory(
          category.questionCategoryId,
          dto
        );
        toast.success('Categoría actualizada.');
      } else {
        await questionCategoryApi.createQuestionCategory(dto);
        toast.success('Categoría creada.');
      }
      onSaved?.();
    } catch (err) {
      console.error(err);
      setError(mensajeDeError(err, 'No se pudo guardar la categoría.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 text-ink">
      <div>
        <h2 className="text-lg font-semibold">
          {esEdicion ? 'Editar categoría' : 'Nueva categoría de pregunta'}
        </h2>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      <div>
        <Label htmlFor="qcat-name">Nombre *</Label>
        <TextInput
          id="qcat-name"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Ej: Trabajo en equipo"
        />
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
          ) : (
            'Guardar'
          )}
        </PrimaryButton>
      </div>
    </form>
  );
};

export default AddQuestionCategory;
