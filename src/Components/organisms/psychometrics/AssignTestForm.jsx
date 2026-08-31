import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { Loader2, Search } from 'lucide-react';

import psychometricTestsApi from '../../../api/psychometricTestsApi';
import psychometricAssignmentsApi from '../../../api/psychometricAssignmentsApi';
import EmployeeApi from '../../../api/employeesApi';
import { useAppContext } from '../../../context/AppContext';
import { mensajeDeError } from '../../../utils/apiError';
import { fieldClasses } from '../../atoms/fieldClasses';

import Label from '../../Label';
import SelectInput from '../../SelectInput';
import DateInput from '../../DateInput';
import CheckBoxInput from '../../CheckBoxInput';
import PrimaryButton from '../../PrimaryButton';
import SecondaryButton from '../../SecondaryButton';

const nombreDe = (e) =>
  [e?.firstName, e?.lastName].filter(Boolean).join(' ').trim() ||
  e?.userName ||
  e?.email ||
  'Sin nombre';

/**
 * Asigna una prueba activa a uno o varios colaboradores.
 *
 * @param {number} [testId]   Preselecciona la prueba.
 * @param {()=>void} [onAssigned]
 * @param {()=>void} [onCancel]
 */
const AssignTestForm = ({ testId, onAssigned, onCancel }) => {
  const { user } = useAppContext();
  const quien = user?.userName ?? user?.email ?? 'Sistema';

  const [tests, setTests] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [seleccion, setSeleccion] = useState(() => new Set());
  const [pruebaId, setPruebaId] = useState(testId ? String(testId) : '');
  const [dueDate, setDueDate] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const cargar = async () => {
      try {
        const [tRes, eRes] = await Promise.all([
          psychometricTestsApi.getAll(),
          EmployeeApi.getAllEmployees(),
        ]);
        setTests(
          (tRes.data ?? []).filter((t) => t.isActive && t.questions > 0)
        );
        setEmployees(
          (eRes.data ?? []).filter((e) => e.isActive && !e.deleted)
        );
      } catch (err) {
        console.error(err);
        toast.error('No se pudieron cargar pruebas o colaboradores.');
      }
    };
    cargar();
  }, []);

  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    if (!q) return employees;
    return employees.filter((e) =>
      [nombreDe(e), e.email, e.departament?.name]
        .filter(Boolean)
        .some((c) => String(c).toLowerCase().includes(q))
    );
  }, [employees, busqueda]);

  const alternar = (id) =>
    setSeleccion((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!pruebaId) {
      setError('Selecciona la prueba.');
      return;
    }
    if (seleccion.size === 0) {
      setError('Selecciona al menos un colaborador.');
      return;
    }

    setLoading(true);
    try {
      const res = await psychometricAssignmentsApi.assignBulk({
        testId: Number(pruebaId),
        userIds: [...seleccion],
        dueDate: dueDate || null,
        userName: quien,
      });
      toast.success(
        `Prueba asignada a ${res?.data?.creadas ?? seleccion.size} colaborador(es).`
      );
      onAssigned?.();
    } catch (err) {
      console.error(err);
      setError(mensajeDeError(err, 'No se pudo asignar la prueba.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 text-ink">
      <div>
        <h2 className="text-lg font-semibold">Asignar prueba</h2>
        <p className="mt-1 text-xs text-ink-muted">
          Solo se listan las pruebas activas y con ítems.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      <div>
        <Label htmlFor="assign-test">Prueba *</Label>
        <SelectInput
          id="assign-test"
          value={pruebaId}
          onChange={(e) => setPruebaId(e.target.value)}
        >
          <option value="">Selecciona una prueba…</option>
          {tests.map((t) => (
            <option key={t.psychometricTestId} value={t.psychometricTestId}>
              {t.name} · {t.questions} ítems
            </option>
          ))}
        </SelectInput>
      </div>

      <div>
        <Label htmlFor="assign-due">Fecha límite (opcional)</Label>
        <DateInput
          id="assign-due"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </div>

      <div>
        <div className="mb-1 flex items-center justify-between">
          <Label className="mb-0">Colaboradores *</Label>
          <span className="text-xs text-ink-muted">
            {seleccion.size} seleccionado{seleccion.size === 1 ? '' : 's'}
          </span>
        </div>

        <div className="relative mb-2">
          <Search
            size={15}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
          />
          <input
            type="search"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por nombre, correo o departamento…"
            className={fieldClasses({ className: 'h-9 pl-9' })}
          />
        </div>

        <div className="max-h-64 space-y-1 overflow-y-auto rounded-xl border border-stroke-soft p-2">
          {filtrados.length === 0 ? (
            <p className="p-3 text-center text-sm text-ink-muted">
              Sin colaboradores.
            </p>
          ) : (
            filtrados.map((e) => (
              <div
                key={e.id}
                className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-canvas"
              >
                <CheckBoxInput
                  checked={seleccion.has(e.id)}
                  onChange={() => alternar(e.id)}
                  label={
                    <span className="text-sm">
                      {nombreDe(e)}
                      {e.departament?.name && (
                        <span className="text-ink-muted"> — {e.departament.name}</span>
                      )}
                    </span>
                  }
                />
              </div>
            ))
          )}
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
              Asignando…
            </>
          ) : (
            'Asignar'
          )}
        </PrimaryButton>
      </div>
    </form>
  );
};

export default AssignTestForm;
