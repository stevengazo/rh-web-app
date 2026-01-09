import { motion } from 'framer-motion';
import { Mail, Lock, LogIn } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';

import { useAppContext } from '../context/AppContext';
import { loginRequest } from '../api/authApi';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, setUser } = useAppContext();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Llamada real al API
      const response = await loginRequest({
        username,
        password,
      });

      /**
       * Asumiendo respuesta tipo:
       * {
       *   token: "jwt",
       *   user: { id, name, email, role }
       * }
       */
      const { token, user } = response.data;

      // Guardar sesión global
      await login(token);
      setUser(user);

      navigate('/my-profile');
    } catch (err) {
      console.error(err);
      setError('Usuario o contraseña incorrectos');
    } finally {
      setLoading(false);
    }
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

        {/* Error */}
        {error && (
          <p className="mb-4 text-sm text-red-400 text-center">{error}</p>
        )}

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Usuario */}
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
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="usuario@empresa.com"
                required
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-700 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          {/* Botón */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={loading}
            className="w-full mt-2 flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-600 disabled:opacity-60 text-white py-2 rounded-lg font-medium transition"
          >
            <LogIn size={18} />
            {loading ? 'Ingresando...' : 'Entrar'}
          </motion.button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-slate-400 space-y-1">
          <p>
            ¿No tienes cuenta?{' '}
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
