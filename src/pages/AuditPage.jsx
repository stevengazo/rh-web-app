import { useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import {
  Activity,
  ChevronLeft,
  ChevronRight,
  FilePlus2,
  FileX2,
  History,
  Pencil,
  RefreshCw,
  Search,
  ShieldOff,
  X,
} from 'lucide-react';

import auditApi from '../api/auditApi';
import PageTitle from '../Components/PageTitle';
import Divider from '../Components/Divider';
import SecondaryButton from '../Components/SecondaryButton';
import OffCanvas from '../Components/OffCanvas';
import { fieldClasses } from '../Components/atoms/fieldClasses';
import { mensajeDeError } from '../utils/apiError';

/** Presentación de cada tipo de cambio. */
const ACCIONES = {
  Creado: { icon: FilePlus2, color: 'bg-green-50 text-green-700', borde: 'border-l-green-500' },
  Modificado: { icon: Pencil, color: 'bg-brand-tint text-brand', borde: 'border-l-brand' },
  Eliminado: { icon: FileX2, color: 'bg-red-50 text-red-600', borde: 'border-l-red-500' },
  'Dado de baja': { icon: ShieldOff, color: 'bg-amber-50 text-amber-700', borde: 'border-l-amber-400' },
};

/** Nombre en español de la entidad; el API guarda el del modelo. */
const ENTIDADES = {
  Payroll: 'Planilla',
  Employee_Payroll: 'Fila de planilla',
  Extra: 'Hora extra',
  Absence: 'Ausencia',
  Vacation: 'Vacaciones',
  Action: 'Acción de personal',
  Loan: 'Préstamo',
  Payment: 'Abono',
  Salary: 'Salario',
  AppUser: 'Colaborador',
  Departament: 'Departamento',
  Certification: 'Certificación',
  Course: 'Curso',
  Comission: 'Comisión',
  Award: 'Reconocimiento',
  FileModel: 'Documento',
  WebhookSubscription: 'Webhook',
  McpConfiguration: 'Configuración MCP',
  'IdentityUserRole<string>': 'Rol de usuario',
  IdentityRole: 'Rol',
};

const etiquetaEntidad = (e) => ENTIDADES[e] ?? e;

const formatFechaHora = (valor) => {
  if (!valor) return '—';
  const f = new Date(valor);
  return Number.isNaN(f.getTime())
    ? '—'
    : f.toLocaleString('es-CR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
};

/** «hace 5 min», para lo reciente. */
const haceCuanto = (valor) => {
  const f = new Date(valor);
  if (Number.isNaN(f.getTime())) return '';

  const seg = Math.floor((Date.now() - f.getTime()) / 1000);
  if (seg < 60) return 'hace un momento';
  if (seg < 3600) return `hace ${Math.floor(seg / 60)} min`;
  if (seg < 86400) return `hace ${Math.floor(seg / 3600)} h`;
  return `hace ${Math.floor(seg / 86400)} d`;
};

const HOY = () => new Date().toISOString().slice(0, 10);

/** Detalle de una entrada: campo por campo, antes y después. */
const DetalleEntrada = ({ entrada }) => {
  const cambios = useMemo(() => {
    try {
      return JSON.parse(entrada?.changes ?? '[]');
    } catch {
      return [];
    }
  }, [entrada?.changes]);

  if (!entrada) return null;

  const estilo = ACCIONES[entrada.action] ?? ACCIONES.Modificado;
  const Icono = estilo.icon;

  return (
    <div className="space-y-5 text-ink">
      <div className="flex items-start gap-3">
        <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${estilo.color}`}>
          <Icono size={18} />
        </span>

        <div className="min-w-0">
          <p className="font-semibold text-ink">
            {etiquetaEntidad(entrada.entity)}
            {entrada.entityId && (
              <span className="ml-1 font-mono text-sm font-normal text-ink-muted">
                #{entrada.entityId}
              </span>
            )}
          </p>
          <p className="text-sm text-ink-muted">{entrada.action}</p>
        </div>
      </div>

      <dl className="grid grid-cols-1 gap-3 rounded-xl border border-stroke-soft bg-surface-alt p-4 sm:grid-cols-2">
        {[
          ['Quién', entrada.userName || 'sistema'],
          ['Cuándo', formatFechaHora(entrada.createdAt)],
          ['Origen', entrada.endpoint],
          ['Dirección IP', entrada.ipAddress],
        ].map(([label, valor]) => (
          <div key={label}>
            <dt className="text-xs uppercase tracking-wide text-ink-muted">
              {label}
            </dt>
            <dd className="mt-0.5 break-all font-mono text-xs text-ink">
              {valor || '—'}
            </dd>
          </div>
        ))}
      </dl>

      <section>
        <h3 className="mb-2 text-xs font-bold uppercase tracking-widest text-brand">
          {entrada.action === 'Modificado'
            ? `Campos que cambiaron (${cambios.length})`
            : `Valores del registro (${cambios.length})`}
        </h3>

        {cambios.length === 0 ? (
          <p className="text-sm text-ink-muted">Sin detalle guardado.</p>
        ) : (
          <ul className="divide-y divide-stroke-soft rounded-lg border border-stroke-soft">
            {cambios.map((c, i) => (
              <li key={`${c.field}-${i}`} className="p-3">
                <p className="font-mono text-xs font-semibold text-ink-secondary">
                  {c.field}
                </p>

                <div className="mt-1 flex flex-wrap items-center gap-2 text-sm">
                  {c.before != null && (
                    <span className="rounded bg-red-50 px-2 py-0.5 text-red-700 line-through">
                      {c.before}
                    </span>
                  )}

                  {c.before != null && c.after != null && (
                    <span className="text-ink-muted">→</span>
                  )}

                  {c.after != null && (
                    <span className="rounded bg-green-50 px-2 py-0.5 text-green-700">
                      {c.after}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <p className="rounded-lg bg-surface-alt p-3 text-xs text-ink-muted">
        Las entradas se generan al guardar y no se pueden editar ni borrar. Los
        campos sensibles —contraseñas, tokens y secretos— nunca se copian aquí.
      </p>
    </div>
  );
};

/**
 * Registro de auditoría.
 *
 * Responde a «¿quién cambió esto y cuándo?». Las entradas las escribe el
 * contexto de base al guardar, así que cubre todo cambio venga de donde venga:
 * una pantalla, el servidor MCP o un script.
 */
const AuditPage = () => {
  const [datos, setDatos] = useState({ items: [], total: 0, totalPages: 1 });
  const [opciones, setOpciones] = useState({ entidades: [], acciones: [], usuarios: [] });
  const [stats, setStats] = useState(null);

  const [cargando, setCargando] = useState(true);
  const [entrada, setEntrada] = useState(null);

  const [filtros, setFiltros] = useState({
    entity: '',
    action: '',
    userId: '',
    search: '',
    from: '',
    to: '',
    page: 1,
    pageSize: 50,
  });

  const cambiar = (parcial) =>
    setFiltros((prev) => ({ ...prev, ...parcial, page: parcial.page ?? 1 }));

  const cargar = useCallback(async () => {
    setCargando(true);

    try {
      /* Los campos vacíos no se mandan: el backend los trataría como filtro
         por cadena vacía en vez de "sin filtro". */
      const params = Object.fromEntries(
        Object.entries(filtros).filter(([, v]) => v !== '' && v != null)
      );

      const [logsRes, filtrosRes, statsRes] = await Promise.all([
        auditApi.getLogs(params),
        auditApi.getFilters(),
        auditApi.getStats(7),
      ]);

      setDatos(logsRes?.data ?? { items: [], total: 0, totalPages: 1 });
      setOpciones(filtrosRes?.data ?? { entidades: [], acciones: [], usuarios: [] });
      setStats(statsRes?.data ?? null);
    } catch (error) {
      console.error(error);
      toast.error(mensajeDeError(error, 'No se pudo cargar la auditoría.'));
    } finally {
      setCargando(false);
    }
  }, [filtros]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const hayFiltros =
    filtros.entity || filtros.action || filtros.userId || filtros.search ||
    filtros.from || filtros.to;

  return (
    <>
      <OffCanvas
        isOpen={entrada !== null}
        onClose={() => setEntrada(null)}
        title="Detalle del cambio"
      >
        <DetalleEntrada entrada={entrada} />
      </OffCanvas>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <PageTitle className="mb-0">Auditoría</PageTitle>
          <p className="text-sm text-ink-muted">
            Todo cambio guardado en el sistema, con quién lo hizo y desde dónde.
          </p>
        </div>

        <SecondaryButton onClick={cargar} disabled={cargando}>
          <RefreshCw size={15} className={cargando ? 'animate-spin' : undefined} />
          Actualizar
        </SecondaryButton>
      </div>

      <Divider />

      {/* Cifras */}
      {stats && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            { label: 'Cambios registrados', valor: stats.total, icon: History },
            { label: 'En los últimos 7 días', valor: stats.enElPeriodo, icon: Activity },
            { label: 'Personas activas', valor: stats.personas, icon: Pencil },
          ].map(({ label, valor, icon: Icono }) => (
            <div
              key={label}
              className="flex items-center gap-3 rounded-xl border border-stroke-soft bg-surface p-4"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand-tint text-brand">
                <Icono size={18} />
              </span>
              <div>
                <p className="text-xl font-semibold leading-none text-ink">
                  {valor}
                </p>
                <p className="mt-1 text-sm text-ink-muted">{label}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Filtros */}
      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <div className="relative lg:col-span-2">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
          />
          <input
            type="search"
            placeholder="Buscar en el resumen, la entidad o la persona…"
            value={filtros.search}
            onChange={(e) => cambiar({ search: e.target.value })}
            className={fieldClasses({ className: 'h-10 pl-9' })}
          />
        </div>

        <select
          value={filtros.entity}
          onChange={(e) => cambiar({ entity: e.target.value })}
          aria-label="Filtrar por entidad"
          className={fieldClasses({ className: 'h-10' })}
        >
          <option value="">Toda entidad</option>
          {opciones.entidades.map((e) => (
            <option key={e.entity} value={e.entity}>
              {etiquetaEntidad(e.entity)} ({e.count})
            </option>
          ))}
        </select>

        <select
          value={filtros.action}
          onChange={(e) => cambiar({ action: e.target.value })}
          aria-label="Filtrar por acción"
          className={fieldClasses({ className: 'h-10' })}
        >
          <option value="">Toda acción</option>
          {opciones.acciones.map((a) => (
            <option key={a.action} value={a.action}>
              {a.action} ({a.count})
            </option>
          ))}
        </select>

        <select
          value={filtros.userId}
          onChange={(e) => cambiar({ userId: e.target.value })}
          aria-label="Filtrar por persona"
          className={fieldClasses({ className: 'h-10' })}
        >
          <option value="">Cualquier persona</option>
          {opciones.usuarios.map((u) => (
            <option key={u.userId} value={u.userId}>
              {u.userName} ({u.count})
            </option>
          ))}
        </select>

        <div className="flex items-center gap-2 sm:col-span-2">
          <input
            type="date"
            value={filtros.from}
            max={filtros.to || HOY()}
            onChange={(e) => cambiar({ from: e.target.value })}
            aria-label="Desde"
            className={fieldClasses({ className: 'h-10' })}
          />
          <span className="shrink-0 text-sm text-ink-muted">a</span>
          <input
            type="date"
            value={filtros.to}
            min={filtros.from}
            max={HOY()}
            onChange={(e) => cambiar({ to: e.target.value })}
            aria-label="Hasta"
            className={fieldClasses({ className: 'h-10' })}
          />
        </div>

        {hayFiltros && (
          <button
            type="button"
            onClick={() =>
              setFiltros({
                entity: '', action: '', userId: '', search: '',
                from: '', to: '', page: 1, pageSize: 50,
              })
            }
            className="inline-flex h-10 items-center justify-center gap-1.5 rounded-md border
                       border-stroke bg-surface px-3 text-sm font-semibold text-ink-secondary
                       transition-colors hover:border-brand hover:text-brand"
          >
            <X size={15} />
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Listado */}
      <div className="mt-5">
        {cargando ? (
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-14 animate-pulse rounded-lg bg-surface-alt" />
            ))}
          </div>
        ) : datos.items.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-stroke bg-surface-alt py-14 text-ink-muted">
            <History size={28} />
            <p className="text-sm font-medium">Sin registros</p>
            <p className="text-center text-xs">
              {hayFiltros
                ? 'Ningún cambio coincide con los filtros.'
                : 'Todavía no se ha guardado ningún cambio.'}
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-stroke-soft overflow-hidden rounded-xl border border-stroke-soft bg-surface">
            {datos.items.map((log) => {
              const estilo = ACCIONES[log.action] ?? ACCIONES.Modificado;
              const Icono = estilo.icon;

              return (
                <li key={log.auditLogId}>
                  <button
                    type="button"
                    onClick={() => setEntrada(log)}
                    className={`flex w-full items-start gap-3 border-l-4 px-4 py-3 text-left
                                transition-colors hover:bg-canvas ${estilo.borde}`}
                  >
                    <span
                      className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg ${estilo.color}`}
                    >
                      <Icono size={15} />
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-ink">
                        {log.summary || `${etiquetaEntidad(log.entity)} · ${log.action}`}
                      </span>

                      <span className="mt-0.5 block truncate text-xs text-ink-muted">
                        <span className="font-medium text-ink-secondary">
                          {log.userName || 'sistema'}
                        </span>
                        {' · '}
                        {formatFechaHora(log.createdAt)}
                        {' · '}
                        {haceCuanto(log.createdAt)}
                        {log.endpoint && (
                          <>
                            {' · '}
                            <span className="font-mono">{log.endpoint}</span>
                          </>
                        )}
                      </span>
                    </span>

                    <span className="shrink-0 rounded-full border border-stroke-soft px-2 py-0.5 text-[11px] font-semibold text-ink-muted">
                      {etiquetaEntidad(log.entity)}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Paginado */}
      {datos.totalPages > 1 && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-ink-muted">
            Página {datos.page} de {datos.totalPages} · {datos.total} cambios
          </p>

          <div className="flex gap-2">
            <SecondaryButton
              onClick={() => setFiltros((p) => ({ ...p, page: p.page - 1 }))}
              disabled={datos.page <= 1}
            >
              <ChevronLeft size={15} />
              Anterior
            </SecondaryButton>

            <SecondaryButton
              onClick={() => setFiltros((p) => ({ ...p, page: p.page + 1 }))}
              disabled={datos.page >= datos.totalPages}
            >
              Siguiente
              <ChevronRight size={15} />
            </SecondaryButton>
          </div>
        </div>
      )}
    </>
  );
};

export default AuditPage;
