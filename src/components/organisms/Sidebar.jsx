import { LayoutDashboard, Users } from 'lucide-react';
import SidebarItem from '../molecules/SideBarItem';

const Sidebar = () => {
  return (
    <aside className="w-64 bg-gray-900 text-white p-4">
      <h2 className="text-xl font-bold mb-6">Sistema RH</h2>

      <nav className="space-y-2">
        <SidebarItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" />
        <SidebarItem to="/employees" icon={Users} label="Empleados" />
      </nav>
    </aside>
  );
};

export default Sidebar;
