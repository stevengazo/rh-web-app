import { Outlet } from 'react-router-dom';
import ManagerSideBar from './ManagerSideBar';
import { LayoutDashboard } from 'lucide-react';

const ManagerLayout = () => {
  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">
      {/* Sidebar (maneja mobile internamente) */}
      <ManagerSideBar />

      {/* Main Area */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Header */}
        <header
          className="h-16 bg-white border-b border-slate-200
          flex items-center justify-between px-4 md:px-6 shrink-0"
        >
          <div className="flex items-center gap-2 text-slate-700">
            <LayoutDashboard size={18} />
            <h1 className="text-base md:text-lg font-semibold">
              Panel de Gestión
            </h1>
          </div>

          <div className="text-xs md:text-sm text-slate-500">
            RH System
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 min-h-0 overflow-y-auto p-4 md:p-6">
          <div
            className="
              bg-white
              mx-auto
              rounded-xl
              shadow-sm
              p-4 md:p-6
              max-w-full
              md:max-w-5xl
              lg:max-w-6xl
            "
          >
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default ManagerLayout;
