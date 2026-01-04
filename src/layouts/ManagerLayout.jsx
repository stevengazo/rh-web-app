import { Outlet } from "react-router-dom";
import ManagerSideBar from "./ManagerSideBar";
import { LayoutDashboard } from "lucide-react";

const ManagerLayout = () => {
  return (
    <div className="flex h-screen bg-slate-100">

      {/* Sidebar */}
      <ManagerSideBar />

      {/* Main Area */}
      <div className="flex flex-col flex-1 min-w-0">

        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200
          flex items-center justify-between px-6 shrink-0">
          
          <div className="flex items-center gap-2 text-slate-700">
            <LayoutDashboard size={18} />
            <h1 className="text-lg font-semibold">
              Panel de Gestión
            </h1>
          </div>

          <div className="text-sm text-slate-500">
            RH System
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 min-h-0 overflow-y-auto p-6">
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default ManagerLayout;
