import { useState } from 'react';
import { CircleHelp } from 'lucide-react';
import HelpDrawer from '../organisms/HelpDrawer';

/**
 * Botón de ayuda contextual. Abre el panel con las explicaciones del área.
 *
 * Uso: `<HelpButton area="planilla" />` en el encabezado de la pantalla.
 * Las áreas disponibles están en `src/data/help.js`.
 *
 * @param {string} area
 * @param {('icon'|'text')} [variant] 'icon' es discreto; 'text' muestra "Ayuda".
 */
const HelpButton = ({ area, variant = 'icon', className = '' }) => {
  const [abierto, setAbierto] = useState(false);

  return (
    <>
      {variant === 'text' ? (
        <button
          type="button"
          onClick={() => setAbierto(true)}
          className={`inline-flex h-8 items-center gap-1.5 rounded-md border border-stroke
                      bg-surface px-3 text-sm font-semibold text-ink-secondary transition-colors
                      hover:border-brand hover:text-brand
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${className}`}
        >
          <CircleHelp size={15} />
          Ayuda
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setAbierto(true)}
          aria-label="Ayuda de esta pantalla"
          title="¿Cómo funciona esta pantalla?"
          className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border border-stroke-soft
                      bg-surface text-ink-muted transition-colors
                      hover:border-brand hover:bg-brand-tint hover:text-brand
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${className}`}
        >
          <CircleHelp size={16} />
        </button>
      )}

      <HelpDrawer
        isOpen={abierto}
        onClose={() => setAbierto(false)}
        area={area}
      />
    </>
  );
};

export default HelpButton;
