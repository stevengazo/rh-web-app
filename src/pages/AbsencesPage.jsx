import absencesApi from '../api/absencesApi';
import PageTitle from '../Components/PageTitle';
import PrimaryButton from '../Components/PrimaryButton';
import AbsenceCalendar from '../Components/organisms/AbsenceCalendar';
import AbsenceTable from '../Components/organisms/AbsenceTable';
import AbsenceAdd from '../Components/organisms/AbsenceAdd';
import OffCanvas from '../Components/OffCanvas';
import Divider from '../Components/Divider';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';

import { CalendarDays, List, Users, AlertCircle } from 'lucide-react';

const AbsencesPage = () => {
  const [absences, setAbsences] = useState([]);
  const [search, setSearch] = useState('');

  const [view, setView] = useState('table');

  const [selectedAbsence, setSelectedAbsence] = useState(null);

  const [open, setOpen] = useState(false);
  const [canvasTitle, setCanvasTitle] = useState('');
  const [canvasContent, setCanvasContent] = useState(null);

  const openCanvas = (title, content) => {
    setCanvasTitle(title);
    setCanvasContent(content);
    setOpen(true);
  };

  useEffect(() => {
    const GetData = async () => {
      try {
        const resp = await absencesApi.getAllAbsences();
        setAbsences(resp.data ?? []);
      } catch (err) {
        console.error('Error loading absences', err);
      }
    };

    GetData();
  }, []);

  const filteredAbsences = useMemo(() => {
    if (!search.trim()) return absences;

    const q = search.toLowerCase();

    return absences.filter((a) =>
      [a.title, a.reason, a.createdBy, a.user?.firstName, a.user?.lastName]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(q))
    );
  }, [absences, search]);

  const stats = useMemo(() => {
    const total = absences.length;
    const approved = absences.filter((a) => a.status === 'approved').length;
    const pending = absences.filter((a) => a.status === 'pending').length;

    return { total, approved, pending };
  }, [absences]);

  /* seleccionar ausencia desde calendario */
  const handleSelectAbsence = (absence) => {
    setSelectedAbsence(absence);

    openCanvas(
      'Detalle de ausencia',
      <div className="p-4 space-y-2 text-sm">
        <p className="font-semibold">
          {absence.user?.firstName} {absence.user?.lastName}
        </p>

        <p>
          <b>Título:</b> {absence.title}
        </p>

        {absence.reason && (
          <p>
            <b>Motivo:</b> {absence.reason}
          </p>
        )}

        <p>
          <b>Inicio:</b> {new Date(absence.startDate).toLocaleDateString()}
        </p>

        {absence.endDate && (
          <p>
            <b>Fin:</b> {new Date(absence.endDate).toLocaleDateString()}
          </p>
        )}
      </div>
    );
  };

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

      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <PageTitle>Ausencias</PageTitle>

        <PrimaryButton
          onClick={() => openCanvas('Agregar ausencia', <AbsenceAdd />)}
        >
          Agregar registro
        </PrimaryButton>
      </div>

      <Divider />

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="bg-white border rounded-lg p-4 flex items-center gap-3 shadow-sm">
          <Users className="text-blue-500" />
          <div>
            <p className="text-sm text-gray-500">Total ausencias</p>
            <p className="text-xl font-semibold">{stats.total}</p>
          </div>
        </div>

        <div className="bg-white border rounded-lg p-4 flex items-center gap-3 shadow-sm">
          <CalendarDays className="text-green-500" />
          <div>
            <p className="text-sm text-gray-500">Aprobadas</p>
            <p className="text-xl font-semibold">{stats.approved}</p>
          </div>
        </div>

        <div className="bg-white border rounded-lg p-4 flex items-center gap-3 shadow-sm">
          <AlertCircle className="text-orange-500" />
          <div>
            <p className="text-sm text-gray-500">Pendientes</p>
            <p className="text-xl font-semibold">{stats.pending}</p>
          </div>
        </div>
      </div>

      {/* SEARCH + VIEW */}
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
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm border
              ${view === 'table' ? 'bg-gray-900 text-white' : 'bg-white'}
            `}
          >
            <List size={16} />
            Tabla
          </button>

          <button
            onClick={() => setView('calendar')}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm border
              ${view === 'calendar' ? 'bg-gray-900 text-white' : 'bg-white'}
            `}
          >
            <CalendarDays size={16} />
            Calendario
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="mt-6">
        {view === 'table' && <AbsenceTable items={filteredAbsences} />}

        {view === 'calendar' && (
          <AbsenceCalendar
            items={filteredAbsences}
            selectedItem={selectedAbsence}
            onSelect={handleSelectAbsence}
          />
        )}
      </div>
    </>
  );
};

export default AbsencesPage;
