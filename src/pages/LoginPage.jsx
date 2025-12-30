import { motion } from "framer-motion";
import { Mail, Lock, LogIn } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { useAppContext } from "../context/AppContext";

const LoginPage = () => {
  const { setUser, setIsAuthenticated, setToken } = useAppContext();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica de autenticación
    navigate("/my-profile"); // Redirige al perfil del usuario tras el login
    setIsAuthenticated(true); // Marcar como autenticado
    setUser({ name: "Usuario de Ejemplo" }); // Establecer usuario de ejemplo
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-700 px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-slate-800 text-white rounded-2xl shadow-xl p-8"
      >
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <LogIn size={40} className="text-sky-400" />
          </div>
          <h3 className="text-2xl font-bold">Iniciar sesión</h3>
          <p className="text-slate-400 text-sm">Accede a tu cuenta</p>
        </div>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Usuario / Email */}
          <div>
            <label className="block text-sm text-slate-300 mb-1">
              Usuario o correo
            </label>
            <div className="relative">
              <Mail
                className="absolute left-3 top-2.5 text-slate-400"
                size={18}
              />
              <input
                type="text"
                placeholder="usuario@empresa.com"
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-700 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          {/* Contraseña */}
          <div>
            <label className="block text-sm text-slate-300 mb-1">
              Contraseña
            </label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-2.5 text-slate-400"
                size={18}
              />
              <input
                type="password"
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-700 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          {/* Botón */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="w-full mt-2 flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-600 text-white py-2 rounded-lg font-medium transition"
          >
            <LogIn size={18} />
            Entrar
          </motion.button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-slate-400 space-y-1">
          <p>
            ¿No tienes cuenta?{" "}
            <NavLink to="/register" className="text-sky-400 hover:underline">
              Regístrate
            </NavLink>
          </p>
          <p className="text-xs">© 2025 — Sistema de Recursos Humanos</p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
