import { useState } from 'react';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

import psychometricTestsApi from '../../../api/psychometricTestsApi';
import { mensajeDeError } from '../../../utils/apiError';

import Label from '../../Label';
import TextInput from '../../TextInput';
import PrimaryButton from '../../PrimaryButton';
import SecondaryButton from '../../SecondaryButton';

const areaClass =
  'w-full resize-none rounded-md border border-stroke border-b-2 border-b-ink-muted ' +
  'bg-surface px-3 py-2 text-sm text-ink placeholder:text-ink-muted ' +
  'transition-colors focus:border-b-brand focus:outline-none';

/**
 * Alta / edición de una dimensión de la prueba.
 *
 * @param {number} testId
 * @param {object} [dimension]
 * @param {number} [nextOrder]  Orden sugerido para una nueva.
 * @param {()=>void} [onSaved]
 * @param {()=>void} [onCancel]
 */
const DimensionForm = ({ testId, dimension, nextOrder = 0, onSaved, onCancel }) => {
  const esEdicion = Boolean(dimension);

  const [form, setForm] = useState({
    name: dimension?.name ?? '',
    description: dimension?.description ?? '',
    displayOrder: dimension?.displayOrder ?? nextOrder,
    lowLabel: dimension?.lowLabel ?? '',
    midLabel: dimension?.midLabel ?? '',
    highLabel: dimension?.highLabel ?? '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.name.trim()) {
      setError('El nombre de la dimensión es obligatorio.');
      return;
    }

    setLoading(true);
    try {
      const dto = {
        name: form.name.trim(),
        description: form.description.trim() || null,
        displayOrder: Number(form.displayOrder) || 0,
        lowLabel: form.lowLabel.trim() || null,
        midLabel: form.midLabel.trim() || null,
        highLabel: form.highLabel.trim() || null,
      };

      if (esEdicion) {
        await psychometricTestsApi.updateDimension(
          testId,
          dimension.psychometricDimensionId,
          dto
        );
      } else {
        await psychometricTestsApi.addDimension(testId, dto);
      }

      toast.success(esEdicion ? 'Dimensión actualizada.' : 'Dimensión agregada.');
      onSaved?.();
    } catch (err) {
      console.error(err);
      setError(mensajeDeError(err, 'No se pudo guardar la dimensión.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 text-ink">
      <div>
        <h2 className="text-lg font-semibold">
          {esEdicion ? 'Editar dimensión' : 'Nueva dimensión'}
        </h2>
        <p className="mt-1 text-xs text-ink-muted">
          Un rasgo o escala hacia el que puntúan sus ítems.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label htmlFor="dim-name">Nombre *</Label>
          <TextInput
            id="dim-name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Ej: Estabilidad emocional"
          />
        </div>

        <div>
          <Label htmlFor="dim-order">Orden</Label>
          <TextInput
            id="dim-order"
            name="displayOrder"
            type="number"
            min="0"
            value={form.displayOrder}
            onChange={handleChange}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="dim-desc">Descripción</Label>
        <textarea
          id="dim-desc"
          name="description"
          rows={2}
          value={form.description}
          onChange={handleChange}
          className={areaClass}
        />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div>
          <Label htmlFor="dim-low">Glosa puntaje bajo</Label>
          <TextInput id="dim-low" name="lowLabel" value={form.lowLabel} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="dim-mid">Glosa puntaje medio</Label>
          <TextInput id="dim-mid" name="midLabel" value={form.midLabel} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="dim-high">Glosa puntaje alto</Label>
          <TextInput id="dim-high" name="highLabel" value={form.highLabel} onChange={handleChange} />
        </div>
      </div>

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

export default DimensionForm;
