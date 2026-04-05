import { Outlet, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ManagerSideBar from './ManagerSideBar';
import { LayoutDashboard } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

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
    <div className="flex h-screen bg-slate-100 overflow-hidden">
      {/* Sidebar */}
      <ManagerSideBar />

      {/* Main Area */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Header */}
        <header
          className="h-16 bg-gray-400 border-b border-slate-400
                     flex items-center justify-between px-4 md:px-6 shrink-0"
        >
          <div className="flex items-center gap-2 text-slate-100">
            <LayoutDashboard size={18} />
            <h1 className="text-base md:text-lg font-semibold">
              Panel de Gestión
            </h1>
          </div>

          <div className="text-xs md:text-sm text-slate-200">RH System</div>
        </header>

        {/* Content */}
        <motion.main
          className="flex-1 min-h-0 bg-gray-300 overflow-y-auto p-4 md:p-6"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={mainVariants}
        >
          <motion.div
            className="
              bg-white
              mx-auto
              rounded-xl
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