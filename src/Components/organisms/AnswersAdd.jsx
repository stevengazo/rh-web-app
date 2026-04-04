import { useState } from 'react';
import { MessageSquare, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import answersApi from '../../api/answersApi';
import toast from 'react-hot-toast';

const AnswersAdd = ({ user_QuestionId, onSuccess }) => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!text.trim()) {
      setError('La respuesta no puede estar vacía.');
      return;
    }

    try {
      setLoading(true);

      const payload = {
        text,
        user_QuestionId,
      };

      await answersApi.createAnswer(payload);
      toast.success('Respuesta guardada exitosamente.');

      setText('');
      onSuccess?.();
    } catch (err) {
      console.error(err);
      setError('Error al guardar la respuesta.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.25 }}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Respuesta */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Respuesta
          </label>

          <div className="relative">
            <MessageSquare
              size={18}
              className="absolute left-3 top-3 text-gray-500"
            />

            <motion.textarea
              rows={4}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Escribe la respuesta aquí..."
              whileFocus={{ scale: 1.01 }}
              className="
                w-full
                pl-10 pr-3 py-2
                border border-gray-700
                bg-gray-950
                text-gray-200
                rounded-lg text-sm resize-none
                placeholder:text-gray-500
                focus:outline-none
                focus:ring-2 focus:ring-blue-500
                focus:border-blue-500
                transition
              "
            />
          </div>
        </div>

        {/* Error animado */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -5, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -5, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="bg-red-900/30 border border-red-800 text-red-400 text-sm rounded-lg px-4 py-2"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Actions */}
        <div className="flex justify-end">
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="
              inline-flex items-center gap-2
              bg-blue-600 text-white
              px-6 py-2 rounded-lg text-sm font-medium
              hover:bg-blue-700 transition
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            <Save size={16} />

            {loading && (
              <motion.span
                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              />
            )}

            {loading ? 'Guardando...' : 'Guardar respuesta'}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

export default AnswersAdd;