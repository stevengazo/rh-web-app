import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X, Users } from 'lucide-react';
import ThemeToggle from '../../ThemeToggle';
import CtaButton from '../../molecules/marketing/CtaButton';
import { NAV_PUBLICA, PRODUCTO } from '../../../data/marketing';

const linkClass = ({ isActive }) =>
  `rounded-md px-3 py-2 text-sm font-semibold transition-colors
   ${
     isActive
       ? 'text-brand bg-brand-tint'
       : 'text-ink-secondary hover:text-brand hover:bg-brand-tint/60'
   }`;

/** Marca del producto (logo + nombre). */
const Logo = ({ onClick }) => (
  <Link
    to="/"
    onClick={onClick}
    className="flex items-center gap-2.5 rounded-md focus-visible:outline-none
               focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
  >
    <span
      className="grid h-9 w-9 place-items-center rounded-lg
                 bg-linear-to-br from-brand to-accent text-white shadow-sm"
    >
      <Users size={20} strokeWidth={2} />
    </span>
    <span className="text-lg font-bold tracking-tight text-ink">
      {PRODUCTO.nombre}
    </span>
  </Link>
);

/** Barra de navegación del sitio público. */
const PublicNavBar = () => {
  const [abierto, setAbierto] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  // Sombra sutil al hacer scroll (patrón Fluent de elevación por contexto)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Cierra el menú móvil al cambiar de ruta
  useEffect(() => setAbierto(false), [pathname]);

  const cerrar = () => setAbierto(false);

  return (
    <>
      <header
        className={`sticky top-0 z-40 border-b transition-shadow duration-200
          ${
            scrolled
              ? 'border-stroke-soft bg-surface/90 shadow-sm backdrop-blur-md'
              : 'border-transparent bg-surface/70 backdrop-blur-sm'
          }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Logo />

          {/* Navegación de escritorio */}
          <nav
            aria-label="Navegación principal"
            className="hidden items-center gap-1 lg:flex"
          >
            {NAV_PUBLICA.map((item) => (
              <NavLink key={item.to} to={item.to} className={linkClass}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <ThemeToggle />
            <CtaButton to="/login" variant="ghost" size="md">
              Iniciar sesión
            </CtaButton>
            <CtaButton to="/contacto" variant="primary" size="md">
              Solicitar demo
            </CtaButton>
          </div>

          {/* Acciones móviles */}
          <div className="flex items-center gap-1 lg:hidden">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setAbierto(true)}
              aria-label="Abrir menú"
              aria-expanded={abierto}
              className="grid h-9 w-9 place-items-center rounded-md text-ink-secondary
                         transition-colors hover:bg-canvas hover:text-ink
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

      {/* Menú móvil */}
      <AnimatePresence>
        {abierto && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={cerrar}
              className="fixed inset-0 z-50 bg-black/50 lg:hidden"
            />

            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="fixed inset-y-0 right-0 z-50 flex w-72 flex-col
                         border-l border-stroke-soft bg-surface p-5 shadow-2xl lg:hidden"
            >
              <div className="mb-6 flex items-center justify-between">
                <Logo onClick={cerrar} />
                <button
                  type="button"
                  onClick={cerrar}
                  aria-label="Cerrar menú"
                  className="grid h-9 w-9 place-items-center rounded-md text-ink-muted
                             transition-colors hover:bg-canvas hover:text-ink"
                >
                  <X size={22} />
                </button>
              </div>

              <nav
                aria-label="Navegación principal"
                className="flex flex-col gap-1"
              >
                {NAV_PUBLICA.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={cerrar}
                    className={linkClass}
                  >
                    {item.label}
                  </NavLink>
                ))}
              </nav>

              <div className="mt-auto flex flex-col gap-2 border-t border-stroke-soft pt-5">
                <CtaButton to="/login" variant="secondary" size="md">
                  Iniciar sesión
                </CtaButton>
                <CtaButton to="/contacto" variant="primary" size="md">
                  Solicitar demo
                </CtaButton>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default PublicNavBar;
