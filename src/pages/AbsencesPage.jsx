import absencesApi from '../api/absencesApi';
import PageTitle from '../Components/PageTitle';
import PrimaryButton from '../Components/PrimaryButton';
import AbsenceCalendar from '../Components/organisms/AbsenceCalendar';
import AbsenceTable from '../Components/organisms/AbsenceTable';
import AbsenceAdd from '../Components/organisms/AbsenceAdd';
import OffCanvas from '../Components/OffCanvas';
import { AnimatePresence, motion } from 'framer-motion';

import { useEffect, useMemo, useState } from 'react';

const AbsencesPage = () => {
  const [absences, setAbsences] = useState([]);
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
    const GetData = async () => {
      const resp = await absencesApi.getAllAbsences();
      setAbsences(resp.data ?? []);
      console.table(resp.data);
    };
    GetData();
  }, []);

  // 🔎 filtro reactivo
  const filteredAbsences = useMemo(() => {
    if (!search.trim()) return absences;

    const q = search.toLowerCase();

    return absences.filter((a) =>
      [
        a.title,
        a.reason,
        a.createdBy,
        a.user.firstName,
        a.user.lastName
      ]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(q))
    );
  }, [absences, search]);

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

      <div className="flex flex-row justify-between items-center p-1">
        <PageTitle>Ausencias</PageTitle>

        <PrimaryButton
          onClick={() => {
            openCanvas('Agregar', <AbsenceAdd />);
          }}
        >
          Agregar Registro
        </PrimaryButton>
      </div>

      {/* 🔍 Buscador */}
      <div className="p-2">
        <input
          type="text"
          placeholder="Buscar por título, motivo o creador..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="
            w-full max-w-md
            border border-gray-300 rounded-lg
            px-4 py-2 text-sm
            focus:outline-none focus:ring-2 focus:ring-blue-400
          "
        />
      </div>

      <AbsenceTable items={filteredAbsences} />
    </>
  );
};

export default AbsencesPage;
