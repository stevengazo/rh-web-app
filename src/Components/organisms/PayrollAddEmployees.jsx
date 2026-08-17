import { useMemo, useState } from 'react';
import { Check, Search, UserPlus, Users } from 'lucide-react';

import PrimaryButton from '../PrimaryButton';
import SecondaryButton from '../SecondaryButton';
import { fieldClasses } from '../atoms/fieldClasses';

const nombreDe = (e) =>
  [e?.firstName, e?.lastName].filter(Boolean).join(' ').trim() ||
  e?.userName ||
  e?.email ||
  'Sin nombre';

/**
 * Selector para incorporar empleados a una planilla.
 *
 * Solo lista gente elegible (activa y con salario vigente); el hook de la
 * planilla ya excluye a quienes están incluidos.
 *
 * @param {Array} employees   Empleados disponibles.
 * @param {(ids: string[]) => void} onAdd
 * @param {() => void} [onClose]
 */
const PayrollAddEmployees = ({ employees = [], onAdd, onClose }) => {
  const [busqueda, setBusqueda] = useState('');
  const [seleccion, setSeleccion] = useState(() => new Set());

  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    if (!q) return employees;

    return employees.filter((e) => {
      const campos = [
        nombreDe(e),
        e.email,
        e.dni,
        e.departament?.name,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return campos.includes(q);
    });
  }, [employees, busqueda]);

  const alternar = (id) => {
    setSeleccion((prev) => {
      const siguiente = new Set(prev);
      if (siguiente.has(id)) siguiente.delete(id);
      else siguiente.add(id);
      return siguiente;
    });
  };

  const alternarTodos = () => {
    setSeleccion((prev) =>
      prev.size === filtrados.length
        ? new Set()
        : new Set(filtrados.map((e) => e.id))
    );
  };

  const confirmar = () => {
    if (seleccion.size === 0) return;
    onAdd?.(Array.from(seleccion));
    setSeleccion(new Set());
    onClose?.();
  };

  if (employees.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-stroke bg-surface-alt py-14 text-ink-muted">
        <Users size={30} />
        <p className="text-sm font-medium">
          No hay más empleados para agregar
        </p>
        <p className="max-w-xs text-center text-xs">
          Ya están todos incluidos, o el resto no tiene salario vigente
          registrado.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-4">
      {/* Buscador */}
      <div className="relative">
        <Search
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
        />
        <input
          type="search"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por nombre, cédula o departamento…"
          className={fieldClasses({ className: 'h-10 pl-9' })}
        />
      </div>

      {/* Encabezado de la lista */}
      <div className="flex items-center justify-between text-sm">
        <button
          type="button"
          onClick={alternarTodos}
          className="font-semibold text-brand hover:underline"
        >
          {seleccion.size === filtrados.length && filtrados.length > 0
            ? 'Quitar selección'
            : `Seleccionar los ${filtrados.length}`}
        </button>

        <span className="text-ink-muted">
          {seleccion.size} seleccionado{seleccion.size === 1 ? '' : 's'}
        </span>
      </div>

      {/* Lista */}
      <div className="min-h-0 flex-1 space-y-1.5 overflow-y-auto scrollbar-slim pr-1">
        {filtrados.length === 0 ? (
          <p className="py-10 text-center text-sm text-ink-muted">
            Nadie coincide con “{busqueda}”.
          </p>
        ) : (
          filtrados.map((empleado) => {
            const marcado = seleccion.has(empleado.id);

            return (
              <label
                key={empleado.id}
                className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors
                  ${
                    marcado
                      ? 'border-brand bg-brand-tint'
                      : 'border-stroke-soft bg-surface hover:bg-canvas'
                  }`}
              >
                <input
                  type="checkbox"
                  checked={marcado}
                  onChange={() => alternar(empleado.id)}
                  className="sr-only"
                />

                <span
                  className={`grid h-5 w-5 shrink-0 place-items-center rounded border-2 transition-colors
                    ${
                      marcado
                        ? 'border-brand bg-brand text-white'
                        : 'border-stroke bg-surface'
                    }`}
                >
                  {marcado && <Check size={13} strokeWidth={3} />}
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-ink">
                    {nombreDe(empleado)}
                  </span>
                  <span className="block truncate text-xs text-ink-muted">
                    {empleado.departament?.name ?? 'Sin departamento'}
                    {empleado.dni ? ` · ${empleado.dni}` : ''}
                  </span>
                </span>
              </label>
            );
          })
        )}
      </div>

      {/* Acciones */}
      <div className="flex justify-end gap-3 border-t border-stroke-soft pt-4">
        {onClose && <SecondaryButton onClick={onClose}>Cancelar</SecondaryButton>}

        <PrimaryButton onClick={confirmar} disabled={seleccion.size === 0}>
          <UserPlus size={16} />
          Agregar {seleccion.size > 0 ? `(${seleccion.size})` : ''}
        </PrimaryButton>
      </div>
    </div>
  );
};

export default PayrollAddEmployees;
