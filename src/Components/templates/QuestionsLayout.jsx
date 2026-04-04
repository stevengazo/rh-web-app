import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SectionTitle from '../SectionTitle';
import PrimaryButton from '../PrimaryButton';
import Divider from '../Divider';
import AnswersTable from '../organisms/AnswersTable';
import AnswersAdd from '../organisms/AnswersAdd';
import answersApi from '../../api/answersApi';

const QuestionsLayout = ({ User_Question }) => {
  const [showAddAnswer, setShowAddAnswer] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(false);

  const toggleAddAnswer = () => {
    setShowAddAnswer((prev) => !prev);
  };

  const loadAnswers = async () => {
    try {
      setLoading(true);
      const res = await answersApi.searchAnswers({
        UserQuestionId: User_Question.user_QuestionId,
      });
      setAnswers(res.data);
    } catch (error) {
      console.error('Error cargando respuestas', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnswers();
  }, []);

  return (
    <motion.div
      className="space-y-6 text-gray-200"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <SectionTitle>Respuestas</SectionTitle>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <PrimaryButton onClick={toggleAddAnswer}>
            {showAddAnswer ? 'Cancelar' : 'Agregar respuesta'}
          </PrimaryButton>
        </motion.div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-700/60" />

      {/* FORM CARD */}
      <AnimatePresence>
        {showAddAnswer && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="bg-gray-900 border border-gray-700 rounded-xl shadow-sm p-5"
          >
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-300">
                Nueva respuesta
              </h3>
              <p className="text-xs text-gray-500">
                Registra una respuesta para esta pregunta
              </p>
            </div>

            <AnswersAdd
              user_QuestionId={User_Question?.user_QuestionId}
              onSuccess={() => {
                setShowAddAnswer(false);
                loadAnswers();
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* TABLE CARD */}
      <div className="bg-gray-900 border border-gray-700 rounded-xl shadow-sm overflow-hidden">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12 text-sm text-gray-400"
            >
              Cargando respuestas...
            </motion.div>
          ) : (
            <motion.div
              key="table"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <AnswersTable
                answers={answers}
                onDelete={(item) => console.log('Eliminar', item)}
                onEdit={(item) => console.log('Editar', item)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default QuestionsLayout;