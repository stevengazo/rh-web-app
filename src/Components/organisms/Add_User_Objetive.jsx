import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

import user_objetiveApi from '../../api/user_objetiveApi';
import EmployeeApi from '../../api/employeesApi';
import kpiApi from '../../api/kpiApi';
import { mensajeDeError } from '../../utils/apiError';

import Label from '../Label';
import SelectInput from '../SelectInput';
import PrimaryButton from '../PrimaryButton';
import SecondaryButton from '../SecondaryButton';

const nombreDe = (e) =>
  [e?.firstName, e?.lastName].filter(Boolean).join(' ').trim() ||
  e?.userName ||
  e?.email ||
  'Sin nombre';

/**
 * Asigna un objetivo a un colaborador.
 *
 * @param {string} [userId]   Fija el colaborador y oculta el selector.
 * @param {number} [objetiveId] Preselecciona el objetivo.
 * @param {() => void} [onSaved]
 * @param {() => void} [onCancel]
 */
const Add_User_Objetive = ({ userId, objetiveId, onSaved, onCancel }) => {
  const [employees, setEmployees] = useState([]);
  const [kpis, setKpis] = useState([]);
  const [form, setForm] = useState({
    userId: userId ?? '',
    objetiveId: objetiveId ? String(objetiveId) : '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const eligeEmpleado = !userId;

  useEffect(() => {
    const cargar = async () => {
      try {
        const [eRes, kRes] = await Promise.all([
          eligeEmpleado ? EmployeeApi.getAllEmployees() : Promise.resolve({ data: [] }),
          kpiApi.getAllKPIs(),
        ]);
        setEmployees((eRes.data ?? []).filter((e) => e.isActive && !e.deleted));
        setKpis((kRes.data ?? []).filter((k) => k.isActive));
      } catch (err) {
        console.error(err);
        toast.error('No se pudieron cargar los datos.');
      }
    };
    cargar();
  }, [eligeEmpleado]);

  const empleadosOrdenados = useMemo(
    () => [...employees].sort((a, b) => nombreDe(a).localeCompare(nombreDe(b))),
    [employees]
  );

  const set = (name, value) => setForm((prev) => ({ ...prev, [name]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.userId) {
      setError('Selecciona al colaborador.');
      return;
    }
    if (!form.objetiveId) {
      setError('Selecciona el objetivo.');
      return;
    }

    setLoading(true);
    try {
      await user_objetiveApi.createUser_Objetive({
        userId: form.userId,
        objetiveId: Number(form.objetiveId),
      });
      toast.success('Objetivo asignado.');
      onSaved?.();
    } catch (err) {
      console.error(err);
      setError(mensajeDeError(err, 'No se pudo asignar el objetivo.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 text-ink">
      <div>
        <h2 className="text-lg font-semibold">Asignar objetivo</h2>
        <p className="mt-1 text-xs text-ink-muted">
          Solo se listan los objetivos activos.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      {eligeEmpleado && (
        <div>
          <Label htmlFor="uo-user">Colaborador *</Label>
          <SelectInput
            id="uo-user"
            value={form.userId}
            onChange={(e) => set('userId', e.target.value)}
          >
            <option value="">Selecciona un colaborador…</option>
            {empleadosOrdenados.map((e) => (
              <option key={e.id} value={e.id}>
                {nombreDe(e)}
                {e.departament?.name ? ` — ${e.departament.name}` : ''}
              </option>
            ))}
          </SelectInput>
        </div>
      )}

      <div>
        <Label htmlFor="uo-obj">Objetivo *</Label>
        <SelectInput
          id="uo-obj"
          value={form.objetiveId}
          onChange={(e) => set('objetiveId', e.target.value)}
        >
          <option value="">Selecciona un objetivo…</option>
          {kpis.map((k) => (
            <option key={k.objetiveId} value={k.objetiveId}>
              {k.title}
              {k.category?.name ? ` · ${k.category.name}` : ''}
            </option>
          ))}
        </SelectInput>
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

export default Add_User_Objetive;
