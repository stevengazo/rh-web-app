import { motion } from 'framer-motion';

const IconButton = ({ icon: Icon, onClick, variant = 'default' }) => {
  const variants = {
    default: 'text-gray-600 hover:bg-gray-100',
    primary: 'text-indigo-600 hover:bg-indigo-50',
    danger: 'text-red-600 hover:bg-red-50',
  };

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className={`p-2 rounded-lg transition ${variants[variant]}`}
    >
      <Icon size={18} />
    </motion.button>
  );
};

export default IconButton;
