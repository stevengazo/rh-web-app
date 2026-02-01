import { motion, AnimatePresence } from 'framer-motion';
import SectionTitle from '../Components/SectionTitle';
import Divider from '../Components/Divider';
import PrimaryButton from '../Components/PrimaryButton';
import { useState, useEffect } from 'react';
import OffCanvas from '../Components/OffCanvas';
import ActionAdd from '../Components/organisms/ActionAdd';

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

const ActionsPage = () => {
  const [open, setOpen] = useState(false);
  const [canvasTitle, setCanvasTitle] = useState('');
  const [canvasContent, setCanvasContent] = useState(null);

  const openCanvas = (title, content) => {
    setCanvasTitle(title);
    setCanvasContent(content);
    setOpen(true);
  };

  return (
    <div>
      <div>
        {/* OffCanvas animado */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <OffCanvas
                isOpen={open}
                onClose={() => setOpen(false)}
                title={canvasTitle}
              >
                <motion.div
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 50, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {canvasContent}
                </motion.div>
              </OffCanvas>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

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
            <PrimaryButton
              onClick={() => openCanvas('Agregar Acción', <ActionAdd />)}
            >
              Agregar Acción
            </PrimaryButton>
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
    </div>
  );
};

export default ActionsPage;
