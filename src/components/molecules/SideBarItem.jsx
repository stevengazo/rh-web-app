import { NavLink } from 'react-router-dom';

const SidebarItem = ({ to, icon: Icon, label }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150
         ${
           isActive
             ? 'bg-brand text-white'
             : 'text-gray-300 hover:text-white hover:bg-white/10'
         }`
      }
    >
      {Icon && <Icon size={18} />}
      <span>{label}</span>
    </NavLink>
  );
};

export default SidebarItem;
