import { motion } from 'framer-motion';
import Divider from './../Divider';

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
      className=""
    >
      <h3 className="font-semibold text-ink-secondary mb-2">Objetivos</h3>

      <Divider />

      {objectives.length === 0 ? (
        <p className="text-sm text-ink-muted mt-3">Sin objetivos</p>
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
              className="mt-3 px-1 py-0.5 border bg-brand-tint hover:bg-brand-100 transition duration-200 border-brand-tint  rounded-md"
            >
              <h4 className="font-medium text-ink">
                {obj.objetive?.title}
              </h4>

              <p className="text-sm text-ink-muted mt-1">
                {obj.objetive?.description}
              </p>

              <div className="mt-2 text-xs text-brand">
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
