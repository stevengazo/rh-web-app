import { useEffect, useState } from 'react';
import SectionTitle from '../SectionTitle';
import PrimaryButton from '../PrimaryButton';
import Divider from '../Divider';
import AnswersTable from '../organisms/AnswersTable';
import AnswersAdd from '../organisms/AnswersAdd';
import answersApi from '../../api/answersApi';

const QuestionsLayout = ({ User_Question }) => {
  console.log('User_Question en QuestionsLayout:', User_Question);
  const [showAddAnswer, setShowAddAnswer] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(false);

  const toggleAddAnswer = () => {
    setShowAddAnswer((prev) => !prev);
  };

  const loadAnswers = async () => {
    try {
      setLoading(true);
      const res = await answersApi.searchAnswers({ UserQuestionId: User_Question.user_QuestionId });
      setAnswers(res.data);
    } catch (error) {
      console.error('Error cargando respuestas', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (User_Question?.user_QuestionId) {
      loadAnswers();
    }
  }, []);

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between">
        <SectionTitle>Respuestas</SectionTitle>

        <PrimaryButton onClick={toggleAddAnswer}>
          {showAddAnswer ? 'Cancelar' : 'Agregar respuesta'}
        </PrimaryButton>
      </div>

      <Divider />

      {/* Formulario */}
      {showAddAnswer && (
        <div className="mb-6">
          <AnswersAdd
            user_QuestionId={User_Question?.user_QuestionId}
            onSuccess={() => {
              setShowAddAnswer(false);
              loadAnswers();
            }}
          />
        </div>
      )}

      {/* Tabla */}
      {loading ? (
        <div className="text-center text-gray-500 py-6">
          Cargando respuestas...
        </div>
      ) : (
        <AnswersTable
          answers={answers}
          onDelete={(item) => console.log('Eliminar', item)}
          onEdit={(item) => console.log('Editar', item)}
        />
      )}
    </>
  );
};

export default QuestionsLayout;
