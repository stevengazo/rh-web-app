import { motion, AnimatePresence } from 'framer-motion';
import { useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import {
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Eye,
  Inbox,
  Layers,
  LayoutGrid,
  Plus,
  RefreshCw,
  RotateCcw,
  Rows3,
  Search,
  X,
  XCircle,
} from 'lucide-react';

import SectionTitle from '../Components/SectionTitle';
import Divider from '../Components/Divider';
import PrimaryButton from '../Components/PrimaryButton';
import SecondaryButton from '../Components/SecondaryButton';
import OffCanvas from '../Components/OffCanvas';
import ActionAdd from '../Components/organisms/ActionAdd';
import CardAction from '../Components/CardActions';
import ViewAction from '../Components/organisms/ViewAction';
import ActionStatusBadge, {
  ACTION_STATUS,
  estadoDeAccion,
} from '../Components/molecules/ActionStatusBadge';
import RowActionButton from '../Components/molecules/RowActionButton';
import { fieldClasses } from '../Components/atoms/fieldClasses';
import HelpButton from '../Components/molecules/HelpButton';

import { useAppContext } from '../context/AppContext';
import actionApi from '../api/actionApi';

/**
 * Filtro por estado.
 *
 * Sustituye a las cuatro tarjetas de indicadores: sobre un listado de unas
 * pocas acciones ocupaban media pantalla para repetir un número que ya está
 * en la propia lista. El conteo sigue visible, dentro del filtro.
 */
const FiltroEstado = ({ icon: Icon, label, cuenta, activo, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={activo}
    className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-medium
      transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand
      ${
        activo
          ? 'border-brand bg-brand-tint text-brand-700'
          : 'border-stroke-soft bg-surface text-ink-secondary hover:border-brand hover:text-brand'
      }`}
  >
    <Icon size={15} />
    {label}
    <span
      className={`rounded-full px-1.5 text-xs font-semibold
        ${activo ? 'bg-brand text-white' : 'bg-surface-alt text-ink-muted'}`}
    >
      {cuenta}
    </span>
  </button>
);

const formatFecha = (valor) => {
  if (!valor || String(valor).startsWith('0001-01-01')) return '—';
  const f = new Date(valor);
  return Number.isNaN(f.getTime())
    ? '—'
    : f.toLocaleDateString('es-CR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
};

const nombreDe = (user) =>
  [user?.firstName, user?.lastName].filter(Boolean).join(' ').trim() ||
  user?.userName ||
  user?.email ||
  'Sin asignar';

const iniciales = (user) => {
  const a = user?.firstName?.trim?.()[0] ?? '';
  const b = user?.lastName?.trim?.()[0] ?? '';
  return (a + b).toUpperCase() || '—';
};

/** Listado en filas: la vista útil cuando hay que revisar muchas acciones. */
const TablaAcciones = ({ acciones, onView, onApprove, onReject, onReopen }) => (
  <div className="w-full overflow-x-auto rounded-xl border border-stroke-soft shadow-sm">
    <table className="min-w-full">
      <thead className="bg-surface-alt text-ink-secondary">
        <tr>
          <th className="px-4 py-3 text-left text-sm font-semibold">Colaborador</th>
          <th className="px-4 py-3 text-left text-sm font-semibold">Tipo</th>
          <th className="px-4 py-3 text-left text-sm font-semibold">Descripción</th>
          <th className="px-4 py-3 text-left text-sm font-semibold">Fecha</th>
          <th className="px-4 py-3 text-left text-sm font-semibold">Estado</th>
          <th className="px-4 py-3 text-center text-sm font-semibold">Acciones</th>
        </tr>
      </thead>

      <tbody className="divide-y divide-stroke-soft bg-surface text-sm">
        {acciones.map((a, i) => {
          const estado = estadoDeAccion(a);
          const pendiente = estado === ACTION_STATUS.PENDING;

          return (
            <motion.tr
              key={a.actionId}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: Math.min(i * 0.03, 0.3) }}
              onClick={() => onView(a)}
              className="cursor-pointer transition-colors hover:bg-canvas"
            >
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-tint text-xs font-semibold text-brand">
                    {iniciales(a.user)}
                  </span>
                  <span className="font-medium text-ink">{nombreDe(a.user)}</span>
                </div>
              </td>

              <td className="px-4 py-3 whitespace-nowrap text-ink-secondary">
                {a.actionType?.name || 'Sin tipo'}
              </td>

              <td className="max-w-xs px-4 py-3 text-ink-muted">
                <span className="line-clamp-1">{a.description || '—'}</span>
              </td>

              <td className="px-4 py-3 whitespace-nowrap text-ink-secondary">
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} className="text-ink-muted" />
                  {formatFecha(a.actionDate)}
                </span>
              </td>

              <td className="px-4 py-3">
                <ActionStatusBadge status={estado} />
                {estado === ACTION_STATUS.REJECTED && a.rejectionReason && (
                  <span className="mt-1 block max-w-40 truncate text-xs text-ink-muted">
                    {a.rejectionReason}
                  </span>
                )}
              </td>

              <td className="px-4 py-3">
                <div className="flex items-center justify-center gap-1">
                  <RowActionButton
                    icon={Eye}
                    label="Ver detalle"
                    tono="brand"
                    onClick={() => onView(a)}
                  />

                  {pendiente ? (
                    <>
                      <RowActionButton
                        icon={Check}
                        label="Aprobar"
                        onClick={() => onApprove(a)}
                      />
                      <RowActionButton
                        icon={X}
                        label="Rechazar"
                        tono="danger"
                        onClick={() => onReject(a)}
                      />
                    </>
                  ) : (
                    <RowActionButton
                      icon={RotateCcw}
                      label="Volver a pendiente"
                      onClick={() => onReopen(a)}
                    />
                  )}
                </div>
              </td>
            </motion.tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

const EmptyState = ({ message }) => (
  <div className="col-span-full flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-stroke bg-surface-alt py-12 text-ink-muted">
    <Inbox size={28} />
    <p className="text-sm">{message}</p>
  </div>
);

const mensajeError = (error, porDefecto) => {
  const data = error?.response?.data;
  return typeof data === 'string' && data ? data : porDefecto;
};

const ActionsPage = () => {
  const { user } = useAppContext();
  const quien = user?.userName ?? user?.email ?? '';

  const [actions, setActions] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [search, setSearch] = useState('');
  const [filtro, setFiltro] = useState('Todas');

  /* La tabla es la vista por defecto: en revisión de acciones lo que se
     compara es quién, qué tipo y en qué estado, y eso se lee mejor en filas. */
  const [vista, setVista] = useState('tabla');

  const [open, setOpen] = useState(false);
  const [canvasTitle, setCanvasTitle] = useState('');
  const [canvasContent, setCanvasContent] = useState(null);

  const openCanvas = (title, content) => {
    setCanvasTitle(title);
    setCanvasContent(content);
    setOpen(true);
  };

  /* Una sola consulta para todos los estados. Antes se hacían dos búsquedas
     (aprobadas y pendientes) que además devolvían 404 al no haber resultados. */
  const cargar = useCallback(async () => {
    setCargando(true);
    try {
      const res = await actionApi.getAllActions();
      setActions(Array.isArray(res?.data) ? res.data : []);
    } catch (error) {
      console.error(error);
      toast.error('No se pudieron cargar las acciones');
      setActions([]);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const porEstado = useMemo(() => {
    const grupos = {
      [ACTION_STATUS.PENDING]: [],
      [ACTION_STATUS.APPROVED]: [],
      [ACTION_STATUS.REJECTED]: [],
    };

    actions.forEach((a) => {
      const estado = estadoDeAccion(a);
      (grupos[estado] ?? grupos[ACTION_STATUS.PENDING]).push(a);
    });

    return grupos;
  }, [actions]);

  const visibles = useMemo(() => {
    const term = search.trim().toLowerCase();

    const base =
      filtro === 'Todas'
        ? actions
        : actions.filter((a) => estadoDeAccion(a) === filtro);

    if (!term) return base;

    return base.filter((a) => {
      const campos = [
        a.user?.firstName,
        a.user?.lastName,
        a.user?.userName,
        a.description,
        a.actionType?.name,
        a.createdBy,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return campos.includes(term);
    });
  }, [actions, search, filtro]);

  /** Ejecuta una acción de aprobación y refresca. */
  const ejecutar = async (fn, exito, errorPorDefecto) => {
    try {
      await fn();
      toast.success(exito);
      setOpen(false);
      await cargar();
    } catch (error) {
      console.error(error);
      toast.error(mensajeError(error, errorPorDefecto));
    }
  };

  const aprobar = (a) =>
    ejecutar(
      () => actionApi.approveAction(a.actionId, quien),
      'Acción aprobada',
      'No se pudo aprobar la acción'
    );

  const rechazar = (a) => {
    const motivo = window.prompt('Motivo del rechazo:');
    if (motivo === null) return;

    if (!motivo.trim()) {
      toast.error('El motivo es obligatorio para rechazar.');
      return;
    }

    ejecutar(
      () => actionApi.rejectAction(a.actionId, motivo.trim(), quien),
      'Acción rechazada',
      'No se pudo rechazar la acción'
    );
  };

  const reabrir = (a) =>
    ejecutar(
      () => actionApi.reopenAction(a.actionId, quien),
      'Acción devuelta a pendiente',
      'No se pudo reabrir la acción'
    );

  const verDetalle = (a) =>
    openCanvas(
      'Información de Acción',
      <ViewAction
        action={a}
        onApprove={aprobar}
        onReject={rechazar}
        onReopen={reabrir}
      />
    );

  const alternarFiltro = (estado) =>
    setFiltro((actual) => (actual === estado ? 'Todas' : estado));

  return (
    <>
      <AnimatePresence>
        {open && (
          <OffCanvas
            isOpen={open}
            onClose={() => setOpen(false)}
            title={canvasTitle}
          >
            {canvasContent}
          </OffCanvas>
        )}
      </AnimatePresence>

      {/* Encabezado */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <SectionTitle className="mb-0">Acciones de Personal</SectionTitle>
            <HelpButton area="acciones" />
          </div>
          <p className="text-sm text-ink-muted">
            Registra, revisa y aprueba las acciones del personal.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <SecondaryButton onClick={cargar} disabled={cargando}>
            <RefreshCw
              size={15}
              className={cargando ? 'animate-spin' : undefined}
            />
            Actualizar
          </SecondaryButton>

          <PrimaryButton
            onClick={() =>
              openCanvas(
                'Agregar Acción',
                <ActionAdd
                  author={user}
                  onAdded={() => {
                    setOpen(false);
                    cargar();
                  }}
                />
              )
            }
          >
            <Plus size={16} />
            Agregar Acción
          </PrimaryButton>
        </div>
      </div>

      <Divider />

      {/* Filtros y buscador en una sola barra */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          <FiltroEstado
            icon={Layers}
            label="Todas"
            cuenta={actions.length}
            activo={filtro === 'Todas'}
            onClick={() => setFiltro('Todas')}
          />
          <FiltroEstado
            icon={Clock}
            label="Pendientes"
            cuenta={porEstado[ACTION_STATUS.PENDING].length}
            activo={filtro === ACTION_STATUS.PENDING}
            onClick={() => alternarFiltro(ACTION_STATUS.PENDING)}
          />
          <FiltroEstado
            icon={CheckCircle2}
            label="Aprobadas"
            cuenta={porEstado[ACTION_STATUS.APPROVED].length}
            activo={filtro === ACTION_STATUS.APPROVED}
            onClick={() => alternarFiltro(ACTION_STATUS.APPROVED)}
          />
          <FiltroEstado
            icon={XCircle}
            label="Rechazadas"
            cuenta={porEstado[ACTION_STATUS.REJECTED].length}
            activo={filtro === ACTION_STATUS.REJECTED}
            onClick={() => alternarFiltro(ACTION_STATUS.REJECTED)}
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="relative w-full md:w-72">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
            />
            <input
              type="search"
              placeholder="Buscar por empleado, tipo o descripción…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={fieldClasses({ className: 'h-10 pl-9' })}
            />
          </div>

          {/* Tabla para revisar en volumen, tarjetas para ojear */}
          <div className="flex shrink-0 rounded-md border border-stroke-soft bg-surface p-0.5">
            {[
              { id: 'tabla', icon: Rows3, label: 'Ver como tabla' },
              { id: 'tarjetas', icon: LayoutGrid, label: 'Ver como tarjetas' },
            ].map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => setVista(id)}
                title={label}
                aria-label={label}
                aria-pressed={vista === id}
                className={`grid h-9 w-9 place-items-center rounded transition-colors
                  ${
                    vista === id
                      ? 'bg-brand-tint text-brand'
                      : 'text-ink-muted hover:text-ink'
                  }`}
              >
                <Icon size={16} />
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5">
        {cargando ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-40 animate-pulse rounded-xl bg-surface-alt"
              />
            ))}
          </div>
        ) : visibles.length === 0 ? (
          <EmptyState
            message={
              search
                ? `No hay coincidencias con “${search}”.`
                : filtro === 'Todas'
                  ? 'No hay acciones registradas todavía.'
                  : `No hay acciones en estado “${filtro}”.`
            }
          />
        ) : vista === 'tabla' ? (
          <TablaAcciones
            acciones={visibles}
            onView={verDetalle}
            onApprove={aprobar}
            onReject={rechazar}
            onReopen={reabrir}
          />
        ) : (
          <motion.div layout className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visibles.map((a) => (
              <CardAction
                key={a.actionId}
                action={a}
                OnHandleClick={() => verDetalle(a)}
                onApprove={aprobar}
                onReject={rechazar}
              />
            ))}
          </motion.div>
        )}
      </div>
    </>
  );
};

export default ActionsPage;
