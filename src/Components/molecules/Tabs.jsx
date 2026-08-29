import { motion } from 'framer-motion';

/**
 * Pestañas con indicador deslizante.
 *
 * Estilo "control segmentado": las pestañas viven dentro de una cápsula y la
 * activa se resalta con una pastilla que se desplaza entre ellas (`layoutId`),
 * en lugar del subrayado plano de antes. Cada una admite icono y contador, así
 * que se ve de un vistazo dónde hay información.
 *
 * En pantallas estrechas la cápsula se desplaza en horizontal; no se cambia
 * por un `<select>`, que ocultaba los contadores.
 *
 * @param {Array<{id: string, label: string, icon?: Function, count?: number}>} items
 * @param {string} value        Id de la pestaña activa.
 * @param {(id: string) => void} onChange
 * @param {string} [idGrupo]    Distingue la animación si hay dos grupos en pantalla.
 */
const Tabs = ({ items = [], value, onChange, idGrupo = 'tabs', className = '' }) => (
  <div
    role="tablist"
    aria-orientation="horizontal"
    className={`flex gap-1 overflow-x-auto rounded-xl border border-stroke-soft
                bg-surface-alt p-1 scrollbar-slim ${className}`}
  >
    {items.map(({ id, label, icon: Icon, count }) => {
      const activo = value === id;

      return (
        <button
          key={id}
          type="button"
          role="tab"
          aria-selected={activo}
          onClick={() => onChange?.(id)}
          className={`relative flex shrink-0 items-center gap-2 whitespace-nowrap rounded-lg
                      px-3.5 py-2 text-sm font-medium transition-colors duration-150
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand
                      ${activo ? 'text-brand' : 'text-ink-muted hover:text-ink'}`}
        >
          {/* Pastilla que se desplaza a la pestaña activa */}
          {activo && (
            <motion.span
              layoutId={`${idGrupo}-activo`}
              transition={{ type: 'spring', stiffness: 380, damping: 32 }}
              className="absolute inset-0 rounded-lg bg-surface shadow-sm ring-1 ring-stroke-soft"
            />
          )}

          <span className="relative flex items-center gap-2">
            {Icon && <Icon size={15} className="shrink-0" />}
            {label}

            {count > 0 && (
              <span
                className={`rounded-full px-1.5 py-0.5 text-[11px] font-bold leading-none
                  ${activo ? 'bg-brand-tint text-brand-700' : 'bg-stroke-soft text-ink-muted'}`}
              >
                {count}
              </span>
            )}
          </span>
        </button>
      );
    })}
  </div>
);

export default Tabs;
