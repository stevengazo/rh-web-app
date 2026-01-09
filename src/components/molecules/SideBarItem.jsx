import { Link } from 'react-router-dom';

const SidebarItem = ({ to, icon: Icon, label }) => {
  return (
    <Link
      to={to}
      className="flex items-center gap-2 px-2 py-2 rounded-lg
                 text-gray-300 hover:text-white hover:bg-gray-800"
    >
      {Icon && <Icon size={18} />}
      <span>{label}</span>
    </Link>
  );
};

export default SidebarItem;
