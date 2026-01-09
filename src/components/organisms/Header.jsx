import { LogOut } from 'lucide-react';

const Header = () => {
  return (
    <header className="h-14 bg-white border-b flex items-center justify-end px-4">
      <button className="flex items-center gap-2 text-red-500">
        <LogOut size={18} />
        Salir
      </button>
    </header>
  );
};

export default Header;
