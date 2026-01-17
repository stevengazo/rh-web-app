import { X } from 'lucide-react';

const OffCanvasLarge = ({ isOpen, onClose, title, children }) => {
  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={onClose}
      />

      {/* Panel */}
      <aside
        className={`fixed top-0 right-0 h-full w-2/3  bg-white z-50
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b dark:border-gray-700">
          <h3 className="text-lg   font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 rounded bg-red-500  hover:bg-red-800 duration-200"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto h-full ">jjkjñlkj{children}</div>
      </aside>
    </>
  );
};

export default OffCanvasLarge;
