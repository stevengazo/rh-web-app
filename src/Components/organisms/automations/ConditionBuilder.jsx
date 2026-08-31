import { Plus, Trash2 } from 'lucide-react';

import { OPERADORES, OP_SIN_VALOR } from '../../../utils/automations';
import SelectInput from '../../SelectInput';
import TextInput from '../../TextInput';

/**
 * Editor de condiciones (AND). Cada fila: campo · operador · valor.
 *
 * @param {string[]} fields   Campos disponibles del evento disparador.
 * @param {Array} value       `[{ field, op, value }]`
 * @param {(next:Array)=>void} onChange
 */
const ConditionBuilder = ({ fields = [], value = [], onChange }) => {
  const set = (i, patch) =>
    onChange(value.map((c, j) => (j === i ? { ...c, ...patch } : c)));

  const add = () =>
    onChange([...value, { field: fields[0] ?? '', op: 'eq', value: '' }]);

  const remove = (i) => onChange(value.filter((_, j) => j !== i));

  return (
    <div className="space-y-2">
      {value.length === 0 ? (
        <p className="text-sm text-ink-muted">
          Sin condiciones: la regla se ejecuta siempre que ocurra el evento.
        </p>
      ) : (
        value.map((c, i) => {
          const sinValor = OP_SIN_VALOR.has(c.op);
          return (
            <div key={i} className="flex flex-wrap items-center gap-2">
              <SelectInput
                value={c.field}
                onChange={(e) => set(i, { field: e.target.value })}
                className="min-w-40 flex-1"
              >
                {!fields.includes(c.field) && c.field && (
                  <option value={c.field}>{c.field}</option>
                )}
                {fields.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </SelectInput>

              <SelectInput
                value={c.op}
                onChange={(e) => set(i, { op: e.target.value })}
                className="min-w-44 flex-1"
              >
                {OPERADORES.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.label}
                  </option>
                ))}
              </SelectInput>

              <TextInput
                value={sinValor ? '' : c.value}
                onChange={(e) => set(i, { value: e.target.value })}
                disabled={sinValor}
                placeholder={sinValor ? '—' : 'valor'}
                className="min-w-32 flex-1"
              />

              <button
                type="button"
                onClick={() => remove(i)}
                aria-label="Quitar condición"
                className="grid h-8 w-8 shrink-0 place-items-center rounded-md text-ink-muted
                           transition-colors hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 size={15} />
              </button>
            </div>
          );
        })
      )}

      <button
        type="button"
        onClick={add}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:underline"
      >
        <Plus size={14} />
        Agregar condición
      </button>
    </div>
  );
};

export default ConditionBuilder;
