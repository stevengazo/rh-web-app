import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

import kpiApi from '../../api/kpiApi';
import ObjetiveCategories from '../../api/ObjetiveCategories';
import { mensajeDeError } from '../../utils/apiError';

import Label from '../Label';
import TextInput from '../TextInput';
import SelectInput from '../SelectInput';
import CheckBoxInput from '../CheckBoxInput';
import PrimaryButton from '../PrimaryButton';
import SecondaryButton from '../SecondaryButton';

const areaClass =
  'w-full resize-none rounded-md border border-stroke border-b-2 border-b-ink-muted ' +
  'bg-surface px-3 py-2 text-sm text-ink placeholder:text-ink-muted ' +
  'transition-colors focus:border-b-brand focus:outline-none';

/**
 * Alta / edición de un objetivo (KPI).
 *
 * @param {object} [objetive]  Si viene, edita.
 * @param {() => void} [onSaved]
 * @param {() => void} [onCancel]
 */
const AddObjetive = ({ objetive, onSaved, onCancel }) => {
  const esEdicion = Boolean(objetive);

  const [form, setForm] = useState({
    title: objetive?.title ?? '',
    description: objetive?.description ?? '',
    isActive: objetive?.isActive ?? true,
    objetiveCategoryId: objetive?.objetiveCategoryId
      ? String(objetive.objetiveCategoryId)
      : '',
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    ObjetiveCategories.getAllObjetiveCategories()
      .then((r) => setCategories(Array.isArray(r.data) ? r.data : []))
      .catch((e) => console.error('Error cargando categorías', e));
  }, []);

  const categoriasActivas = useMemo(
    () => categories.filter((c) => c.isActive || String(c.objetiveCategoryId) === form.objetiveCategoryId),
    [categories, form.objetiveCategoryId]
  );

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.title.trim()) {
      setError('El título es obligatorio.');
      return;
    }

    setLoading(true);
    try {
      const dto = {
        title: form.title.trim(),
        description: form.description.trim() || null,
        isActive: form.isActive,
        objetiveCategoryId: form.objetiveCategoryId
          ? Number(form.objetiveCategoryId)
          : null,
      };

      if (esEdicion) {
        await kpiApi.updateKPI(objetive.objetiveId, dto);
        toast.success('Objetivo actualizado.');
      } else {
        await kpiApi.createKPI(dto);
        toast.success('Objetivo creado.');
      }
      onSaved?.();
    } catch (err) {
      console.error(err);
      setError(mensajeDeError(err, 'No se pudo guardar el objetivo.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 text-ink">
      <div>
        <h2 className="text-lg font-semibold">
          {esEdicion ? 'Editar objetivo' : 'Nuevo objetivo'}
        </h2>
        <p className="mt-1 text-xs text-ink-muted">
          Un indicador de rendimiento que luego se asigna a colaboradores.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      <div>
        <Label htmlFor="obj-title">Título *</Label>
        <TextInput
          id="obj-title"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Ej: Cierre mensual de ventas"
        />
      </div>

      <div>
        <Label htmlFor="obj-desc">Descripción</Label>
        <textarea
          id="obj-desc"
          name="description"
          rows={3}
          value={form.description}
          onChange={handleChange}
          placeholder="Qué se espera lograr y cómo se mide"
          className={areaClass}
        />
      </div>

      <div>
        <Label htmlFor="obj-cat">Categoría</Label>
        <SelectInput
          id="obj-cat"
          name="objetiveCategoryId"
          value={form.objetiveCategoryId}
          onChange={handleChange}
        >
          <option value="">Sin categoría</option>
          {categoriasActivas.map((c) => (
            <option key={c.objetiveCategoryId} value={c.objetiveCategoryId}>
              {c.name}
            </option>
          ))}
        </SelectInput>
      </div>

      <CheckBoxInput
        label="Activo"
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
            'Crear objetivo'
          )}
        </PrimaryButton>
      </div>
    </form>
  );
};

export default AddObjetive;
