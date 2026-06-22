import { motion } from 'framer-motion';
import { Ghost, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PrimaryButton from '../Components/PrimaryButton';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-canvas">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center bg-surface p-10 rounded-xl shadow-lg max-w-md"
      >
        {/* Icon */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="flex justify-center mb-6 text-brand"
        >
          <Ghost size={64} />
        </motion.div>

        <h1 className="text-5xl font-semibold text-ink mb-2">404</h1>
        <h3 className="text-lg text-ink-muted mb-6">Página no encontrada</h3>

        <PrimaryButton onClick={() => navigate('/')}>
          <ArrowLeft size={18} />
          Volver al inicio
        </PrimaryButton>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
