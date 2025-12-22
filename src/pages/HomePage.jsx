import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, LogIn, UserPlus } from "lucide-react";

const HomePage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-700 text-white px-4">
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-slate-800 rounded-2xl shadow-xl p-10 max-w-md w-full text-center"
      >
        
        {/* Icono */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center mb-4"
        >
          <Users size={48} className="text-sky-400" />
        </motion.div>

        {/* Título */}
        <h1 className="text-2xl font-bold mb-2">
          Sistema de Recursos Humanos
        </h1>

        <p className="text-slate-300 mb-8">
          Gestión moderna de empleados, planillas y vacaciones
        </p>

        {/* Acciones */}
        <div className="flex flex-col gap-3">
          
          <NavLink to="/login">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-600 transition"
            >
              <LogIn size={18} />
              Iniciar Sesión
            </motion.button>
          </NavLink>

          <NavLink to="/register">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-slate-600 hover:bg-slate-700 transition"
            >
              <UserPlus size={18} />
              Crear Cuenta
            </motion.button>
          </NavLink>

        </div>
      </motion.div>
    </div>
  );
};

export default HomePage;
