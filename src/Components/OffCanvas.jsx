import { X } from 'lucide-react';
import { useEffect } from 'react';
import IconButton from './IconButton';

const OffCanvas = ({ isOpen, onClose, title, children }) => {
  // Bloquear scroll del body cuando está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isOpen]);

  return (
    <>
      {/* Overlay */}
      <div
        className={`
          fixed inset-0 z-40 transition-opacity duration-300
          bg-black/50 backdrop-blur-sm
          ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}
        `}
        onClick={onClose}
      />

      {/* Panel */}
      <aside
        className={`
          fixed z-50
          top-0 right-0
          h-full
          w-full sm:w-[420px]
          bg-surface
          text-ink
          rounded-l-xl
          overflow-hidden
          shadow-xl
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {/* Franja de acento */}
        <div className="h-1.5 bg-linear-to-r from-brand to-accent" />

        {/* Header */}
        <div
          className="
            flex items-center justify-between
            px-5 py-4
            border-b
            border-stroke-soft
          "
        >
          <h3 className="text-lg sm:text-xl font-semibold">{title}</h3>

          <IconButton icon={X} onClick={onClose} variant="default" size={20} />
        </div>

        {/* Content */}
        <div
          className="
            px-5 py-4
            overflow-y-auto
            h-[calc(100%-78px)]
          "
        >
          {children}
        </div>
      </aside>
    </>
  );
};

export default OffCanvas;