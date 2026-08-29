import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  BarChart3,
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
import AbsenceStats from '../Components/organisms/AbsenceStats';
import { fieldClasses } from '../Components/atoms/fieldClasses';
import HelpButton from '../Components/molecules/HelpButton';
import Tabs from '../Components/molecules/Tabs';

/**
 * Filtro por estado.
 *
 * Las cuatro tarjetas de indicadores ocupaban una franja entera para repetir
 * números que ahora viven, con contexto, en la pestaña de estadísticas. El
 * conteo se conserva dentro del propio filtro.
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

const AbsencesPage = () => {
  const { user } = useAppContext();

  const {
    absences,
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

      {/* Vistas */}
      <div className="mt-6">
        <Tabs
          idGrupo="ausencias"
          value={view}
          onChange={setView}
          items={[
            { id: 'table', label: 'Tabla', icon: List, count: filteredAbsences.length },
            { id: 'calendar', label: 'Calendario', icon: CalendarDays },
            { id: 'stats', label: 'Estadísticas', icon: BarChart3 },
          ]}
        />
      </div>

      {/* Filtros y buscador · no aplican a las estadísticas, que miran el total */}
      {view !== 'stats' && (
        <div className="mt-5 flex flex-col justify-between gap-3 lg:flex-row lg:items-center">
          <div className="flex flex-wrap gap-2">
            <FiltroEstado
              icon={Users}
              label="Todas"
              cuenta={stats.total}
              activo={filtroEstado === 'Todas'}
              onClick={() => setFiltroEstado('Todas')}
            />
            <FiltroEstado
              icon={AlertCircle}
              label="Pendientes"
              cuenta={stats.pending}
              activo={filtroEstado === ABSENCE_STATUS.PENDING}
              onClick={() => alternarFiltro(ABSENCE_STATUS.PENDING)}
            />
            <FiltroEstado
              icon={CheckCircle2}
              label="Aprobadas"
              cuenta={stats.approved}
              activo={filtroEstado === ABSENCE_STATUS.APPROVED}
              onClick={() => alternarFiltro(ABSENCE_STATUS.APPROVED)}
            />
            <FiltroEstado
              icon={XCircle}
              label="Rechazadas"
              cuenta={stats.rejected}
              activo={filtroEstado === ABSENCE_STATUS.REJECTED}
              onClick={() => alternarFiltro(ABSENCE_STATUS.REJECTED)}
            />
          </div>

          <div className="relative w-full lg:max-w-xs">
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
        </div>
      )}

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
        ) : view === 'stats' ? (
          <AbsenceStats absences={absences} />
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
