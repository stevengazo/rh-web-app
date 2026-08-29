import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import {
  Banknote,
  Briefcase,
  CalendarDays,
  ChevronLeft,
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

/** Dónde se recuerda si el menú quedó plegado. */
const CLAVE_COLAPSADO = 'sidebar-colapsado';

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

const ManagerSideBar = () => {
  const navigate = useNavigate();
  const { logout } = useAppContext();

  const [open, setOpen] = useState(false); // cajón móvil
  const [ayudaAbierta, setAyudaAbierta] = useState(false);

  /* El pliegue se recuerda entre visitas: quien trabaja con el menú
     colapsado no quiere volver a plegarlo en cada pantalla. */
  const [colapsado, setColapsado] = useState(() => {
    try {
      return localStorage.getItem(CLAVE_COLAPSADO) === '1';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(CLAVE_COLAPSADO, colapsado ? '1' : '0');
    } catch {
      /* modo privado: se ignora */
    }
  }, [colapsado]);

  /* Antes solo navegaba a "/" dejando el token en localStorage: la sesión
     seguía viva y bastaba volver a /manager para entrar de nuevo. */
  const handleLogout = () => {
    logout?.();
    navigate('/login');
  };

  /**
   * @param {boolean} plegado  En el cajón móvil nunca se pliega.
   */
  const Contenido = ({ plegado }) => {
    const itemClass = ({ isActive }) =>
      `group relative flex items-center gap-3 rounded-md py-2 text-sm font-medium
       transition-colors duration-150
       ${plegado ? 'justify-center px-2' : 'px-3'}
       ${
         isActive
           ? 'bg-linear-to-r from-brand to-accent text-white shadow-sm'
           : 'text-gray-300 hover:bg-white/10 hover:text-white'
       }`;

    return (
      <>
        {/* Cabecera */}
        <div
          className={`flex h-16 items-center border-b border-white/10 ${
            plegado ? 'justify-center px-2' : 'justify-between px-4'
          }`}
        >
          {!plegado && (
            <span className="text-lg font-semibold">RH Manager</span>
          )}

          {/* Plegar (escritorio) */}
          <button
            type="button"
            onClick={() => setColapsado((v) => !v)}
            aria-label={plegado ? 'Expandir menú' : 'Plegar menú'}
            title={plegado ? 'Expandir menú' : 'Plegar menú'}
            className="hidden h-8 w-8 place-items-center rounded-md text-gray-400
                       transition-colors hover:bg-white/10 hover:text-white md:grid"
          >
            <ChevronLeft
              size={18}
              className={`transition-transform duration-200 ${
                plegado ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Cerrar (móvil) */}
          <button
            className="text-gray-400 md:hidden"
            onClick={() => setOpen(false)}
            aria-label="Cerrar menú"
          >
            <X size={22} />
          </button>
        </div>

        {/* Navegación */}
        <nav className="scrollbar-slim-dark flex-1 space-y-4 overflow-y-auto p-3 text-sm">
          {SECCIONES.map((seccion) => (
            <div key={seccion.titulo}>
              {plegado ? (
                <div className="mx-2 mb-2 border-t border-white/10" />
              ) : (
                <p className="mb-2 px-3 text-xs uppercase tracking-wide text-gray-400">
                  {seccion.titulo}
                </p>
              )}

              {seccion.items.map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    className={itemClass}
                    onClick={() => setOpen(false)}
                    title={plegado ? item.label : undefined}
                  >
                    <Icon size={18} className="shrink-0" />
                    {!plegado && <span className="truncate">{item.label}</span>}

                    {/* Etiqueta flotante cuando está plegado */}
                    {plegado && (
                      <span
                        className="pointer-events-none absolute left-full z-50 ml-2 hidden
                                   whitespace-nowrap rounded-md bg-nav px-2 py-1 text-xs
                                   text-white shadow-lg group-hover:block"
                      >
                        {item.label}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Pie */}
        <div className="space-y-2 border-t border-white/10 p-3">
          <button
            type="button"
            onClick={() => setAyudaAbierta(true)}
            title={plegado ? 'Centro de ayuda' : undefined}
            className={`flex w-full items-center gap-3 rounded-md py-2 text-sm font-medium
                        text-gray-300 transition-colors hover:bg-white/10 hover:text-white
                        ${plegado ? 'justify-center px-2' : 'px-3'}`}
          >
            <CircleHelp size={18} className="shrink-0" />
            {!plegado && 'Centro de ayuda'}
          </button>

          <button
            onClick={handleLogout}
            title={plegado ? 'Cerrar sesión' : undefined}
            className={`flex w-full items-center gap-3 rounded-md bg-red-500/10 py-2
                        text-sm font-medium text-red-400 transition-colors hover:bg-red-500/20
                        ${plegado ? 'justify-center px-2' : 'px-3'}`}
          >
            <LogOut size={18} className="shrink-0" />
            {!plegado && 'Cerrar Sesión'}
          </button>
        </div>
      </>
    );
  };

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
      <motion.aside
        animate={{ width: colapsado ? 72 : 256 }}
        transition={{ type: 'tween', duration: 0.2 }}
        className="hidden shrink-0 flex-col overflow-hidden bg-linear-to-b
                   from-nav via-nav to-violet-950 text-white md:flex"
      >
        <Contenido plegado={colapsado} />
      </motion.aside>

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
              className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col
                         bg-linear-to-b from-nav via-nav to-violet-950 text-white"
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ type: 'tween', duration: 0.25 }}
            >
              <Contenido plegado={false} />
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
