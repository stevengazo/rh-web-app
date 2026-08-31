import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import {
  Banknote,
  BarChart3,
  Brain,
  Briefcase,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  CircleHelp,
  FileText,
  LayoutDashboard,
  ListChecks,
  LogOut,
  Menu,
  MessagesSquare,
  Network,
  ScrollText,
  Settings,
  Target,
  User,
  Users,
  Workflow,
  X,
} from 'lucide-react';

import HelpDrawer from '../Components/organisms/HelpDrawer';
import { useAppContext } from '../context/AppContext';
import Logo from '../Components/Logo';

/** Dónde se recuerda si el menú quedó plegado. */
const CLAVE_COLAPSADO = 'sidebar-colapsado';
/** Qué sección del menú quedó abierta (acordeón: solo una a la vez). */
const CLAVE_SECCION = 'sidebar-seccion';

/**
 * Navegación del área de administración, agrupada por el trabajo que resuelve
 * cada bloque en lugar de por el módulo técnico al que pertenece.
 *
 * Cada sección es un acordeón: al abrir una se cierran las demás.
 */
const SECCIONES = [
  {
    id: 'resumen',
    titulo: 'Resumen',
    items: [
      { to: '/manager', label: 'Dashboard', icon: LayoutDashboard, end: true },
    ],
  },
  {
    id: 'personal',
    titulo: 'Personal',
    items: [
      { to: '/manager/employees', label: 'Empleados', icon: Users },
      { to: '/manager/actions', label: 'Acciones', icon: Briefcase },
      { to: '/manager/absences', label: 'Ausencias', icon: CalendarDays },
      { to: '/manager/organigrama', label: 'Organigrama', icon: Network },
    ],
  },
  {
    id: 'compensacion',
    titulo: 'Compensación',
    items: [
      { to: '/manager/payroll', label: 'Planilla', icon: FileText },
      { to: '/manager/loans', label: 'Préstamos', icon: Banknote },
    ],
  },
  {
    id: 'desempeno',
    titulo: 'Desempeño',
    items: [
      { to: '/manager/kpis', label: 'KPIs y objetivos', icon: Target },
      { to: '/manager/questions', label: 'Preguntas', icon: ListChecks },
      { to: '/manager/psicometria', label: 'Psicometría', icon: Brain },
    ],
  },
  {
    id: 'operacion',
    titulo: 'Operación',
    items: [
      { to: '/manager/reportes', label: 'Reportería', icon: BarChart3 },
      { to: '/manager/automatizaciones', label: 'Automatizaciones', icon: Workflow },
    ],
  },
  {
    id: 'mi-cuenta',
    titulo: 'Mi cuenta',
    items: [
      { to: '/my-profile', label: 'Mi Perfil', icon: User },
      { to: '/messages', label: 'Mensajes', icon: MessagesSquare },
    ],
  },
  {
    id: 'configuracion',
    titulo: 'Configuración',
    items: [
      { to: '/manager/auditoria', label: 'Auditoría', icon: ScrollText },
      { to: '/settings', label: 'Ajustes', icon: Settings },
    ],
  },
];

/* Variantes del acordeón, al estilo de la barra lateral de VS Code: colapso
   rápido de la altura con una curva ease-out, misma curva al abrir y al
   cerrar para que el movimiento sea simétrico. Los ítems solo escalonan su
   entrada; al cerrar se desvanecen con el panel sin retrasar el colapso. */
const EASE = [0.25, 0.1, 0.25, 1];

const seccionVariants = {
  cerrada: {
    height: 0,
    opacity: 0,
    transition: {
      height: { duration: 0.18, ease: EASE },
      opacity: { duration: 0.12, ease: EASE },
    },
  },
  abierta: {
    height: 'auto',
    opacity: 1,
    transition: {
      height: { duration: 0.2, ease: EASE },
      opacity: { duration: 0.15, ease: EASE },
      staggerChildren: 0.025,
      delayChildren: 0.04,
    },
  },
};

