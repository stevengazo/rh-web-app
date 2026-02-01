import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import loansApi from '../api/loansApi';

import LoansAdd from '../Components/organisms/LoansAdd';
import LoansTable from '../Components/organisms/LoansTable';
import OffCanvas from '../Components/OffCanvas';

import PageTitle from '../Components/PageTitle';
import Divider from '../Components/Divider';
import PrimaryButton from '../Components/PrimaryButton';

const LoansPage = () => {
  const [loans, setLoans] = useState([]);

  const [isCanvasOpen, setIsCanvasOpen] = useState(false);
  const [canvasTitle, setCanvasTitle] = useState('');
  const [canvasContent, setCanvasContent] = useState(null);

  const openCanvas = (title, content) => {
    setCanvasTitle(title);
    setCanvasContent(content);
    setIsCanvasOpen(true);
  };

  const closeCanvas = () => {
    setIsCanvasOpen(false);
    setCanvasContent(null);
  };

  useEffect(() => {
    const fetchLoans = async () => {
      const response = await loansApi.getAllsLoans();
      setLoans(response.data);
    };

    fetchLoans();
  }, []);

  return (
    <>
      {/* OffCanvas */}
      <AnimatePresence>
        {isCanvasOpen && (
          <OffCanvas
            isOpen={isCanvasOpen}
            onClose={closeCanvas}
            title={canvasTitle}
          >
            <motion.div
              initial={{ x: 60, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 60, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              {canvasContent}
            </motion.div>
          </OffCanvas>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <PageTitle>Préstamos</PageTitle>

        <PrimaryButton
          onClick={() =>
            openCanvas('Agregar Préstamo', <LoansAdd userId={0} />)
          }
        >
          Agregar Préstamo
        </PrimaryButton>
      </div>

      <Divider />

      {/* Tabla */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-3">
        <LoansTable loans={loans} />
      </div>
    </>
  );
};

export default LoansPage;
