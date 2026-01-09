import { motion } from 'framer-motion';
import { Home, User, LogOut, PanelsTopLeft } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';

const NavBar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // aquí luego limpias token / auth
    navigate('/');
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-2 px-4 py-2 rounded-lg transition 
     ${
       isActive ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'
     }`;

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white px-6 py-3 flex  items-center justify-between"
    >
      {/* Logo */}
      <h2 className="text-lg font-semibold text-indigo-600">R.Humanos</h2>

      {/* Links */}
      <div className="flex items-center gap-2">
        <NavLink to="/manager" className={linkClass}>
          <PanelsTopLeft size={18} />
          Recursos Humanos
        </NavLink>

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
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-red-500 hover:bg-red-50 transition"
        >
          <LogOut size={18} />
          Salir
        </button>
      </div>
    </motion.nav>
  );
};

export default NavBar;
