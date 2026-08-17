import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import {
  Banknote,
  Briefcase,
  CalendarDays,
  CircleHelp,
  FileText,
  LayoutDashboard,
  ListChecks,
  LogOut,
  Menu,
  Network,
  Settings,
  Shield,
  Target,
  User,
  Users,
  X,
} from 'lucide-react';

import HelpDrawer from '../Components/organisms/HelpDrawer';
import { useAppContext } from '../context/AppContext';

/**
 * Navegación del área de administración, agrupada por el trabajo que resuelve
 * cada bloque en lugar de por el módulo técnico al que pertenece.
 */
const SECCIONES = [
  {
    titulo: 'Resumen',
    items: [
      { to: '/manager', label: 'Dashboard', icon: LayoutDashboard, end: true },
    ],
  },
  {
    titulo: 'Personal',
    items: [
      { to: '/manager/employees', label: 'Empleados', icon: Users },
      { to: '/manager/actions', label: 'Acciones', icon: Briefcase },
      { to: '/manager/absences', label: 'Ausencias', icon: CalendarDays },
      { to: '/manager/organigrama', label: 'Organigrama', icon: Network },
    ],
  },
  {
    titulo: 'Compensación',
    items: [
      { to: '/manager/payroll', label: 'Planilla', icon: FileText },
      { to: '/manager/loans', label: 'Préstamos', icon: Banknote },
    ],
  },
  {
    titulo: 'Desempeño',
    items: [
      { to: '/manager/kpis', label: 'KPIs y objetivos', icon: Target },
      { to: '/manager/questions', label: 'Preguntas', icon: ListChecks },
    ],
  },
  {
    titulo: 'Mi cuenta',
    items: [{ to: '/my-profile', label: 'Mi Perfil', icon: User }],
  },
  {
    titulo: 'Configuración',
    items: [
      { to: '/manager/roles', label: 'Roles y permisos', icon: Shield },
      { to: '/settings', label: 'Ajustes', icon: Settings },
    ],
  },
];

const navItemClass = ({ isActive }) =>
  `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150
   ${
     isActive
       ? 'bg-linear-to-r from-brand to-accent text-white shadow-sm'
       : 'text-gray-300 hover:bg-white/10 hover:text-white'
   }`;

const ManagerSideBar = () => {
  const navigate = useNavigate();
  const { logout } = useAppContext();

  const [open, setOpen] = useState(false);
  const [ayudaAbierta, setAyudaAbierta] = useState(false);

  /* Antes solo navegaba a "/" dejando el token en localStorage: la sesión
     seguía viva y bastaba volver a /manager para entrar de nuevo. */
  const handleLogout = () => {
    logout?.();
    navigate('/login');
  };

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-white/10 px-4 text-lg font-semibold">
        RH Manager
        <button
          className="text-gray-400 md:hidden"
          onClick={() => setOpen(false)}
          aria-label="Cerrar menú"
        >
          <X size={22} />
        </button>
      </div>

      {/* Navegación */}
      <nav className="scrollbar-slim-dark flex-1 space-y-4 overflow-y-auto p-4 text-sm">
        {SECCIONES.map((seccion) => (
          <div key={seccion.titulo}>
            <p className="mb-2 px-3 text-xs uppercase tracking-wide text-gray-400">
              {seccion.titulo}
            </p>

            {seccion.items.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={navItemClass}
                  onClick={() => setOpen(false)}
                >
                  <Icon size={18} />
                  {item.label}
                </NavLink>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Pie: ayuda y salida */}
      <div className="space-y-2 border-t border-white/10 p-4">
        <button
          type="button"
          onClick={() => setAyudaAbierta(true)}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium
                     text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
        >
          <CircleHelp size={18} />
          Centro de ayuda
        </button>

        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-md bg-red-500/10 px-3 py-2
                     text-sm font-medium text-red-400 transition-colors hover:bg-red-500/20"
        >
          <LogOut size={18} />
          Cerrar Sesión
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Botón hamburguesa (móvil) */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Abrir menú"
        className="fixed left-4 top-4 z-40 rounded-md bg-nav p-2 text-white shadow md:hidden"
      >
        <Menu size={22} />
      </button>

      {/* Sidebar escritorio */}
      <aside className="hidden w-64 flex-col bg-linear-to-b from-nav via-nav to-violet-950 text-white md:flex">
        <SidebarContent />
      </aside>

      {/* Sidebar móvil */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />

            <motion.aside
              className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-linear-to-b from-nav via-nav to-violet-950 text-white"
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

      {/* Centro de ayuda global */}
      <HelpDrawer
        isOpen={ayudaAbierta}
        onClose={() => setAyudaAbierta(false)}
      />
    </>
  );
};

export default ManagerSideBar;
