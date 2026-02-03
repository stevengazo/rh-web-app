import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import { useState } from 'react';
import SectionTitle from '../Components/SectionTitle';
import Divider from '../Components/Divider';
import PrimaryButton from '../Components/PrimaryButton';
import PayrollListTable from '../Components/organisms/PayrollListTable';
import OffCanvasLarge from '../Components/OffCanvasLarge';
import  PayrollGenerate from '../Components/organisms/PayrollGenerate'

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

  const [open, setOpen] = useState(false);
  const [canvasTitle, setCanvasTitle] = useState('');
  const [canvasContent, setCanvasContent] = useState(null);

  const openCanvas = (title, content) => {
    setCanvasTitle(title);
    setCanvasContent(content);
    setOpen(true);
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

        {/* Action */}
        <motion.div variants={itemVariants} className="flex justify-end">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <PrimaryButton onClick={() => openCanvas('Generar Planilla', <PayrollGenerate /> ) }>
              Generar Nueva Planilla
            </PrimaryButton>
          </motion.div>
        </motion.div>

        {/* Table */}
        <motion.div variants={itemVariants}>
          <PayrollListTable />
        </motion.div>
      </motion.div>
    </>
  );
};

export default PayrollPage;
