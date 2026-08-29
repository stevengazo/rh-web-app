import { useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import {
  BarChart3,
  Download,
  FileSpreadsheet,
  RefreshCw,
  Search,
} from 'lucide-react';

import PageTitle from '../Components/PageTitle';
import Divider from '../Components/Divider';
import PrimaryButton from '../Components/PrimaryButton';
import SecondaryButton from '../Components/SecondaryButton';
import AiAssistPanel from '../Components/organisms/AiAssistPanel';
import { fieldClasses } from '../Components/atoms/fieldClasses';

import { REPORTES } from '../data/reportes';
import { USO } from '../data/modelosIa';
import { SISTEMA } from '../data/promptsIa';
import { formatMoney } from '../utils/formatMoney';
import { descargarCsv, sufijoFecha } from '../utils/csv';
import { mensajeDeError } from '../utils/apiError';

/**
 * Reportería.
 *
 * Los reportes se declaran como datos en `data/reportes.js`: qué columnas
 * tienen y de dónde salen. Esta pantalla solo los ejecuta, los muestra y los
 * exporta, así que agregar uno nuevo no obliga a tocarla.
 */
const ReportsPage = () => {
  const [seleccionado, setSeleccionado] = useState(REPORTES[0].id);
  const [filas, setFilas] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [busqueda, setBusqueda] = useState('');

  const reporte = REPORTES.find((r) => r.id === seleccionado) ?? REPORTES[0];

  const cargar = useCallback(async () => {
    setCargando(true);
    setError('');
    setBusqueda('');

    try {
      setFilas(await reporte.cargar());
    } catch (err) {
      console.error(err);
      setError(mensajeDeError(err, 'No se pudo generar el reporte.'));
      setFilas([]);
    } finally {
      setCargando(false);
    }
  }, [reporte]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const visibles = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    if (!q) return filas;

    return filas.filter((f) =>
      Object.values(f).some((v) => String(v ?? '').toLowerCase().includes(q))
    );
  }, [filas, busqueda]);

  /** Suma de las columnas de dinero y de cantidad, para el pie de la tabla. */
  const totales = useMemo(() => {
    const suma = {};

    reporte.columnas
      .filter((c) => c.dinero || c.numerico)
      .forEach((c) => {
        suma[c.clave] = visibles.reduce(
          (t, f) => t + (Number(f[c.clave]) || 0),
          0
        );
      });

    return suma;
  }, [visibles, reporte.columnas]);

  const hayTotales = Object.keys(totales).length > 0;

  const exportar = () => {
    if (visibles.length === 0) {
      toast.error('No hay datos que exportar.');
      return;
    }

    descargarCsv(`${reporte.id}-${sufijoFecha()}`, visibles, reporte.columnas);
    toast.success(`${visibles.length} filas exportadas`);
  };

  /* Los reportes se agrupan para que la lista no sea un muro de botones. */
  const grupos = useMemo(() => {
    const mapa = new Map();

    REPORTES.forEach((r) => {
      if (!mapa.has(r.grupo)) mapa.set(r.grupo, []);
      mapa.get(r.grupo).push(r);
    });

    return [...mapa.entries()];
  }, []);

  const celda = (fila, col) => {
    const valor = fila[col.clave];
    if (col.dinero) return formatMoney(valor);
    return valor === '' || valor == null ? '—' : String(valor);
  };

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <PageTitle className="mb-0">Reportería</PageTitle>
          <p className="text-sm text-ink-muted">
            Genera un reporte, revísalo en pantalla y descárgalo en Excel.
          </p>
        </div>

        <div className="flex gap-2">
          <SecondaryButton onClick={cargar} disabled={cargando}>
            <RefreshCw size={15} className={cargando ? 'animate-spin' : undefined} />
            Actualizar
          </SecondaryButton>

          <PrimaryButton onClick={exportar} disabled={cargando || visibles.length === 0}>
            <Download size={15} />
            Descargar CSV
          </PrimaryButton>
        </div>
      </div>

      <Divider />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[16rem_1fr]">
        {/* Catálogo */}
        <aside className="space-y-4">
          {grupos.map(([grupo, items]) => (
            <div key={grupo}>
              <p className="mb-1.5 text-xs font-bold uppercase tracking-widest text-ink-muted">
                {grupo}
              </p>

              <div className="space-y-1">
                {items.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setSeleccionado(r.id)}
                    aria-pressed={r.id === seleccionado}
                    className={`flex w-full items-center gap-2 rounded-md border-l-4 px-3 py-2 text-left
                                text-sm transition-colors
                      ${
                        r.id === seleccionado
                          ? 'border-l-brand bg-brand-subtle font-semibold text-ink'
                          : 'border-l-transparent text-ink-secondary hover:bg-canvas hover:text-ink'
                      }`}
                  >
                    <FileSpreadsheet size={15} className="shrink-0 opacity-70" />
                    {r.nombre}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </aside>

        {/* Resultado */}
        <div className="min-w-0 space-y-4">
          <div className="rounded-xl border border-stroke-soft bg-surface p-4">
            <h2 className="text-sm font-semibold text-ink">{reporte.nombre}</h2>
            <p className="mt-0.5 text-sm text-ink-muted">{reporte.descripcion}</p>

            <div className="mt-3 flex flex-wrap items-center gap-3">
              <div className="relative w-full sm:max-w-xs">
                <Search
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
                />
                <input
                  type="search"
                  placeholder="Filtrar resultados…"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className={fieldClasses({ className: 'h-10 pl-9' })}
                />
              </div>

              <p className="text-sm text-ink-muted">
                {cargando
                  ? 'Generando…'
                  : `${visibles.length} de ${filas.length} filas`}
              </p>
            </div>
          </div>

          {/* El análisis con IA solo aparece si hay algo que analizar. */}
          {!cargando && visibles.length > 0 && (
            <AiAssistPanel
              uso={USO.ANALISIS_PLANILLA}
              titulo={`Analizar «${reporte.nombre}»`}
              descripcion="Resume el reporte y señala lo que se sale de lo normal."
              sistema={SISTEMA.analisisPlanilla}
              maxTokens={1500}
              construirPrompt={() =>
                `Analiza este reporte de «${reporte.nombre}» (${reporte.descripcion}).
Da 3 o 4 observaciones concretas y cierra con lo que convenga revisar.

COLUMNAS: ${reporte.columnas.map((c) => c.titulo).join(' | ')}

DATOS (${visibles.length} filas${visibles.length > 100 ? ', se muestran las primeras 100' : ''}):
${visibles
  .slice(0, 100)
  .map((f) => reporte.columnas.map((c) => `${c.titulo}: ${f[c.clave]}`).join(' · '))
  .join('\n')}`
              }
            />
          )}

          {error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          ) : cargando ? (
            <div className="space-y-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-10 animate-pulse rounded bg-surface-alt" />
              ))}
            </div>
          ) : visibles.length === 0 ? (
            <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-stroke bg-surface-alt py-14 text-ink-muted">
              <BarChart3 size={28} />
              <p className="text-sm font-medium">Sin datos</p>
              <p className="text-center text-xs">
                {busqueda
                  ? `Ninguna fila coincide con “${busqueda}”.`
                  : 'Este reporte no devolvió registros.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-stroke-soft shadow-sm">
              <table className="min-w-full">
                <thead className="bg-surface-alt text-ink-secondary">
                  <tr>
                    {reporte.columnas.map((c) => (
                      <th
                        key={c.clave}
                        className={`whitespace-nowrap px-4 py-3 text-sm font-semibold
                          ${c.dinero || c.numerico ? 'text-right' : 'text-left'}`}
                      >
                        {c.titulo}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-stroke-soft bg-surface text-sm">
                  {visibles.slice(0, 500).map((fila, i) => (
                    <tr key={i} className="transition-colors hover:bg-canvas">
                      {reporte.columnas.map((c) => (
                        <td
                          key={c.clave}
                          className={`px-4 py-2.5
                            ${c.dinero || c.numerico ? 'whitespace-nowrap text-right tabular-nums text-ink' : 'text-ink-secondary'}`}
                        >
                          {celda(fila, c)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>

                {hayTotales && (
                  <tfoot className="border-t-2 border-stroke bg-surface-alt">
                    <tr>
                      {reporte.columnas.map((c, i) => (
                        <td
                          key={c.clave}
                          className={`px-4 py-3 text-sm font-bold
                            ${c.dinero || c.numerico ? 'text-right tabular-nums text-ink' : 'text-ink-muted'}`}
                        >
                          {i === 0
                            ? 'Total'
                            : c.dinero
                              ? formatMoney(totales[c.clave])
                              : c.numerico
                                ? Number(totales[c.clave]?.toFixed(2))
                                : ''}
                        </td>
                      ))}
                    </tr>
                  </tfoot>
                )}
              </table>

              {visibles.length > 500 && (
                <p className="border-t border-stroke-soft bg-surface-alt px-4 py-2 text-xs text-ink-muted">
                  Se muestran las primeras 500 filas. La descarga incluye las{' '}
                  {visibles.length}.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ReportsPage;
