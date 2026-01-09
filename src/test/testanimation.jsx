import { motion } from 'framer-motion';

export default function TestAnimation() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-6 bg-indigo-600 text-white rounded-xl"
    >
      Framer Motion funcionando 🚀
    </motion.div>
  );
}
