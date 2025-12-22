import { Outlet } from "react-router-dom";

import NavBar from "./NavBar";

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100 text-gray-800">
      {/* Header */}
      <header className="shadow-sm px-6 py-4">
        <NavBar />
      </header>

      {/* Contenido dinámico */}
      <main className="flex-1 p-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t px-6 py-3 text-center text-sm text-gray-400">
        © 2025 — My App
      </footer>
    </div>
  );
};

export default MainLayout;
