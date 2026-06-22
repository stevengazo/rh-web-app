import { Outlet, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ManagerSideBar from './ManagerSideBar';
import { LayoutDashboard } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import TopbarSearch from '../Components/organisms/TopbarSearch';

const ManagerLayout = () => {
  const { hasRole, isAuthenticated } = useAppContext();

  // 🔐 Si no está autenticado → login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 🔐 Si no tiene rol admin → no autorizado
  if (!hasRole('Admin')) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Animaciones
  const mainVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.3 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.98 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
    exit: { opacity: 0, scale: 0.98, transition: { duration: 0.3 } },
  };

  return (
    <div className="flex h-screen bg-canvas overflow-hidden">
      {/* Sidebar */}
      <ManagerSideBar />

      {/* Main Area */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Header */}
        <header
          className="h-16 bg-surface border-b border-stroke-soft
                     flex items-center gap-3 md:gap-6 px-4 md:px-6 shrink-0"
        >
          <div className="flex shrink-0 items-center gap-2 text-ink">
            <LayoutDashboard size={18} className="text-brand" />
            <h1 className="hidden text-base font-semibold sm:block md:text-lg">
              Panel de Gestión
            </h1>
          </div>

          {/* Buscador global */}
          <div className="flex flex-1 justify-center md:justify-end">
            <TopbarSearch />
          </div>

          <div className="hidden shrink-0 text-xs text-ink-muted lg:block">
            RH System
          </div>
        </header>

        {/* Content */}
        <motion.main
          className="flex-1 min-h-0 bg-canvas overflow-y-auto p-4 md:p-6"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={mainVariants}
        >
          <motion.div
            className="
              bg-surface
              mx-auto
              rounded-xl
              border border-stroke-soft
              shadow-sm
              p-4 md:p-6
              max-w-full
              md:max-w-5xl
              lg:max-w-6xl
            "
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={cardVariants}
          >
            <Outlet />
          </motion.div>
        </motion.main>
      </div>
    </div>
  );
};

export default ManagerLayout;