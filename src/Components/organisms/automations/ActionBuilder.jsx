import { ChevronDown, Plus, Trash2 } from 'lucide-react';

import { ACCIONES, etiquetaAccion } from '../../../utils/automations';
import Label from '../../Label';
import TextInput from '../../TextInput';
import SelectInput from '../../SelectInput';

const areaClass =
  'w-full resize-none rounded-md border border-stroke border-b-2 border-b-ink-muted ' +
  'bg-surface px-3 py-2 text-sm text-ink placeholder:text-ink-muted ' +
  'transition-colors focus:border-b-brand focus:outline-none';

/**
 * Editor de la lista de acciones de una regla.
 *
 * @param {Array} value          `[{ type, config }]`
 * @param {(next:Array)=>void} onChange
 * @param {string[]} fields      Campos del evento (para las ayudas).
 * @param {Array} tests          Pruebas psicométricas activas.
 */
const ActionBuilder = ({ value = [], onChange, fields = [], tests = [] }) => {
  const setConfig = (i, name, val) =>
    onChange(
      value.map((a, j) =>
        j === i ? { ...a, config: { ...a.config, [name]: val } } : a
      )
    );

  const add = (tipo) =>
    onChange([...value, { type: tipo, config: {} }]);

  const remove = (i) => onChange(value.filter((_, j) => j !== i));

  return (
    <div className="space-y-3">
      {value.map((a, i) => {
        const meta = ACCIONES[a.type];
        return (
          <div
            key={i}
            className="rounded-xl border border-stroke-soft bg-surface-alt p-4"
          >
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-ink">
                {i + 1}. {etiquetaAccion(a.type)}
              </p>
              <button
                type="button"
                onClick={() => remove(i)}
                aria-label="Quitar acción"
                className="grid h-8 w-8 place-items-center rounded-md text-ink-muted
                           transition-colors hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 size={15} />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {(meta?.campos ?? []).map((campo) => {
                const val = a.config?.[campo.name] ?? '';
                const full = campo.textarea ? 'sm:col-span-2' : '';

                return (
                  <div key={campo.name} className={full}>
                    <Label>{campo.label}</Label>
                    {campo.tipo === 'select-prueba' ? (
                      <SelectInput
                        value={val}
                        onChange={(e) => setConfig(i, campo.name, e.target.value)}
                      >
                        <option value="">Selecciona…</option>
                        {tests.map((t) => (
                          <option key={t.psychometricTestId} value={t.psychometricTestId}>
                            {t.name}
                          </option>
                        ))}
                      </SelectInput>
                    ) : campo.textarea ? (
                      <textarea
                        rows={3}
                        value={val}
                        onChange={(e) => setConfig(i, campo.name, e.target.value)}
                        className={areaClass}
                      />
                    ) : (
                      <TextInput
                        type={campo.tipo === 'number' ? 'number' : 'text'}
                        value={val}
                        onChange={(e) => setConfig(i, campo.name, e.target.value)}
                      />
                    )}
                    {campo.help && (
                      <p className="mt-1 text-xs text-ink-muted">{campo.help}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Agregar acción */}
      <div className="relative inline-block">
        <details className="group">
          <summary className="inline-flex cursor-pointer list-none items-center gap-1.5 rounded-md
                              border border-stroke bg-surface px-3 py-1.5 text-sm font-semibold
                              text-ink-secondary transition-colors hover:border-brand hover:text-brand">
            <Plus size={14} />
            Agregar acción
            <ChevronDown size={14} />
          </summary>
          <div className="absolute z-10 mt-1 w-64 overflow-hidden rounded-lg border border-stroke-soft
                          bg-surface shadow-lg">
            {Object.entries(ACCIONES).map(([tipo, meta]) => (
              <button
                key={tipo}
                type="button"
                onClick={(e) => {
                  add(tipo);
                  e.currentTarget.closest('details')?.removeAttribute('open');
                }}
                className="block w-full px-3 py-2 text-left text-sm text-ink transition-colors hover:bg-canvas"
              >
                {meta.label}
              </button>
            ))}
          </div>
        </details>
      </div>

      {fields.length > 0 && (
        <p className="rounded-lg bg-surface-alt p-3 text-xs text-ink-muted">
          Campos disponibles del evento: {fields.map((f) => `{{${f}}}`).join(', ')}
        </p>
      )}
    </div>
  );
};

export default ActionBuilder;
