import { useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import {
  BarChart,
  Bar,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { BarChart3, CheckCircle2, Percent, Users } from 'lucide-react';

import psychometricAssignmentsApi from '../../../api/psychometricAssignmentsApi';
import psychometricTestsApi from '../../../api/psychometricTestsApi';
import DepartamentApi from '../../../api/departamentApi';
import { mensajeDeError } from '../../../utils/apiError';
import { fieldClasses } from '../../atoms/fieldClasses';

const Cifra = ({ icon: Icon, label, valor, accent }) => (
  <div className="flex items-center gap-3 rounded-xl border border-stroke-soft bg-surface p-4 shadow-sm">
    <span className={`grid h-10 w-10 place-items-center rounded-lg ${accent}`}>
      <Icon size={18} />
    </span>
    <div className="min-w-0">
      <p className="text-lg font-semibold leading-none text-ink">{valor}</p>
      <p className="mt-1 truncate text-xs text-ink-muted">{label}</p>
    </div>
  </div>
);

/**
 * Resultados agregados de psicometría: promedio por dimensión y por
 * departamento sobre las aplicaciones enviadas. Filtros por prueba y departamento.
 */
const PsychometricResultsPanel = () => {
  const [tests, setTests] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [testId, setTestId] = useState('');
  const [departamentId, setDepartamentId] = useState('');

  const [data, setData] = useState(null);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    const cargar = async () => {
      try {
        const [tRes, dRes] = await Promise.all([
          psychometricTestsApi.getAll(),
          DepartamentApi.getAllDepartaments(),
        ]);
        const listaTests = (tRes.data ?? []).filter((t) => t.assignments > 0);
        setTests(listaTests);
        setDepartamentos(Array.isArray(dRes) ? dRes : dRes?.data ?? []);
        if (listaTests.length) setTestId(String(listaTests[0].psychometricTestId));
      } catch (e) {
        console.error(e);
        toast.error('No se pudieron cargar las opciones.');
      }
    };
    cargar();
  }, []);

  const cargar = useCallback(async () => {
    if (!testId) {
      setData(null);
      return;
    }
    setCargando(true);
    try {
      const res = await psychometricAssignmentsApi.getAggregate({
        testId: Number(testId),
        departamentId: departamentId ? Number(departamentId) : undefined,
      });
      setData(res.data ?? null);
    } catch (e) {
      console.error(e);
      toast.error(mensajeDeError(e, 'No se pudieron cargar los resultados.'));
    } finally {
      setCargando(false);
    }
  }, [testId, departamentId]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const chartData = useMemo(
    () =>
      (data?.porDimension ?? []).map((d) => ({
        dimension: d.dimensionName,
        promedio: Number(d.promedio) || 0,
      })),
    [data]
  );

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="res-test" className="mb-1 block text-sm font-medium text-ink-secondary">
            Prueba
          </label>
          <select
            id="res-test"
            value={testId}
            onChange={(e) => setTestId(e.target.value)}
            className={fieldClasses({ className: 'h-10' })}
          >
            <option value="">Selecciona una prueba…</option>
            {tests.map((t) => (
              <option key={t.psychometricTestId} value={t.psychometricTestId}>
                {t.name} · {t.assignments} aplicaciones
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="res-dep" className="mb-1 block text-sm font-medium text-ink-secondary">
            Departamento
          </label>
          <select
            id="res-dep"
            value={departamentId}
            onChange={(e) => setDepartamentId(e.target.value)}
            className={fieldClasses({ className: 'h-10' })}
          >
            <option value="">Todos los departamentos</option>
            {departamentos.map((d) => (
              <option key={d.departamentId} value={d.departamentId}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {cargando ? (
        <div className="h-72 animate-pulse rounded-xl bg-surface-alt" />
      ) : !data || data.completadas === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-stroke bg-surface-alt py-16 text-ink-muted">
          <BarChart3 size={28} />
          <p className="text-sm font-medium">
            {testId
              ? 'Todavía no hay pruebas enviadas para este filtro.'
              : 'Elige una prueba para ver sus resultados.'}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <Cifra icon={Users} label="Asignadas" valor={data.totalAsignadas} accent="bg-amber-50 text-amber-700" />
            <Cifra icon={CheckCircle2} label="Completadas" valor={data.completadas} accent="bg-green-50 text-green-700" />
            <Cifra icon={Percent} label="Tasa de completitud" valor={`${Math.round(data.tasaCompletitud)}%`} accent="bg-brand-tint text-brand" />
            <Cifra icon={BarChart3} label="Promedio global" valor={`${Math.round(data.promedioGlobal)}%`} accent="bg-violet-50 text-violet-700" />
          </div>

          {/* Promedio por dimensión */}
          <div className="rounded-xl border border-stroke-soft bg-surface p-5 shadow-sm">
            <p className="mb-3 text-sm font-semibold text-ink">Promedio por dimensión</p>
            {chartData.length > 0 ? (
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} layout="vertical" margin={{ left: 24, right: 16 }}>
                    <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" domain={[0, 100]} tick={{ fill: '#6b7280', fontSize: 12 }} />
                    <YAxis
                      type="category"
                      dataKey="dimension"
                      width={140}
                      tick={{ fill: '#6b7280', fontSize: 12 }}
                    />
                    <Tooltip
                      formatter={(v) => [`${v}%`, 'Promedio']}
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: 10,
                      }}
                    />
                    <Bar dataKey="promedio" fill="#0F6CBD" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-sm text-ink-muted">
                La prueba no tiene ítems con dimensión.
              </p>
            )}

            <div className="mt-3 overflow-x-auto rounded-lg border border-stroke-soft">
              <table className="min-w-full">
                <thead className="bg-surface-alt text-ink-secondary">
                  <tr>
                    <th className="px-3 py-2 text-left text-sm font-semibold">Dimensión</th>
                    <th className="px-3 py-2 text-right text-sm font-semibold">Promedio</th>
                    <th className="px-3 py-2 text-right text-sm font-semibold">Mín</th>
                    <th className="px-3 py-2 text-right text-sm font-semibold">Máx</th>
                    <th className="px-3 py-2 text-right text-sm font-semibold">Muestras</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stroke-soft bg-surface">
                  {(data.porDimension ?? []).map((d) => (
                    <tr key={d.dimensionId}>
                      <td className="px-3 py-2 text-sm font-medium text-ink">{d.dimensionName}</td>
                      <td className="px-3 py-2 text-right text-sm font-semibold text-ink">{Math.round(d.promedio)}%</td>
                      <td className="px-3 py-2 text-right text-sm text-ink-secondary">{Math.round(d.minimo)}%</td>
                      <td className="px-3 py-2 text-right text-sm text-ink-secondary">{Math.round(d.maximo)}%</td>
                      <td className="px-3 py-2 text-right text-sm text-ink-secondary">{d.muestras}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Por departamento */}
          {!departamentId && (data.porDepartamento ?? []).length > 0 && (
            <div className="rounded-xl border border-stroke-soft bg-surface p-5 shadow-sm">
              <p className="mb-3 text-sm font-semibold text-ink">Por departamento</p>
              <div className="overflow-x-auto rounded-lg border border-stroke-soft">
                <table className="min-w-full">
                  <thead className="bg-surface-alt text-ink-secondary">
                    <tr>
                      <th className="px-3 py-2 text-left text-sm font-semibold">Departamento</th>
                      <th className="px-3 py-2 text-right text-sm font-semibold">Completadas</th>
                      <th className="px-3 py-2 text-right text-sm font-semibold">Promedio global</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stroke-soft bg-surface">
                    {data.porDepartamento.map((d) => (
                      <tr key={d.departamentId}>
                        <td className="px-3 py-2 text-sm font-medium text-ink">{d.departamentName}</td>
                        <td className="px-3 py-2 text-right text-sm text-ink-secondary">{d.completadas}</td>
                        <td className="px-3 py-2 text-right text-sm font-semibold text-ink">{Math.round(d.promedioGlobal)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PsychometricResultsPanel;
