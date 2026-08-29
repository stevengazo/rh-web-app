import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

/**
 * Menú desplegable de acciones.
 *
 * Se cierra al hacer clic fuera, al pulsar Escape y al elegir una opción.
 *
 * @param {string} [label]
 * @param {import('lucide-react').LucideIcon} [icon]
 * @param {Array<{
 *   label: string,
 *   icon?: Function,
 *   onClick?: () => void,
 *   tono?: 'default'|'danger',
 *   separador?: boolean,
 *   disabled?: boolean
 * }>} items
 * @param {('primary'|'secondary')} [variant]
 */
const DropdownMenu = ({
  label = 'Acciones',
  icon: Icon,
  items = [],
  variant = 'primary',
  align = 'right',
}) => {
  const [abierto, setAbierto] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!abierto) return;

    const alClicar = (e) => {
      if (!ref.current?.contains(e.target)) setAbierto(false);
    };
    const alTeclear = (e) => {
      if (e.key === 'Escape') setAbierto(false);
    };

    document.addEventListener('mousedown', alClicar);
    document.addEventListener('keydown', alTeclear);
    return () => {
      document.removeEventListener('mousedown', alClicar);
      document.removeEventListener('keydown', alTeclear);
    };
  }, [abierto]);

  const estilos =
    variant === 'primary'
      ? `bg-brand text-white border-transparent hover:bg-brand-hover active:bg-brand-pressed`
      : `bg-surface text-ink border-stroke hover:bg-surface-alt hover:border-brand hover:text-brand`;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setAbierto((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={abierto}
        className={`inline-flex h-8 items-center gap-2 rounded-md border px-3 text-sm
                    font-semibold transition-colors duration-150
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand
                    focus-visible:ring-offset-1 ${estilos}`}
      >
        {Icon && <Icon size={15} />}
        {label}
        <ChevronDown
          size={14}
          className={`transition-transform ${abierto ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {abierto && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className={`absolute top-full z-50 mt-2 w-60 overflow-hidden rounded-xl border
                        border-stroke-soft bg-surface shadow-xl
                        ${align === 'right' ? 'right-0' : 'left-0'}`}
          >
            {items.map((item) => (
              <button
                key={item.label}
                type="button"
                role="menuitem"
                disabled={item.disabled}
                onClick={() => {
                  setAbierto(false);
                  item.onClick?.();
                }}
                className={`flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm
                            transition-colors disabled:cursor-not-allowed disabled:opacity-50
                            ${item.separador ? 'border-t border-stroke-soft' : ''}
                            ${
                              item.tono === 'danger'
                                ? 'font-medium text-red-600 hover:bg-red-50'
                                : 'text-ink-secondary hover:bg-canvas hover:text-ink'
                            }`}
              >
                {item.icon && <item.icon size={16} className="shrink-0" />}
                {item.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DropdownMenu;
