import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';
import {
  Plus,
  Search,
  Clock,
  CheckCircle2,
  Layers,
  Inbox,
} from 'lucide-react';

import SectionTitle from '../Components/SectionTitle';
import Divider from '../Components/Divider';
import PrimaryButton from '../Components/PrimaryButton';
import OffCanvas from '../Components/OffCanvas';
import ActionAdd from '../Components/organisms/ActionAdd';

import { useAppContext } from '../context/AppContext';
import actionApi from '../api/actionApi';
import CardAction from '../Components/CardActions';
import ViewAction from '../Components/organisms/ViewAction';

const StatCard = ({ icon: Icon, label, value, accent }) => (
  <div className="flex items-center gap-3 rounded-xl border border-stroke-soft bg-surface p-4 shadow-sm">
    <div className={`grid h-11 w-11 place-items-center rounded-lg ${accent}`}>
      <Icon size={20} />
    </div>
    <div>
      <p className="text-2xl font-semibold leading-none text-ink">{value}</p>
      <p className="mt-1 text-sm text-ink-muted">{label}</p>
    </div>
  </div>
);

const EmptyState = ({ message }) => (
  <div className="col-span-full flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-stroke bg-surface-alt py-10 text-ink-muted">
    <Inbox size={28} />
    <p className="text-sm">{message}</p>
  </div>
);

const ActionsPage = () => {
  const { user } = useAppContext();

  const [approvedActions, setApprovedActions] = useState([]);
  const [pendingActions, setPendingActions] = useState([]);
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [canvasTitle, setCanvasTitle] = useState('');
  const [canvasContent, setCanvasContent] = useState(null);

  const openCanvas = (title, content) => {
    setCanvasTitle(title);
    setCanvasContent(content);
    setOpen(true);
  };

  useEffect(() => {
    const loadActions = async () => {
      try {
        const approvedRes = await actionApi.searchActions({ Approved: true });
        setApprovedActions(approvedRes.data ?? []);
      } catch (error) {
        console.error(error);
        setApprovedActions([]);
      }

      try {
        const pendingRes = await actionApi.searchActions({ Approved: false });
        setPendingActions(pendingRes.data ?? []);
      } catch (error) {
        console.error(error);
        setPendingActions([]);
      }
    };

    loadActions();
  }, []);

  const filterActions = (actions) => {
    if (!search) return actions;

    const term = search.toLowerCase();

    return actions.filter(
      (a) =>
        `${a.user?.firstName} ${a.user?.lastName}`
          .toLowerCase()
          .includes(term) ||
        a.description?.toLowerCase().includes(term) ||
        a.actionType?.name?.toLowerCase().includes(term)
    );
  };

  const filteredPending = useMemo(
    () => filterActions(pendingActions),
    [pendingActions, search]
  );
  const filteredApproved = useMemo(
    () => filterActions(approvedActions),
    [approvedActions, search]
  );

  return (
    <>
      {/* OffCanvas */}
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

      {/* Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <SectionTitle className="mb-0">Acciones de Personal</SectionTitle>
          <p className="text-sm text-ink-muted">
            Registra, revisa y aprueba las acciones del personal.
          </p>
        </div>

        <PrimaryButton
          onClick={() => openCanvas('Agregar Acción', <ActionAdd author={user} />)}
        >
          <Plus size={16} />
          Agregar Acción
        </PrimaryButton>
      </div>

      <Divider />

      {/* Resumen */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          icon={Clock}
          label="Sin aprobar"
          value={pendingActions.length}
          accent="bg-amber-50 text-amber-700"
        />
        <StatCard
          icon={CheckCircle2}
          label="Aprobadas"
          value={approvedActions.length}
          accent="bg-green-50 text-green-700"
        />
        <StatCard
          icon={Layers}
          label="Total"
          value={pendingActions.length + approvedActions.length}
          accent="bg-brand-tint text-brand"
        />
      </div>

      {/* Search */}
      <div className="relative mt-6 w-full md:w-1/3">
        <Search
          size={18}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
        />
        <input
          type="text"
          placeholder="Buscar por empleado, tipo o descripción…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-md border border-stroke bg-surface py-2 pl-10 pr-4 text-sm
            focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand"
        />
      </div>

      {/* Pendientes */}
      <div className="mt-8 flex items-center gap-2">
        <Clock size={18} className="text-amber-600" />
        <h3 className="text-lg font-semibold text-ink">Sin aprobar</h3>
        <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-800">
          {filteredPending.length}
        </span>
      </div>
      <motion.div
        layout
        className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {filteredPending.length === 0 ? (
          <EmptyState
            message={
              search
                ? 'No hay coincidencias en pendientes.'
                : 'No hay acciones pendientes de aprobación.'
            }
          />
        ) : (
          filteredPending.map((a) => (
            <CardAction
              key={a.actionId}
              action={a}
              status="pending"
              OnHandleClick={() =>
                openCanvas('Información de Acción', <ViewAction action={a} />)
              }
            />
          ))
        )}
      </motion.div>

      {/* Aprobadas */}
      <div className="mt-8 flex items-center gap-2">
        <CheckCircle2 size={18} className="text-green-600" />
        <h3 className="text-lg font-semibold text-ink">Aprobadas</h3>
        <span className="rounded-full bg-green-50 px-2 py-0.5 text-xs font-semibold text-green-700">
          {filteredApproved.length}
        </span>
      </div>
      <motion.div
        layout
        className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {filteredApproved.length === 0 ? (
          <EmptyState
            message={
              search
                ? 'No hay coincidencias en aprobadas.'
                : 'Aún no hay acciones aprobadas.'
            }
          />
        ) : (
          filteredApproved.map((a) => (
            <CardAction
              key={a.actionId}
              action={a}
              status="approved"
              OnHandleClick={() =>
                openCanvas('Información de Acción', <ViewAction action={a} />)
              }
            />
          ))
        )}
      </motion.div>
    </>
  );
};

export default ActionsPage;
