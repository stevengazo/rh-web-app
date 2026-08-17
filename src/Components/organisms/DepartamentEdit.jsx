import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { Crown, Loader2, Plus, Trash2 } from 'lucide-react';

import Label from '../Label';
import TextInput from '../TextInput';
import SelectInput from '../SelectInput';
import PrimaryButton from '../PrimaryButton';
import SecondaryButton from '../SecondaryButton';
import IconButton from '../IconButton';

import DepartamentApi from '../../api/departamentApi';
import EmployeeApi from '../../api/employeesApi';

const nombreDe = (e) =>
  [e?.firstName, e?.lastName].filter(Boolean).join(' ').trim() ||
  e?.userName ||
  e?.email ||
  'Sin nombre';

/**
 * Edición de un departamento dentro del organigrama: nombre, de quién depende,
 * orden entre hermanos y sus jefaturas.
 *
 * @param {object} departament  Nodo del organigrama.
 * @param {Array} departamentos Todos los nodos (para elegir el padre).
 * @param {() => void} [onSaved]
 * @param {() => void} [onClose]
 */
const DepartamentEdit = ({
  departament,
  departamentos = [],
  onSaved,
  onClose,
}) => {
  const [form, setForm] = useState({
    name: departament?.name ?? '',
    description: departament?.description ?? '',
    parentDepartamentId: departament?.parentDepartamentId ?? '',
    displayOrder: departament?.displayOrder ?? 0,
  });

  const [empleados, setEmpleados] = useState([]);
  const [nuevoJefe, setNuevoJefe] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [trabajandoJefe, setTrabajandoJefe] = useState(false);

  const jefes = departament?.chiefs ?? [];

  useEffect(() => {
    const cargar = async () => {
      try {
        const res = await EmployeeApi.getAllEmployees();
        setEmpleados((res.data ?? []).filter((e) => e.isActive && !e.deleted));
      } catch (error) {
        console.error('Error cargando empleados:', error);
      }
    };
    cargar();
  }, []);

  /**
   * Padres posibles: cualquiera menos él mismo y menos sus descendientes,
   * para que no se pueda crear un ciclo desde la interfaz.
   */
  const posiblesPadres = useMemo(() => {
    if (!departament) return departamentos;

    const descendientes = new Set([departament.departamentId]);
    let cambio = true;

    while (cambio) {
      cambio = false;
      departamentos.forEach((d) => {
        if (
          d.parentDepartamentId != null &&
          descendientes.has(d.parentDepartamentId) &&
          !descendientes.has(d.departamentId)
        ) {
          descendientes.add(d.departamentId);
          cambio = true;
        }
      });
    }

    return departamentos.filter((d) => !descendientes.has(d.departamentId));
  }, [departament, departamentos]);

  const cambiar = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const guardar = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.error('El nombre es obligatorio.');
      return;
    }

    setGuardando(true);

    try {
      await DepartamentApi.updateDepartament(departament.departamentId, {
        departamentId: departament.departamentId,
        name: form.name.trim(),
        description: form.description.trim() || null,
        deleted: false,
        parentDepartamentId: form.parentDepartamentId
          ? Number(form.parentDepartamentId)
          : null,
        displayOrder: Number(form.displayOrder) || 0,
      });

      toast.success('Departamento actualizado');
      onSaved?.();
    } catch (error) {
      console.error(error);
      toast.error('No se pudo guardar el departamento');
    } finally {
      setGuardando(false);
    }
  };

  const agregarJefe = async () => {
    if (!nuevoJefe) return;

    if (jefes.some((j) => j.userId === nuevoJefe)) {
      toast.error('Esa persona ya es jefatura de este departamento.');
      return;
    }

    setTrabajandoJefe(true);

    try {
      await DepartamentApi.assignChief({
        departamentId: departament.departamentId,
        userId: nuevoJefe,
      });
      toast.success('Jefatura asignada');
      setNuevoJefe('');
      onSaved?.();
    } catch (error) {
      console.error(error);
      toast.error('No se pudo asignar la jefatura');
    } finally {
      setTrabajandoJefe(false);
    }
  };

  const quitarJefe = async (jefe) => {
    if (!window.confirm('¿Quitar esta jefatura del departamento?')) return;

    setTrabajandoJefe(true);

    try {
      await DepartamentApi.removeChief(jefe.chief_By_DepartamentId);
      toast.success('Jefatura removida');
      onSaved?.();
    } catch (error) {
      console.error(error);
      toast.error('No se pudo quitar la jefatura');
    } finally {
      setTrabajandoJefe(false);
    }
  };

  if (!departament) return null;

  return (
    <div className="space-y-6">
      <form onSubmit={guardar} className="space-y-4">
        <div>
          <Label htmlFor="dep-name">Nombre *</Label>
          <TextInput
            id="dep-name"
            name="name"
            value={form.name}
            onChange={cambiar}
          />
        </div>

        <div>
          <Label htmlFor="dep-desc">Descripción</Label>
          <TextInput
            id="dep-desc"
            name="description"
            value={form.description}
            onChange={cambiar}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="dep-parent">Depende de</Label>
            <SelectInput
              id="dep-parent"
              name="parentDepartamentId"
              value={form.parentDepartamentId ?? ''}
              onChange={cambiar}
            >
              <option value="">— Nivel más alto —</option>
              {posiblesPadres.map((d) => (
                <option key={d.departamentId} value={d.departamentId}>
                  {d.name}
                </option>
              ))}
            </SelectInput>
            <p className="mt-1 text-xs text-ink-muted">
              Sus propios subdepartamentos no aparecen, para no crear ciclos.
            </p>
          </div>

          <div>
            <Label htmlFor="dep-order">Orden entre hermanos</Label>
            <TextInput
              id="dep-order"
              name="displayOrder"
              type="number"
              value={form.displayOrder}
              onChange={cambiar}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-stroke-soft pt-4">
          {onClose && (
            <SecondaryButton onClick={onClose} disabled={guardando}>
              Cerrar
            </SecondaryButton>
          )}
          <PrimaryButton type="submit" disabled={guardando}>
            {guardando ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                Guardando…
              </>
            ) : (
              'Guardar cambios'
            )}
          </PrimaryButton>
        </div>
      </form>

      {/* Jefaturas */}
      <section className="space-y-3 border-t border-stroke-soft pt-5">
        <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-brand">
          <Crown size={15} />
          Jefaturas
        </h3>

        {jefes.length === 0 ? (
          <p className="text-sm italic text-ink-muted">
            Este departamento no tiene jefatura asignada.
          </p>
        ) : (
          <ul className="space-y-2">
            {jefes.map((jefe) => (
              <li
                key={jefe.chief_By_DepartamentId}
                className="flex items-center justify-between gap-3 rounded-lg border border-stroke-soft bg-surface-alt p-3"
              >
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium text-ink">
                    {nombreDe(jefe.user)}
                  </span>
                  {jefe.user?.email && (
                    <span className="block truncate text-xs text-ink-muted">
                      {jefe.user.email}
                    </span>
                  )}
                </span>

                <IconButton
                  icon={Trash2}
                  variant="danger"
                  size={16}
                  disabled={trabajandoJefe}
                  onClick={() => quitarJefe(jefe)}
                  aria-label="Quitar jefatura"
                />
              </li>
            ))}
          </ul>
        )}

        <div className="flex flex-wrap items-end gap-2">
          <div className="min-w-48 flex-1">
            <Label htmlFor="dep-chief">Asignar jefatura</Label>
            <SelectInput
              id="dep-chief"
              value={nuevoJefe}
              onChange={(e) => setNuevoJefe(e.target.value)}
            >
              <option value="">Seleccione un colaborador…</option>
              {empleados.map((e) => (
                <option key={e.id} value={e.id}>
                  {nombreDe(e)}
                </option>
              ))}
            </SelectInput>
          </div>

          <PrimaryButton
            onClick={agregarJefe}
            disabled={!nuevoJefe || trabajandoJefe}
          >
            <Plus size={15} />
            Asignar
          </PrimaryButton>
        </div>
      </section>
    </div>
  );
};

export default DepartamentEdit;
