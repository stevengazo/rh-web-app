import { motion } from 'framer-motion';
import Divider from './Divider';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

const ObjectivesCard = ({ objectives = [], results = [] }) => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-white border rounded-xl p-4 shadow-sm"
    >
      <h3 className="font-semibold text-gray-700 mb-2">Objetivos</h3>

      <Divider />

      {objectives.length === 0 ? (
        <p className="text-sm text-gray-400 mt-3">Sin objetivos</p>
      ) : (
        objectives.map((obj) => {
          const relatedResults = results.filter(
            (r) => r.user_ObjetiveId === obj.id
          );

          return (
            <motion.div
              key={obj.id}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className="mt-3 p-3 border rounded-lg"
            >
              <h4 className="font-medium text-gray-800">
                {obj.objetive?.title}
              </h4>

              <p className="text-sm text-gray-500 mt-1">
                {obj.objetive?.description}
              </p>

              <div className="mt-2 text-xs text-blue-600">
                Resultados: {relatedResults.length}
              </div>
            </motion.div>
          );
        })
      )}
    </motion.div>
  );
};

export default ObjectivesCard;
