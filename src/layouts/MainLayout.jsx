import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';

const HEADER_HEIGHT = '64px'; // ajusta si tu NavBar cambia

const MainLayout = () => {
  return (
    <div className="h-screen bg-gray-100 text-gray-800 flex flex-col">
      {/* Header fijo */}
      <header
        className="fixed top-0 left-0 right-0 w-full bg-white z-50
                   h-16  shadow-sm px-6 "
      >
        <NavBar />
      </header>

      {/* Contenido */}
      <main className="flex-1 pt-16 overflow-y-auto p-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer
        className="bg-white border-t px-6 py-3
                         text-center text-sm text-gray-400 shrink-0"
      >
        © 2025 — My App
      </footer>
    </div>
  );
};

export default MainLayout;
