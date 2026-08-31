import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import NavBar from './NavBar';
import ChatWidget from '../Components/organisms/messaging/ChatWidget';
import { PRODUCTO } from '../data/marketing';

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

      {/* Contenido · lienzo plano: cada página trae su propio relieve, así
          que encerrarlo además en una tarjeta producía marcos dentro de
          marcos. */}
      <motion.main
        className="flex-1 overflow-y-auto bg-canvas px-4 pb-8 pt-20 sm:px-6"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={contentVariants}
      >
        <div className="mx-auto w-full max-w-6xl">
          <Outlet />
        </div>
      </motion.main>

      {/* Footer · una línea discreta, no una franja de color a todo lo ancho */}
      <motion.footer
        className="shrink-0 border-t border-stroke-soft bg-surface px-6 py-3
                   text-center text-xs text-ink-muted"
        initial="hidden"
        animate="visible"
        variants={footerVariants}
      >
        © {new Date().getFullYear()} — {PRODUCTO.nombre}
      </motion.footer>

      <ChatWidget />
    </div>
  );
};

export default MainLayout;