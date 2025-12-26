import { motion } from "framer-motion";

import SectionTitle from "../components/SectionTitle";
import Divider from "../components/Divider";
import PrimaryButton from "../components/PrimaryButton";

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
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

const ActionsPage = () => {
  return (
    <motion.div
      className="space-y-6"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Title */}
      <motion.div variants={itemVariants}>
        <SectionTitle>Acciones de Personal</SectionTitle>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Divider />
      </motion.div>

      {/* Header actions */}
      <motion.div variants={itemVariants} className="flex justify-end">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <PrimaryButton>Agregar Acción</PrimaryButton>
        </motion.div>
      </motion.div>

      {/* Placeholder contenido */}
      <motion.div
        variants={itemVariants}
        className="rounded-lg border border-slate-200 p-6 text-sm text-slate-500"
      >
        <SectionTitle>Aprobadas</SectionTitle>
        Aquí se mostrarán las acciones de personal registradas.
      </motion.div>

      {/* Placeholder contenido */}
      <motion.div
        variants={itemVariants}
        className="rounded-lg border border-slate-200 p-6 text-sm text-slate-500"
      >
        <SectionTitle>Sin Aprobar</SectionTitle>
        Aquí se mostrarán las acciones de personal registradas.
      </motion.div>
    </motion.div>
  );
};

export default ActionsPage;
