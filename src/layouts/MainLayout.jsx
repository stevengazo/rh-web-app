import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import NavBar from './NavBar';

const HEADER_HEIGHT = '64px'; // ajusta si tu NavBar cambia

const MainLayout = () => {
  // Animación para el contenido principal
  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  // Animación para el footer
  const footerVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="h-screen bg-canvas text-ink flex flex-col">
      {/* Header fijo */}
      <header className="fixed top-0 left-0 right-0 w-full z-50">
        <NavBar />
      </header>

      {/* Contenido */}
      <motion.main
        className="flex-1 bg-canvas pt-16 my-3 overflow-y-auto p-6"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={contentVariants}
      >
        <motion.div
          className="bg-surface max-w-7xl mx-auto rounded-xl border border-stroke-soft shadow-sm p-6"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1, transition: { duration: 0.4 } }}
          exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.3 } }}
        >
          <Outlet />
        </motion.div>
      </motion.main>

      {/* Footer */}
      <motion.footer
        className="border-t border-white/10 px-6 py-3 bg-ink text-center text-sm text-white shrink-0"
        initial="hidden"
        animate="visible"
        variants={footerVariants}
      >
        © {new Date().toLocaleDateString('es-CR', { year: 'numeric' })} — RH Sistema
      </motion.footer>
    </div>
  );
};

export default MainLayout;