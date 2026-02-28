import { motion, AnimatePresence } from "framer-motion";
import { User, LogOut, PanelsTopLeft, Menu, X } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { useState } from "react";

const NavBar = () => {
  const navigate = useNavigate();
  const { hasRole } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    setIsOpen(false);
    navigate("/");
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
     ${
       isActive
         ? "bg-indigo-600 text-white shadow-md"
         : "text-gray-300 hover:bg-gray-700 hover:text-white"
     }`;

  const closeMenu = () => setIsOpen(false);

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-gray-800 border-b border-gray-700 px-4 sm:px-6 py-3 flex items-center justify-between shadow-lg"
      >
        {/* Logo */}
        <h2 className="text-lg font-semibold text-white tracking-wide">
          R.Humanos
        </h2>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-2">
          {hasRole("admin") && (
            <NavLink to="/manager" className={linkClass}>
              <PanelsTopLeft size={18} />
              Recursos Humanos
            </NavLink>
          )}

          <NavLink to="/my-profile" className={linkClass}>
            <User size={18} />
            Mi Perfil
          </NavLink>

          <NavLink to="/my-kpis" className={linkClass}>
            <User size={18} />
            KPI
          </NavLink>

          <NavLink to="/my-comissions" className={linkClass}>
            <User size={18} />
            Comisiones
          </NavLink>

          <NavLink to="/my-payrolls" className={linkClass}>
            <User size={18} />
            Comprobantes
          </NavLink>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition"
          >
            <LogOut size={18} />
            Salir
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(true)}
          className="md:hidden text-gray-300 hover:text-white"
        >
          <Menu size={24} />
        </button>
      </motion.nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMenu}
              className="fixed inset-0 bg-black/50 z-40"
            />

            {/* Drawer */}
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3 }}
              className="fixed top-0 right-0 h-full w-72 bg-gray-900 z-50 shadow-xl p-6 flex flex-col gap-3"
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-white font-semibold text-lg">
                  Menú
                </h3>
                <button
                  onClick={closeMenu}
                  className="text-gray-300 hover:text-white"
                >
                  <X size={22} />
                </button>
              </div>

              {hasRole("admin") && (
                <NavLink to="/manager" className={linkClass} onClick={closeMenu}>
                  <PanelsTopLeft size={18} />
                  Recursos Humanos
                </NavLink>
              )}

              <NavLink to="/my-profile" className={linkClass} onClick={closeMenu}>
                <User size={18} />
                Mi Perfil
              </NavLink>

              <NavLink to="/my-kpis" className={linkClass} onClick={closeMenu}>
                <User size={18} />
                KPI
              </NavLink>

              <NavLink to="/my-comissions" className={linkClass} onClick={closeMenu}>
                <User size={18} />
                Comisiones
              </NavLink>

              <NavLink to="/my-payrolls" className={linkClass} onClick={closeMenu}>
                <User size={18} />
                Comprobantes
              </NavLink>

              <button
                onClick={handleLogout}
                className="mt-4 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition"
              >
                <LogOut size={18} />
                Salir
              </button>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default NavBar;