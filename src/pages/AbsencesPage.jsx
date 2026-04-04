import useAbsences from '../hooks/useAbsences';

import PageTitle from '../Components/PageTitle';
import PrimaryButton from '../Components/PrimaryButton';
import AbsenceCalendar from '../Components/organisms/AbsenceCalendar';
import AbsenceTable from '../Components/organisms/AbsenceTable';
import AbsenceAdd from '../Components/organisms/AbsenceAdd';
import OffCanvas from '../Components/OffCanvas';
import Divider from '../Components/Divider';

import { AnimatePresence, motion } from 'framer-motion';
import { CalendarDays, List, Users, AlertCircle } from 'lucide-react';

const AbsencesPage = () => {
  const {
    search,
    setSearch,
    view,
    setView,
    selectedAbsence,

    open,
    canvasTitle,
    canvasContent,
    openCanvas,
    closeCanvas,

    filteredAbsences,
    stats,

    handleSelectAbsence,
  } = useAbsences();

  /* =========================
   * HANDLERS
   * ========================= */
  const handleSelect = (absence) => {
    handleSelectAbsence(absence, (a) =>
      openCanvas(
        'Detalle de ausencia',
        <div className="p-4 space-y-2 text-sm">
          <p className="font-semibold">
            {a.user?.firstName} {a.user?.lastName}
          </p>

          <p>
            <b>Título:</b> {a.title}
          </p>

          {a.reason && (
            <p>
              <b>Motivo:</b> {a.reason}
            </p>
          )}

          <p>
            <b>Inicio:</b> {new Date(a.startDate).toLocaleDateString()}
          </p>

          {a.endDate && (
            <p>
              <b>Fin:</b> {new Date(a.endDate).toLocaleDateString()}
            </p>
          )}
        </div>
      )
    );
  };

  return (
    <>
      {/* =========================
          OFFCANVAS
      ========================= */}
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

      {/* =========================
          HEADER
      ========================= */}
      <div className="flex justify-between items-center mb-4">
        <PageTitle>Ausencias</PageTitle>

        <PrimaryButton
          onClick={() => openCanvas('Agregar ausencia', <AbsenceAdd />)}
        >
          Agregar registro
        </PrimaryButton>
      </div>

      <Divider />

      {/* =========================
          STATS
      ========================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="bg-white border border-gray-100 rounded-lg p-4 flex items-center gap-3 shadow-sm">
          <Users className="text-blue-500" />
          <div>
            <p className="text-sm text-gray-500">Total ausencias</p>
            <p className="text-xl font-semibold">{stats.total}</p>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-lg p-4 flex items-center gap-3 shadow-sm">
          <CalendarDays className="text-green-500" />
          <div>
            <p className="text-sm text-gray-500">Aprobadas</p>
            <p className="text-xl font-semibold">{stats.approved}</p>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-lg p-4 flex items-center gap-3 shadow-sm">
          <AlertCircle className="text-orange-500" />
          <div>
            <p className="text-sm text-gray-500">Pendientes</p>
            <p className="text-xl font-semibold">{stats.pending}</p>
          </div>
        </div>
      </div>

      {/* =========================
          SEARCH + VIEW
      ========================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-6">
        <input
          type="text"
          placeholder="Buscar por título, motivo o empleado..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="
            w-full md:max-w-md
            border border-gray-300 rounded-lg
            px-4 py-2 text-sm
            focus:outline-none focus:ring-2 focus:ring-blue-400
          "
        />

        <div className="flex gap-2">
          <button
            onClick={() => setView('table')}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm border border-gray-100
              ${view === 'table' ? 'bg-gray-900 text-white' : 'bg-white'}
            `}
          >
            <List size={16} />
            Tabla
          </button>

          <button
            onClick={() => setView('calendar')}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm border border-gray-100
              ${view === 'calendar' ? 'bg-gray-900 text-white' : 'bg-white'}
            `}
          >
            <CalendarDays size={16} />
            Calendario
          </button>
        </div>
      </div>

      {/* =========================
          CONTENT
      ========================= */}
      <div className="mt-6">
        {view === 'table' && <AbsenceTable items={filteredAbsences} />}

        {view === 'calendar' && (
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
