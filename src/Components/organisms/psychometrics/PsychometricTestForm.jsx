import { useState } from 'react';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

import psychometricTestsApi from '../../../api/psychometricTestsApi';
import { useAppContext } from '../../../context/AppContext';
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
 * Alta / edición de los datos generales de una prueba.
 *
 * @param {object} [test]  Si viene, edita; si no, crea.
 * @param {(id:number)=>void} [onSaved]
 * @param {()=>void} [onCancel]
 */
const PsychometricTestForm = ({ test, onSaved, onCancel }) => {
  const { user } = useAppContext();
  const quien = user?.userName ?? user?.email ?? 'Sistema';
  const esEdicion = Boolean(test);

  const [form, setForm] = useState({
    name: test?.name ?? '',
    description: test?.description ?? '',
    instructions: test?.instructions ?? '',
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
      setError('El nombre de la prueba es obligatorio.');
      return;
    }

    setLoading(true);
    try {
      const dto = {
        name: form.name.trim(),
        description: form.description.trim() || null,
        instructions: form.instructions.trim() || null,
        userName: quien,
      };

      const res = esEdicion
        ? await psychometricTestsApi.update(test.psychometricTestId, dto)
        : await psychometricTestsApi.create(dto);

      toast.success(esEdicion ? 'Prueba actualizada.' : 'Prueba creada.');
      onSaved?.(res?.data?.psychometricTestId ?? test?.psychometricTestId);
    } catch (err) {
      console.error(err);
      setError(mensajeDeError(err, 'No se pudo guardar la prueba.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 text-ink">
      <div>
        <h2 className="text-lg font-semibold">
          {esEdicion ? 'Editar prueba' : 'Nueva prueba psicométrica'}
        </h2>
        <p className="mt-1 text-xs text-ink-muted">
          Luego agregas las dimensiones y los ítems en el editor.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      <div>
        <Label htmlFor="pt-name">Nombre *</Label>
        <TextInput
          id="pt-name"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Ej: Cuestionario de clima laboral"
        />
      </div>

      <div>
        <Label htmlFor="pt-desc">Descripción</Label>
        <textarea
          id="pt-desc"
          name="description"
          rows={2}
          value={form.description}
          onChange={handleChange}
          placeholder="Para qué sirve la prueba"
          className={areaClass}
        />
      </div>

      <div>
        <Label htmlFor="pt-instr">Instrucciones para el colaborador</Label>
        <textarea
          id="pt-instr"
          name="instructions"
          rows={3}
          value={form.instructions}
          onChange={handleChange}
          placeholder="Se muestran antes de empezar a responder"
          className={areaClass}
        />
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
          ) : esEdicion ? (
            'Guardar cambios'
          ) : (
            'Crear prueba'
          )}
        </PrimaryButton>
      </div>
    </form>
  );
};

export default PsychometricTestForm;
