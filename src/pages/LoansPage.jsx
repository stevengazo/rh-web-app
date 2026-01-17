import { useEffect, useState } from 'react';
import LoansAdd from '../Components/organisms/LoansAdd';
import LoansTable from '../Components/organisms/LoansTable';
import loansApi from '../api/loansApi';
import OffCanvas from '../components/OffCanvas';
import { AnimatePresence } from 'framer-motion';
import { motion } from 'framer-motion';
import SectionTitle from '../Components/SectionTitle';
import PageTitle from '../Components/PageTitle';
import Divider from '../Components/Divider';

import PrimaryButton from '../components/PrimaryButton';

const LoansPage = () => {
  const [loans, setLoans] = useState([]);

  const [open, setOpen] = useState(false);
  const [canvasTitle, setCanvasTitle] = useState('');
  const [canvasContent, setCanvasContent] = useState(null);

  const openCanvas = (title, content) => {
    setCanvasTitle(title);
    setCanvasContent(content);
    setOpen(true);
  };

  useEffect(() => {
    async function GetData() {
      const response = await loansApi.getAllsLoans();
      setLoans(response.data);
    }
    GetData();
  }, []);

  return (
    <>
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
      <div className="flex flex-row justify-between w-full">
        <PageTitle>Prestamos</PageTitle>
        <PrimaryButton
          onClick={() =>
            openCanvas('Agregar Prestamo', <LoansAdd userId={0} />)
          }
        >
          Agregar Prestamo
        </PrimaryButton>
      </div>
      <Divider />
      <div className="border p-2 rounded ">
        <LoansTable loans={loans} />
      </div>

   

    
    </>
  );
};

export default LoansPage;
