import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  Cog,
  FileText,
  Briefcase,
  User,
  LogOut,
  Menu,
  X,
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
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    navigate('/');
  };

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 text-lg font-semibold border-b border-slate-700">
        RH Manager
        <button
          className="md:hidden text-slate-400"
          onClick={() => setOpen(false)}
        >
          <X size={22} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-4 text-sm overflow-y-auto">
        <div>
          <p className="px-3 mb-2 text-xs uppercase tracking-wide text-slate-500">
            Gestión
          </p>
          <NavLink to="/manager" end className={navItemClass}>
            <LayoutDashboard size={18} /> Dashboard
          </NavLink>
          <NavLink to="/manager/employees" className={navItemClass}>
            <Users size={18} /> Empleados
          </NavLink>
          <NavLink to="/manager/payroll" className={navItemClass}>
            <FileText size={18} /> Planilla
          </NavLink>
          <NavLink to="/manager/actions" className={navItemClass}>
            <Briefcase size={18} /> Acciones
          </NavLink>
          <NavLink to="/manager/absences" className={navItemClass}>
            <Briefcase size={18} /> Ausencias
          </NavLink>
        </div>

        <div>
          <p className="px-3 mb-2 text-xs uppercase tracking-wide text-slate-500">
            Retenciones
          </p>
          <NavLink to="/manager/loans" className={navItemClass}>
            <User size={18} /> Préstamos
          </NavLink>
        </div>

        <div>
          <p className="px-3 mb-2 text-xs uppercase tracking-wide text-slate-500">
            Indicadores
          </p>
          <NavLink to="/manager/kpis" className={navItemClass}>
            <Cog size={18} /> KPIs
          </NavLink>
          <NavLink to="/manager/questions" className={navItemClass}>
            <Cog size={18} /> Preguntas
          </NavLink>
        </div>

        <div>
          <p className="px-3 mb-2 text-xs uppercase tracking-wide text-slate-500">
            Usuario
          </p>
          <NavLink to="/my-profile" className={navItemClass}>
            <User size={18} /> Mi Perfil
          </NavLink>
        </div>
      </nav>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="m-4 flex items-center gap-3 px-3 py-2 rounded-lg
                   bg-red-500/10 text-red-400 hover:bg-red-500/20 transition"
      >
        <LogOut size={18} />
        Cerrar Sesión
      </button>
    </>
  );

  return (
    <>
      {/* Botón hamburguesa (móvil) */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden fixed top-4 left-4 z-40 bg-slate-900 text-white p-2 rounded-lg shadow"
      >
        <Menu size={22} />
      </button>

      {/* Sidebar desktop */}
      <aside className="hidden md:flex w-64 bg-slate-900 text-white flex-col">
        <SidebarContent />
      </aside>

      {/* Sidebar móvil */}
      <AnimatePresence>
        {open && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 bg-black/50 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />

            {/* Drawer */}
            <motion.aside
              className="fixed inset-y-0 left-0 w-64 bg-slate-900 text-white z-50 flex flex-col"
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ type: 'tween', duration: 0.25 }}
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default ManagerSideBar;
