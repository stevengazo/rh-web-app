import { useState } from 'react';
import {
  ArrowLeft,
  Banknote,
  Brain,
  Briefcase,
  CalendarDays,
  ChevronRight,
  CircleHelp,
  FileText,
  LayoutDashboard,
  Lightbulb,
  ListChecks,
  MessagesSquare,
  Network,
  Settings,
  Target,
  User,
  Users,
  Workflow,
} from 'lucide-react';

import OffCanvas from '../OffCanvas';
import { AYUDA, ORDEN_AYUDA } from '../../data/help';

/** Los iconos se referencian por nombre desde `help.js` para no importar React ahí. */
const ICONOS = {
  LayoutDashboard,
  Users,
  FileText,
  Briefcase,
  CalendarDays,
  Banknote,
  Network,
  Target,
  Settings,
  User,
  Brain,
  ListChecks,
  MessagesSquare,
  Workflow,
};

/** Ficha de ayuda de un área. */
const Contenido = ({ clave }) => {
  const ayuda = AYUDA[clave];

  if (!ayuda) {
    return (
      <p className="py-10 text-center text-sm text-ink-muted">
        Todavía no hay ayuda para esta pantalla.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-sm leading-relaxed text-ink-secondary">
        {ayuda.resumen}
      </p>

      {ayuda.pasos?.length > 0 && (
        <section>
          <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-brand">
            Cómo se usa
          </h3>

          <ol className="space-y-3">
            {ayuda.pasos.map((paso, i) => (
              <li key={paso} className="flex gap-3">
                <span
                  className="grid h-5 w-5 shrink-0 place-items-center rounded-full
                             bg-linear-to-br from-brand to-accent text-[11px] font-bold text-white"
                >
                  {i + 1}
                </span>
                <span className="text-sm leading-relaxed text-ink-secondary">
                  {paso}
                </span>
              </li>
            ))}
          </ol>
        </section>
      )}

      {ayuda.tips?.length > 0 && (
        <section className="rounded-xl border border-stroke-soft bg-surface-alt p-4">
          <h3 className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-accent-strong">
            <Lightbulb size={13} />
            Bueno saber
          </h3>

          <ul className="space-y-2">
            {ayuda.tips.map((tip) => (
              <li
                key={tip}
                className="flex gap-2 text-sm leading-relaxed text-ink-secondary"
              >
                <span aria-hidden="true" className="text-accent">
                  •
                </span>
                {tip}
              </li>
            ))}
          </ul>
        </section>
      )}

      {ayuda.faq?.length > 0 && (
        <section>
          <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-brand">
            Preguntas frecuentes
          </h3>

          <div className="divide-y divide-stroke-soft border-y border-stroke-soft">
            {ayuda.faq.map((item) => (
              <div key={item.p} className="py-3">
                <p className="text-sm font-semibold text-ink">{item.p}</p>
                <p className="mt-1 text-sm leading-relaxed text-ink-muted">
                  {item.r}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

/** Índice de todas las áreas con ayuda. */
const Indice = ({ onSelect }) => (
  <div className="space-y-4">
    <p className="text-sm leading-relaxed text-ink-secondary">
      Elige el área sobre la que necesitas ayuda. También encuentras este mismo
      contenido con el botón <strong>?</strong> de cada pantalla.
    </p>

    <ul className="space-y-1.5">
      {ORDEN_AYUDA.filter((clave) => AYUDA[clave]).map((clave) => {
        const ayuda = AYUDA[clave];
        const Icon = ICONOS[ayuda.icono] ?? CircleHelp;

        return (
          <li key={clave}>
            <button
              type="button"
              onClick={() => onSelect(clave)}
              className="flex w-full items-center gap-3 rounded-lg border border-stroke-soft
                         bg-surface p-3 text-left transition-colors
                         hover:border-brand hover:bg-brand-tint
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand-tint text-brand">
                <Icon size={17} />
              </span>

              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-ink">
                  {ayuda.titulo}
                </span>
                <span className="block truncate text-xs text-ink-muted">
                  {ayuda.resumen}
                </span>
              </span>

              <ChevronRight size={16} className="shrink-0 text-ink-muted" />
            </button>
          </li>
        );
      })}
    </ul>
  </div>
);

/**
 * Panel lateral de ayuda.
 *
 * Si recibe `area`, abre directamente esa ficha; si no, muestra el índice.
 *
 * @param {boolean} isOpen
 * @param {() => void} onClose
 * @param {string} [area]
 */
const HelpDrawer = ({ isOpen, onClose, area }) => {
  const [seleccion, setSeleccion] = useState(area ?? null);

  // Al abrir desde una pantalla concreta se muestra su ficha
  const areaActual = area ?? seleccion;
  const ayuda = areaActual ? AYUDA[areaActual] : null;

  const cerrar = () => {
    if (!area) setSeleccion(null);
    onClose?.();
  };

  return (
    <OffCanvas
      isOpen={isOpen}
      onClose={cerrar}
      title={ayuda ? `Ayuda · ${ayuda.titulo}` : 'Centro de ayuda'}
    >
      {/* Volver al índice cuando se navegó desde él */}
      {!area && seleccion && (
        <button
          type="button"
          onClick={() => setSeleccion(null)}
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-ink-muted
                     transition-colors hover:text-brand"
        >
          <ArrowLeft size={15} />
          Todas las áreas
        </button>
      )}

      {areaActual ? (
        <Contenido clave={areaActual} />
      ) : (
        <Indice onSelect={setSeleccion} />
      )}
    </OffCanvas>
  );
};

export default HelpDrawer;
