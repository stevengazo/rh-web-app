import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import SectionTitle from '../Components/SectionTitle';
import Divider from '../Components/Divider';
import PrimaryButton from '../Components/PrimaryButton';
import PayrollListTable from '../Components/organisms/PayrollListTable';

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

  return (
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
          <PrimaryButton onClick={() => navigate('/payroll/new')}>
            Generar Nueva Planilla
          </PrimaryButton>
        </motion.div>
      </motion.div>

      {/* Table */}
      <motion.div variants={itemVariants}>
        <PayrollListTable />
      </motion.div>
    </motion.div>
  );
};

export default PayrollPage;
