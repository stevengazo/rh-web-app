import { motion } from 'framer-motion';

/**
 * Aparición suave al entrar en pantalla. Envuelve secciones del sitio público
 * para dar ritmo sin recargar la navegación.
 *
 * @param {number} [delay] Retardo en segundos (para escalonar listas).
 */
const Reveal = ({ children, delay = 0, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.15 }}
    transition={{ duration: 0.5, delay, ease: 'easeOut' }}
    className={className}
  >
    {children}
  </motion.div>
);

export default Reveal;
