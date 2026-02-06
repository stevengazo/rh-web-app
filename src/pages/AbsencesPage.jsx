import absencesApi from '../api/absencesApi';
import PageTitle from '../Components/PageTitle';
import PrimaryButton from '../Components/PrimaryButton';
import AbsenceCalendar from '../Components/organisms/AbsenceCalendar';
import AbsenceTable from '../Components/organisms/AbsenceTable';
import AbsenceAdd from '../Components/organisms/AbsenceAdd';
import OffCanvas from '../Components/OffCanvas';
import { AnimatePresence, motion } from 'framer-motion';

import { useEffect, useState } from 'react';

const AbsencesPage = () => {
  const [absences, setAbsences] = useState();

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
      const resp = await absencesApi.getAllAbsences()
      setAbsences(resp.data)
      console.table(resp.data)

    };
    GetData();

  }, []);

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

      <div className="d-flex flex flex-row justify-between p-1">
        <PageTitle>Ausencias</PageTitle>
        <PrimaryButton
          onClick={() => {
            openCanvas('Agregar', <AbsenceAdd />);
          }}
        >
          Agregar Registro
        </PrimaryButton>
      </div>

      <AbsenceTable items={absences} />
    </>
  );
};

export default AbsencesPage;
