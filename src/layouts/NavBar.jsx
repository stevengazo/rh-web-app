import { motion } from "framer-motion";
import { User, LogOut, PanelsTopLeft } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const NavBar = () => {
  const navigate = useNavigate();
  const { hasRole } = useAppContext();

  const handleLogout = () => {
    navigate("/");
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
     ${
       isActive
         ? "bg-indigo-600 text-white shadow-md"
         : "text-gray-300 hover:bg-gray-700 hover:text-white"
     }`;

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-gray-800 border-b border-gray-700 px-6 py-3 flex items-center justify-between shadow-lg"
    >
      {/* Logo */}
      <h2 className="text-lg font-semibold text-white tracking-wide">
        R.Humanos
      </h2>

      {/* Links */}
      <div className="flex items-center gap-2">
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

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition"
        >
          <LogOut size={18} />
          Salir
        </button>
      </div>
    </motion.nav>
  );
};

export default NavBar;