import { LogOut } from 'lucide-react';

const Header = () => {
  return (
    <header className="h-14 bg-surface border-b border-stroke-soft flex items-center justify-end px-4">
      <button className="inline-flex items-center gap-2 h-8 px-3 rounded-md text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors">
        <LogOut size={18} />
        Salir
      </button>
    </header>
  );
};

export default Header;
