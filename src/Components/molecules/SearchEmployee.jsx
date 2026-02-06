import { Search, X } from 'lucide-react';
import { motion } from 'framer-motion';

const SearchEmployee = ({ value, onChange, onClear }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center  bg-white rounded-xl  border-slate-200 "
    >
      {/* Input */}
      <div className="relative flex-1">
        <Search size={18} className="absolute left-3 top-2.5 text-slate-400" />
        <input
          type="text"
          placeholder="Buscar por nombre, apellido o email..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-10 pr-10 py-2 rounded-lg border border-slate-300
                     focus:outline-none focus:ring-2 focus:ring-sky-500"
        />
      </div>

   
    </motion.div>
  );
};

export default SearchEmployee;
