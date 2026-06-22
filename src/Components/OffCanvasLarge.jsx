import { X } from 'lucide-react';
import IconButton from './IconButton';

const OffCanvasLarge = ({ isOpen, onClose, title, children }) => {
  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={onClose}
      />

      {/* Panel */}
      <aside
        className={`fixed top-0 right-0 h-full w-2/4 z-50
        bg-surface text-ink
        rounded-l-xl
        overflow-hidden
        shadow-xl
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Franja de acento */}
        <div className="h-1.5 bg-linear-to-r from-brand to-accent" />

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-stroke-soft">
          <h3 className="text-lg font-semibold">{title}</h3>
          <IconButton icon={X} onClick={onClose} variant="default" size={20} />
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto h-[calc(100%-70px)]">
          {children}
        </div>
      </aside>
    </>
  );
};

export default OffCanvasLarge;