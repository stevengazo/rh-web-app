import { useEffect, useState } from 'react';
import SectionTitle from '../Components/SectionTitle';
import Employee_PayrollApi from '../api/Employee_PayrollApi';
import { useAppContext } from '../context/AppContext';
import { AnimatePresence, motion } from 'framer-motion';
import OffCanvasLarge from '../Components/OffCanvasLarge';
import TablePayrollsData from '../Components/organisms/TablePayrollsData';

const MyPayrollsPage = () => {
  const { user } = useAppContext();
  const [payrollsData, setPayrollsData] = useState([]);
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
      const Response = await Employee_PayrollApi.Search({
        employeeId: user.id,
      });
      setPayrollsData(Response.data);
      console.log(Response.data);
    };

    GetData();
  }, []);

  const OnSelected = (element) => {
    openCanvas('Ver datos', <>{element}</>);
  };

  return (
    <>
      {/* OffCanvas */}
      <AnimatePresence>
        {open && (
          <OffCanvasLarge
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
          </OffCanvasLarge>
        )}
      </AnimatePresence>
      <SectionTitle>Mis Comprobantes</SectionTitle>
      <TablePayrollsData items={payrollsData} HandleShowEdit={openCanvas} />
    </>
  );
};

export default MyPayrollsPage;
