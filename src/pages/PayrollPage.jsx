import { motion, AnimatePresence, number } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import SectionTitle from '../Components/SectionTitle';
import Divider from '../Components/Divider';
import PrimaryButton from '../Components/PrimaryButton';
import PayrollListTable from '../Components/organisms/PayrollListTable';
import OffCanvasLarge from '../Components/OffCanvasLarge';
import PayrollGenerate from '../Components/organisms/PayrollGenerate';

import payrollApi from '../api/payrollApi';

const pageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

const PayrollPage = () => {
  const navigate = useNavigate();

  const [payrolls, setPayrolls] = useState([]);
  const [filteredPayrolls, setFilteredPayrolls] = useState([]);
  const [search, setSearch] = useState('');

  const [open, setOpen] = useState(false);
  const [canvasTitle, setCanvasTitle] = useState('');
  const [canvasContent, setCanvasContent] = useState(null);

  const openCanvas = (title, content) => {
    setCanvasTitle(title);
    setCanvasContent(content);
    setOpen(true);
  };

  // Cargar planillas
  useEffect(() => {
    const getData = async () => {
      try {
        const response = await payrollApi.getAllPayrolls();
        setPayrolls(response.data);
        setFilteredPayrolls(response.data);
        console.log(response.data)
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, []);

  // Buscador
  useEffect(() => {
  
    if (!search) {
      setFilteredPayrolls(payrolls);
      return;
    }


    const value = search.toLowerCase();

    const filtered = payrolls.filter(p =>
      p.payrollId == number.parse(value)  || 
      p.payrollType?.toLowerCase().includes(value)
    );

    setFilteredPayrolls(filtered);
  }, [search, payrolls]);

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

      <motion.div
        className="space-y-6"
        variants={pageVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Title */}
        <motion.div variants={itemVariants}>
          <SectionTitle>Planilla de Empleados</SectionTitle>
        </motion.div>

        {/* Divider */}
        <motion.div variants={itemVariants}>
          <Divider />
        </motion.div>

        {/* Actions + Search */}
        <motion.div
          variants={itemVariants}
          className="flex justify-between items-center gap-4"
        >
          <input
            type="text"
            placeholder="Buscar por código, periodo o estado..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-80 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />

          <PrimaryButton
            onClick={() =>
              openCanvas('Generar Planilla', <PayrollGenerate />)
            }
          >
            Generar Nueva Planilla
          </PrimaryButton>
        </motion.div>

        {/* Table */}
        <motion.div variants={itemVariants}>
          <PayrollListTable payrolls={filteredPayrolls} />
        </motion.div>
      </motion.div>
    </>
  );
};

export default PayrollPage;
