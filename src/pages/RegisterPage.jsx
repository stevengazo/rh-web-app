import { motion } from 'framer-motion';
import { Mail, Lock, UserPlus } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { registerRequest } from '../api/authApi';
import { useState } from 'react';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUser(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await registerRequest({
        ...newUser,
        username: newUser.email, // se mantiene así 👍
      });

      toast.success('Usuario creado correctamente');
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        Object.values(error.response?.data?.errors || {})?.[0]?.[0] ||
        'Error al registrar usuario';

      toast.error(msg);
      console.error(error);
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
            <UserPlus size={40} className="text-sky-400" />
          </div>
          <h3 className="text-2xl font-bold">Crear cuenta</h3>
          <p className="text-slate-400 text-sm">
            Regístrate para acceder al sistema
          </p>
        </div>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Email */}
          <div>
            <label className="block text-sm text-slate-300 mb-1">
              Correo electrónico
            </label>
            <div className="relative">
              <Mail
                className="absolute left-3 top-2.5 text-slate-400"
                size={18}
              />
              <input
                name="email"
                type="email"
                value={newUser.email}
                onChange={handleChange}
                placeholder="correo@empresa.com"
                required
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-700 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          {/* Password */}
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
                name="password"
                type="password"
                value={newUser.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-700 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          {/* Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="w-full mt-2 flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-600 text-white py-2 rounded-lg font-medium transition"
          >
            <UserPlus size={18} />
            Registrarse
          </motion.button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-slate-400">
          ¿Ya tienes cuenta?{' '}
          <NavLink to="/login" className="text-sky-400 hover:underline">
            Inicia sesión
          </NavLink>
        </p>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
