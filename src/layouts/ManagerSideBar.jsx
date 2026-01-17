import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  Cog,
  FileText,
  Briefcase,
  User,
  LogOut,
} from 'lucide-react';

const navItemClass = ({ isActive }) =>
  `flex items-center gap-3 px-3 py-2 rounded-lg transition
   ${
     isActive
       ? 'bg-slate-700 text-white'
       : 'text-slate-300 hover:bg-slate-800 hover:text-white'
   }`;

const ManagerSideBar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // TODO: limpiar token / auth state
    navigate('/');
  };

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center justify-center text-lg font-semibold border-b border-slate-700">
        RH Manager
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-4 text-sm">
        {/* ===== MANAGER ===== */}
        <div>
          <p className="px-3 mb-2 text-xs uppercase tracking-wide text-slate-500">
            Gestión
          </p>

          <div className="space-y-1">
            <NavLink to="/manager" end className={navItemClass}>
              <LayoutDashboard size={18} />
              Dashboard
            </NavLink>

            <NavLink to="/manager/employees" className={navItemClass}>
              <Users size={18} />
              Empleados
            </NavLink>

            <NavLink to="/manager/payroll" className={navItemClass}>
              <FileText size={18} />
              Planilla
            </NavLink>

            <NavLink to="/manager/actions" className={navItemClass}>
              <Briefcase size={18} />
              Acciones de Personal
            </NavLink>
          </div>
        </div>
        {/* ===== Retenciones ===== */}
        <div>
          <p className="px-3 mb-2 text-xs uppercase tracking-wide text-slate-500">
            Retenciones
          </p>

          <NavLink to="/manager/loans" className={navItemClass}>
            <User size={18} />
            Préstamos y Anticipos
          </NavLink>
          <NavLink to="/" className={navItemClass}>
            <User size={18} />
            Retenciones
          </NavLink>
        </div>

        {/* ===== Otros ===== */}
        <div>
          <p className="px-3 mb-2 text-xs uppercase tracking-wide text-slate-500">
            Indicadores
          </p>
          <NavLink to="/manager/kpis" className={navItemClass}>
            <Cog size={18} />
            KPIs
          </NavLink>
          <NavLink to="/manager/questions" className={navItemClass}>
            <Cog size={18} />
            Preguntas
          </NavLink>
        </div>

        {/* ===== Otros ===== */}
        <div>
          <p className="px-3 mb-2 text-xs uppercase tracking-wide text-slate-500">
            Otros
          </p>
          <NavLink to="/settings" className={navItemClass}>
            <Cog size={18} />
            Configuración
          </NavLink>
        </div>

        {/* ===== EMPLOYEE ===== */}
        <div>
          <p className="px-3 mb-2 text-xs uppercase tracking-wide text-slate-500">
            Usuario
          </p>
          <NavLink to="/my-profile" className={navItemClass}>
            <User size={18} />
            Mi Perfil
          </NavLink>
        </div>
      </nav>

      {/* Logout */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.96 }}
        onClick={handleLogout}
        className="m-4 flex items-center gap-3 px-3 py-2 rounded-lg
                   bg-red-500/10 text-red-400 hover:bg-red-500/20 transition"
      >
        <LogOut size={18} />
        Cerrar Sesión
      </motion.button>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700 text-xs text-slate-500 text-center">
        © 2025 RH System
      </div>
    </aside>
  );
};

export default ManagerSideBar;