const itemVariants = {
  cerrada: { opacity: 0, x: -6 },
  abierta: { opacity: 1, x: 0, transition: { duration: 0.16, ease: 'easeOut' } },
};

/** Sección a la que pertenece la ruta activa (para abrirla sola). */
const seccionDeRuta = (pathname) => {
  const match = SECCIONES.find((s) =>
    s.items.some((i) =>
      i.end ? pathname === i.to : pathname === i.to || pathname.startsWith(`${i.to}/`)
    )
  );
  return match?.id ?? null;
};

const ManagerSideBar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { logout } = useAppContext();

  const [open, setOpen] = useState(false); // cajón móvil
  const [ayudaAbierta, setAyudaAbierta] = useState(false);

  /* Acordeón: solo una sección abierta a la vez. Se recuerda entre visitas y
     se abre sola la que contiene la ruta activa al navegar. */
  const [seccionAbierta, setSeccionAbierta] = useState(() => {
    try {
      const guardada = localStorage.getItem(CLAVE_SECCION);
      if (guardada && SECCIONES.some((s) => s.id === guardada)) return guardada;
    } catch {
      /* modo privado */
    }
    return seccionDeRuta(window.location.pathname) ?? SECCIONES[0].id;
  });

  const seccionActiva = useMemo(() => seccionDeRuta(pathname), [pathname]);

  useEffect(() => {
    if (seccionActiva) setSeccionAbierta(seccionActiva);
  }, [seccionActiva]);

  useEffect(() => {
    try {
      if (seccionAbierta) localStorage.setItem(CLAVE_SECCION, seccionAbierta);
      else localStorage.removeItem(CLAVE_SECCION);
    } catch {
      /* modo privado */
    }
  }, [seccionAbierta]);

  const alternarSeccion = (id) =>
    setSeccionAbierta((actual) => (actual === id ? null : id));

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
   * Contenido del sidebar. Se invoca como función (no como `<Contenido />`)
   * desde el render: si fuera un componente declarado aquí dentro, React lo
   * trataría como un tipo nuevo en cada cambio de estado y remontaría todo el
   * árbol, con lo que `AnimatePresence` nunca llegaría a animar el acordeón.
   *
   * @param {boolean} plegado  En el cajón móvil nunca se pliega.
   */
  const renderContenido = (plegado) => {
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
          {plegado ? (
            <Logo variante="iso" size={30} />
          ) : (
            <Logo size={30} sobre="oscuro" />
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
        <nav className="scrollbar-slim-dark flex-1 overflow-y-auto p-3 text-sm">
          {SECCIONES.map((seccion) => {
            const Item = (item) => {
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
            };

            // Menú plegado: sin acordeón, solo un separador y los iconos.
            if (plegado) {
              return (
                <div key={seccion.id} className="mb-2">
                  <div className="mx-2 mb-2 border-t border-white/10" />
                  {seccion.items.map(Item)}
                </div>
              );
            }

            const abierta = seccionAbierta === seccion.id;

            return (
              <div key={seccion.id} className="mb-1">
                <button
                  type="button"
                  onClick={() => alternarSeccion(seccion.id)}
                  aria-expanded={abierta}
                  className="flex w-full items-center justify-between rounded-md px-3 py-1.5
                             text-xs font-semibold uppercase tracking-wide text-gray-400
                             transition-colors hover:text-white"
                >
                  {seccion.titulo}
                  <motion.span
                    animate={{ rotate: abierta ? 0 : -90 }}
                    transition={{ duration: 0.18, ease: EASE }}
                    className="grid place-items-center"
                  >
                    <ChevronDown size={14} />
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {abierta && (
                    <motion.div
                      key="items"
                      variants={seccionVariants}
                      initial="cerrada"
                      animate="abierta"
                      exit="cerrada"
                      className="overflow-hidden"
                    >
                      <div className="mt-1 space-y-0.5 pb-1">
                        {seccion.items.map((item) => (
                          <motion.div key={item.to} variants={itemVariants}>
                            {Item(item)}
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
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
        {renderContenido(colapsado)}
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
              {renderContenido(false)}
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
