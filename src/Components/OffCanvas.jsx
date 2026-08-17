import { X } from 'lucide-react';
import { useEffect, useId, useRef } from 'react';
import IconButton from './IconButton';

/**
 * Panel lateral (drawer) para ver o editar un registro sin salir de la página.
 *
 * @param {boolean} isOpen
 * @param {() => void} onClose
 * @param {string} title
 */
const OffCanvas = ({ isOpen, onClose, title, children }) => {
  const panelRef = useRef(null);
  const focoPrevio = useRef(null);
  const titleId = useId();

  // Cerrar con Escape mientras el panel está abierto
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.();
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  // Bloquear el scroll del body restaurando el valor previo (no asumir 'auto')
  useEffect(() => {
    if (!isOpen) return;

    const previo = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previo;
    };
  }, [isOpen]);

  // Llevar el foco al panel al abrir y devolverlo al cerrar
  useEffect(() => {
    if (isOpen) {
      focoPrevio.current = document.activeElement;
      panelRef.current?.focus();
    } else {
      focoPrevio.current?.focus?.();
    }
  }, [isOpen]);

  return (
    <>
      {/* Overlay */}
      <div
        aria-hidden="true"
        className={`
          fixed inset-0 z-40 transition-opacity duration-300
          bg-black/50 backdrop-blur-sm
          ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}
        `}
        onClick={onClose}
      />

      {/* Panel */}
      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        /* `inert` saca el panel cerrado del orden de tabulación (React 19) */
        inert={!isOpen}
        className={`
          fixed z-50
          top-0 right-0
          h-full
          w-full sm:w-[420px]
          flex flex-col
          bg-surface
          text-ink
          rounded-l-xl
          overflow-hidden
          shadow-xl
          outline-none
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {/* Franja de acento */}
        <div aria-hidden="true" className="h-1.5 shrink-0 bg-linear-to-r from-brand to-accent" />

        {/* Header */}
        <div
          className="
            flex shrink-0 items-center justify-between gap-3
            px-5 py-4
            border-b
            border-stroke-soft
          "
        >
          <h3
            id={titleId}
            className="truncate text-lg sm:text-xl font-semibold"
          >
            {title}
          </h3>

          <IconButton
            icon={X}
            onClick={onClose}
            variant="default"
            size={20}
            aria-label="Cerrar panel"
          />
        </div>

        {/* Content */}
        <div className="min-h-0 flex-1 overflow-y-auto scrollbar-slim px-5 py-4">
          {children}
        </div>
      </aside>
    </>
  );
};

export default OffCanvas;
