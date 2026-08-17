import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * Pregunta frecuente colapsable.
 * Acordeón accesible: botón con `aria-expanded` y región asociada.
 */
const FaqItem = ({ pregunta, respuesta, id }) => {
  const [abierto, setAbierto] = useState(false);
  const panelId = `faq-panel-${id}`;
  const botonId = `faq-boton-${id}`;

  return (
    <div className="border-b border-stroke-soft">
      <h3>
        <button
          type="button"
          id={botonId}
          aria-expanded={abierto}
          aria-controls={panelId}
          onClick={() => setAbierto((v) => !v)}
          className="flex w-full items-center justify-between gap-4 py-5 text-left
                     transition-colors hover:text-brand
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand
                     focus-visible:ring-offset-2 rounded-md"
        >
          <span className="text-base font-semibold text-ink">{pregunta}</span>

          <ChevronDown
            size={20}
            aria-hidden="true"
            className={`shrink-0 text-ink-muted transition-transform duration-200
              ${abierto ? 'rotate-180 text-brand' : ''}`}
          />
        </button>
      </h3>

      <div
        id={panelId}
        role="region"
        aria-labelledby={botonId}
        hidden={!abierto}
        className="pb-5 pr-8"
      >
        <p className="text-sm leading-relaxed text-ink-muted">{respuesta}</p>
      </div>
    </div>
  );
};

export default FaqItem;
