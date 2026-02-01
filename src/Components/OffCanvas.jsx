import { X } from 'lucide-react';

const OffCanvas = ({ isOpen, onClose, title, children }) => {
  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-40 transition-opacity
          bg-black/40 dark:bg-black/70
          ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}
        `}
        onClick={onClose}
      />

      {/* Panel */}
      <aside
        className={`
          fixed top-0 right-0 h-full w-80 z-50
          transform transition-transform duration-300 ease-in-out
          bg-white text-gray-800
          dark:bg-gray-900 dark:text-gray-100
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b
          border-gray-200 dark:border-gray-700
        ">
          <h3 className="text-lg font-semibold">
            {title}
          </h3>

          <button
            onClick={onClose}
            className="
              p-1 rounded
              bg-red-500 hover:bg-red-700
              text-white transition
            "
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto h-full">
          {children}
        </div>
      </aside>
    </>
  );
};

export default OffCanvas;
