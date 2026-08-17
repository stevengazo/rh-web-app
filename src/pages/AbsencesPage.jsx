import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  List,
  Plus,
  RefreshCw,
  Search,
  Users,
  XCircle,
} from 'lucide-react';

import useAbsences, { ABSENCE_STATUS } from '../hooks/useAbsences';
import { useAppContext } from '../context/AppContext';

import PageTitle from '../Components/PageTitle';
import PrimaryButton from '../Components/PrimaryButton';
import SecondaryButton from '../Components/SecondaryButton';
import Divider from '../Components/Divider';
import OffCanvas from '../Components/OffCanvas';
import AbsenceCalendar from '../Components/organisms/AbsenceCalendar';
import AbsenceTable from '../Components/organisms/AbsenceTable';
import AbsenceAdd from '../Components/organisms/AbsenceAdd';
import AbsenceView from '../Components/organisms/AbsenceView';
import { fieldClasses } from '../Components/atoms/fieldClasses';
import HelpButton from '../Components/molecules/HelpButton';

const Indicador = ({ icon: Icon, label, valor, accent, activo, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex items-center gap-3 rounded-xl border bg-surface p-4 text-left shadow-sm transition-all
      hover:-translate-y-0.5 hover:shadow-md
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand
      ${activo ? 'border-brand ring-1 ring-brand' : 'border-stroke-soft'}`}
  >
    <span className={`grid h-11 w-11 place-items-center rounded-lg ${accent}`}>
      <Icon size={20} />
    </span>
    <div>
      <p className="text-xl font-semibold leading-none text-ink">{valor}</p>
      <p className="mt-1 text-sm text-ink-muted">{label}</p>
    </div>
  </button>
);

const AbsencesPage = () => {
  const { user } = useAppContext();

  const {
    cargando,
    search,
    setSearch,
    view,
    setView,
    filtroEstado,
    setFiltroEstado,
    selectedAbsence,

    open,
    canvasTitle,
    canvasContent,
    openCanvas,
    closeCanvas,

    filteredAbsences,
    stats,

    handleSelectAbsence,
    approveAbsence,
    rejectAbsence,
    reopenAbsence,
    reload,
  } = useAbsences({ userName: user?.userName ?? user?.email ?? '' });

  /** Abre el detalle con las acciones de aprobación. */
  const handleSelect = (absence) => {
    handleSelectAbsence(absence, (a) =>
      openCanvas(
        'Detalle de ausencia',
        <AbsenceView
          absence={a}
          onApprove={approveAbsence}
          onReject={rejectAbsence}
          onReopen={reopenAbsence}
        />
      )
    );
  };

  const alternarFiltro = (estado) =>
    setFiltroEstado((actual) => (actual === estado ? 'Todas' : estado));

  return (
    <>
      <AnimatePresence>
        {open && (
          <OffCanvas isOpen={open} onClose={closeCanvas} title={canvasTitle}>
            <motion.div
              initial={{ x: 40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 40, opacity: 0 }}
            >
              {canvasContent}
            </motion.div>
          </OffCanvas>
        )}
      </AnimatePresence>

      {/* Encabezado */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <PageTitle className="mb-0">Ausencias</PageTitle>
            <HelpButton area="ausencias" />
          </div>
          <p className="text-sm text-ink-muted">
            Solicitudes de ausencia e incapacidades, con su aprobación.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <SecondaryButton onClick={reload} disabled={cargando}>
            <RefreshCw
              size={15}
              className={cargando ? 'animate-spin' : undefined}
            />
            Actualizar
          </SecondaryButton>

          <PrimaryButton
            onClick={() =>
              openCanvas(
                'Agregar ausencia',
                <AbsenceAdd
                  onAdded={() => {
                    closeCanvas();
                    reload();
                  }}
                />
              )
            }
          >
            <Plus size={16} />
            Agregar registro
          </PrimaryButton>
        </div>
      </div>

      <Divider />

      {/* Indicadores · también filtran */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Indicador
          icon={AlertCircle}
          label="Pendientes"
          valor={stats.pending}
          accent="bg-amber-50 text-amber-700"
          activo={filtroEstado === ABSENCE_STATUS.PENDING}
          onClick={() => alternarFiltro(ABSENCE_STATUS.PENDING)}
        />
        <Indicador
          icon={CheckCircle2}
          label={`Aprobadas · ${stats.diasAprobados} días`}
          valor={stats.approved}
          accent="bg-green-50 text-green-700"
          activo={filtroEstado === ABSENCE_STATUS.APPROVED}
          onClick={() => alternarFiltro(ABSENCE_STATUS.APPROVED)}
        />
        <Indicador
          icon={XCircle}
          label="Rechazadas"
          valor={stats.rejected}
          accent="bg-red-50 text-red-600"
          activo={filtroEstado === ABSENCE_STATUS.REJECTED}
          onClick={() => alternarFiltro(ABSENCE_STATUS.REJECTED)}
        />
        <Indicador
          icon={Users}
          label="Total"
          valor={stats.total}
          accent="bg-brand-tint text-brand"
          activo={filtroEstado === 'Todas'}
          onClick={() => setFiltroEstado('Todas')}
        />
      </div>

      {/* Buscador y vista */}
      <div className="mt-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div className="relative w-full md:max-w-md">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
          />
          <input
            type="search"
            placeholder="Buscar por título, motivo o empleado…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={fieldClasses({ className: 'h-10 pl-9' })}
          />
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setView('table')}
            className={`flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-semibold transition-colors
              ${
                view === 'table'
                  ? 'border-brand bg-brand-tint text-brand-700'
                  : 'border-stroke-soft bg-surface text-ink-muted hover:text-ink'
              }`}
          >
            <List size={16} />
            Tabla
          </button>

          <button
            type="button"
            onClick={() => setView('calendar')}
            className={`flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-semibold transition-colors
              ${
                view === 'calendar'
                  ? 'border-brand bg-brand-tint text-brand-700'
                  : 'border-stroke-soft bg-surface text-ink-muted hover:text-ink'
              }`}
          >
            <CalendarDays size={16} />
            Calendario
          </button>
        </div>
      </div>

      {/* Contenido */}
      <div className="mt-6">
        {cargando ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-14 animate-pulse rounded-lg bg-surface-alt"
              />
            ))}
          </div>
        ) : view === 'table' ? (
          <AbsenceTable
            items={filteredAbsences}
            onSelect={handleSelect}
            onApprove={approveAbsence}
            onReject={rejectAbsence}
          />
        ) : (
          <AbsenceCalendar
            items={filteredAbsences}
            selectedItem={selectedAbsence}
            onSelect={handleSelect}
          />
        )}
      </div>
    </>
  );
};

export default AbsencesPage;
