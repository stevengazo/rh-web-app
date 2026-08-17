import { motion, AnimatePresence } from 'framer-motion';
import { useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import {
  CheckCircle2,
  Clock,
  Inbox,
  Layers,
  Plus,
  RefreshCw,
  Search,
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
import { ACTION_STATUS, estadoDeAccion } from '../Components/molecules/ActionStatusBadge';
import { fieldClasses } from '../Components/atoms/fieldClasses';
import HelpButton from '../Components/molecules/HelpButton';

import { useAppContext } from '../context/AppContext';
import actionApi from '../api/actionApi';

const StatCard = ({ icon: Icon, label, value, accent, activo, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex items-center gap-3 rounded-xl border bg-surface p-4 text-left shadow-sm transition-all
      hover:-translate-y-0.5 hover:shadow-md
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand
      ${activo ? 'border-brand ring-1 ring-brand' : 'border-stroke-soft'}`}
  >
    <div className={`grid h-11 w-11 place-items-center rounded-lg ${accent}`}>
      <Icon size={20} />
    </div>
    <div>
      <p className="text-2xl font-semibold leading-none text-ink">{value}</p>
      <p className="mt-1 text-sm text-ink-muted">{label}</p>
    </div>
  </button>
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

      {/* Resumen · también funciona como filtro */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Clock}
          label="Pendientes"
          value={porEstado[ACTION_STATUS.PENDING].length}
          accent="bg-amber-50 text-amber-700"
          activo={filtro === ACTION_STATUS.PENDING}
          onClick={() => alternarFiltro(ACTION_STATUS.PENDING)}
        />
        <StatCard
          icon={CheckCircle2}
          label="Aprobadas"
          value={porEstado[ACTION_STATUS.APPROVED].length}
          accent="bg-green-50 text-green-700"
          activo={filtro === ACTION_STATUS.APPROVED}
          onClick={() => alternarFiltro(ACTION_STATUS.APPROVED)}
        />
        <StatCard
          icon={XCircle}
          label="Rechazadas"
          value={porEstado[ACTION_STATUS.REJECTED].length}
          accent="bg-red-50 text-red-600"
          activo={filtro === ACTION_STATUS.REJECTED}
          onClick={() => alternarFiltro(ACTION_STATUS.REJECTED)}
        />
        <StatCard
          icon={Layers}
          label="Total"
          value={actions.length}
          accent="bg-brand-tint text-brand"
          activo={filtro === 'Todas'}
          onClick={() => setFiltro('Todas')}
        />
      </div>

      {/* Buscador */}
      <div className="relative mt-6 w-full md:w-96">
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

      {/* Listado */}
      <div className="mt-4 flex items-center gap-2">
        <h3 className="text-lg font-semibold text-ink">
          {filtro === 'Todas' ? 'Todas las acciones' : filtro + 's'}
        </h3>
        <span className="rounded-full bg-surface-alt px-2 py-0.5 text-xs font-semibold text-ink-secondary">
          {visibles.length}
        </span>
      </div>

      {cargando ? (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-40 animate-pulse rounded-xl bg-surface-alt"
            />
          ))}
        </div>
      ) : (
        <motion.div
          layout
          className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {visibles.length === 0 ? (
            <EmptyState
              message={
                search
                  ? `No hay coincidencias con “${search}”.`
                  : 'No hay acciones registradas todavía.'
              }
            />
          ) : (
            visibles.map((a) => (
              <CardAction
                key={a.actionId}
                action={a}
                OnHandleClick={() => verDetalle(a)}
                onApprove={aprobar}
                onReject={rechazar}
              />
            ))
          )}
        </motion.div>
      )}
    </>
  );
};

export default ActionsPage;
