import { X } from 'lucide-react';
import { useEffect } from 'react';

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
          bg-white text-gray-800
          dark:bg-gray-900 dark:text-gray-100
          shadow-2xl
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {/* Header */}
        <div
          className="
            flex items-center justify-between
            px-5 py-4
            border-b
            border-gray-200 dark:border-gray-700
          "
        >
          <h3 className="text-lg sm:text-xl font-semibold">{title}</h3>

          <button
            onClick={onClose}
            className="
              p-2 rounded-lg
              bg-red-500 hover:bg-red-600
              active:scale-95
              text-white transition
            "
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div
          className="
            px-5 py-4
            overflow-y-auto
            h-[calc(100%-72px)]
          "
        >
          {children}
        </div>
      </aside>
    </>
  );
};

export default OffCanvas;
