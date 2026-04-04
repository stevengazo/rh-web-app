import { motion } from "framer-motion";
import Divider from "../Divider";
import { useMemo } from "react";

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

const QuestionsCard = ({ questions = [], answers = [] }) => {
  // 🔥 Detectar ID correcto dinámicamente
  const getQuestionId = (q) => {
    return (
      q?.id ||
      q?.user_QuestionId ||
      q?.userQuestionId ||
      q?.questionId
    );
  };

  // 🔥 Mapa optimizado O(n)
  const answersMap = useMemo(() => {
    const map = {};

    answers.forEach((a) => {
      const key =
        a?.user_QuestionId ||
        a?.userQuestionId ||
        a?.questionId;

      if (!key) return;

      map[key] = (map[key] || 0) + 1;
    });

    return map;
  }, [answers]);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-white border rounded-xl p-4 shadow-sm"
    >
      <h3 className="font-semibold text-gray-700 mb-2">Preguntas</h3>

      <Divider />

      {questions.length === 0 ? (
        <p className="text-sm text-gray-400 mt-3">Sin preguntas</p>
      ) : (
        questions.map((q) => {
          const qId = getQuestionId(q);
          const count = answersMap[qId] || 0;

          return (
            <motion.div
              key={qId}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className="mt-3 p-3 border rounded-lg"
            >
              <p className="text-sm font-medium text-gray-700">
                {q?.question?.text}
              </p>

              <div className="mt-2 text-xs text-gray-500">
                Respuestas: {count}
              </div>
            </motion.div>
          );
        })
      )}
    </motion.div>
  );
};

export default QuestionsCard;