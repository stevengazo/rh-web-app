import { useCallback, useEffect, useMemo, useState } from 'react';
import { Building2, ChevronRight, Crown, Network } from 'lucide-react';

import DepartamentApi from '../../api/departamentApi';
import { mensajeDeError } from '../../utils/apiError';
import OrgChart from './OrgChart';

const nombreDe = (u) =>
  [u?.firstName, u?.lastName].filter(Boolean).join(' ').trim() ||
  u?.userName ||
  u?.email ||
  'Sin nombre';

/**
 * Organigrama dentro del expediente: lo ubica en el departamento del
 * colaborador y muestra su cadena de dependencia y sus jefaturas.
 *
 * Es de solo consulta; la edición de la estructura vive en `/manager/organigrama`.
 *
 * @param {object} employee  Con `departamentId` y `departament`.
 */
const EmployeeOrgChartPanel = ({ employee }) => {
  const [departamentos, setDepartamentos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const deptId = employee?.departamentId ?? null;

  const cargar = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const res = await DepartamentApi.getOrgChart();
      setDepartamentos(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      console.error(e);
      setError(mensajeDeError(e, 'No se pudo cargar el organigrama.'));
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const porId = useMemo(
    () => new Map(departamentos.map((d) => [d.departamentId, d])),
    [departamentos]
  );

  /** Cadena raíz → … → departamento del colaborador. */
  const cadena = useMemo(() => {
    if (deptId == null) return [];
    const ruta = [];
    let cursor = porId.get(deptId);
    const visto = new Set();
    while (cursor && !visto.has(cursor.departamentId)) {
      visto.add(cursor.departamentId);
      ruta.unshift(cursor);
      cursor = cursor.parentDepartamentId != null
        ? porId.get(cursor.parentDepartamentId)
        : null;
    }
    return ruta;
  }, [deptId, porId]);

  const propio = deptId != null ? porId.get(deptId) : null;

  if (deptId == null) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-stroke bg-surface-alt py-12 text-ink-muted">
        <Network size={26} />
        <p className="text-sm">
          Este colaborador no tiene departamento asignado.
        </p>
        <p className="text-xs">
          Asígnaselo en "Editar información" para ubicarlo en el organigrama.
        </p>
      </div>
    );
  }

  if (cargando) {
    return <div className="h-96 animate-pulse rounded-xl bg-surface-alt" />;
  }

  if (error) {
    return (
      <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
        {error}
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {/* Cadena de dependencia */}
      {cadena.length > 0 && (
        <nav className="flex flex-wrap items-center gap-1.5 text-sm">
          {cadena.map((d, i) => (
            <span key={d.departamentId} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRight size={14} className="text-ink-muted" />}
              <span
                className={
                  d.departamentId === deptId
                    ? 'inline-flex items-center gap-1.5 rounded-md bg-brand-tint px-2 py-0.5 font-semibold text-brand-700'
                    : 'text-ink-secondary'
                }
              >
                {d.departamentId === deptId && <Building2 size={13} />}
                {d.name}
              </span>
            </span>
          ))}
        </nav>
      )}

      {/* Jefaturas del departamento */}
      {propio && (
        <div className="rounded-xl border border-stroke-soft bg-surface p-4 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-ink-muted">
            Jefatura de {propio.name}
          </p>
          {(propio.chiefs ?? []).length === 0 ? (
            <p className="mt-1 text-sm italic text-ink-muted">
              Sin jefatura asignada.
            </p>
          ) : (
            <ul className="mt-1 space-y-1">
              {(propio.chiefs ?? []).map((j) => (
                <li
                  key={j.chief_By_DepartamentId}
                  className="flex items-center gap-1.5 text-sm text-ink"
                >
                  <Crown size={13} className="shrink-0 text-accent" />
                  {nombreDe(j.user)}
                </li>
              ))}
            </ul>
          )}
          <p className="mt-2 text-xs text-ink-muted">
            {propio.employeeCount ?? 0} colaborador
            {propio.employeeCount === 1 ? '' : 'es'} en el departamento.
          </p>
        </div>
      )}

      {/* Diagrama, con el departamento del colaborador resaltado */}
      <OrgChart departamentos={departamentos} seleccionadoId={deptId} />
    </div>
  );
};

export default EmployeeOrgChartPanel;
