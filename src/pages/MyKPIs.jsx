import SectionTitle from '../Components/SectionTitle';
import { useAppContext } from '../context/AppContext';
import user_objetiveApi from '../api/user_objetiveApi';
import user_questionApi from '../api/user_questionApi';
import answersApi from '../api/answersApi';
import resultsApi from '../api/resultsApi';
import { use } from 'react';
import { useState, useEffect } from 'react';
import Divider from '../Components/Divider';
import PrimaryButton from '../Components/PrimaryButton';

const MyKPIs = () => {
  const { user } = useAppContext();
  const [userObjetives, setUserObjetives] = useState([]);
  const [userQuestions, setUserQuestions] = useState([]);
  // GetData
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch User Objetives
        const Response = await user_objetiveApi.getAllByUser(user.id);
        setUserObjetives(Response.data);
        // fetch User Questions
        const questionsResponse = await user_questionApi.getUser_QuestionByUser(
          user.id
        );
        setUserQuestions(questionsResponse.data);
        console.log(questionsResponse.data);
      } catch (error) {
        {
        }
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <SectionTitle>Mis Indicadores de Rendimiento</SectionTitle>
      <Divider />

      <div className="flex justify-between items-center mb-6">
        <SectionTitle>Objetivos Asignados</SectionTitle>
        <PrimaryButton>Agregar Resultados</PrimaryButton>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {userObjetives.map((obj, index) => (
          <div
            key={index}
            className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-6"
          >
            {/* Header */}
            <div className="mb-4">
              <h2 className="text-lg font-bold text-gray-800">
                {obj.objetive?.title || 'Sin título'}
              </h2>
              <span className="text-xs text-gray-400">Objetivo</span>
            </div>

            {/* Description */}
            <p className="text-gray-600 text-sm mb-5">
              {obj.objetive?.description || 'Sin descripción'}
            </p>

            {/* Questions */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                Preguntas asociadas
              </h3>

              {obj.objetive?.questions?.length ? (
                <ul className="space-y-2">
                  {obj.objetive.questions.map((q) => (
                    <li
                      key={q.id}
                      className="bg-gray-50 border rounded-md px-3 py-2 text-sm text-gray-700"
                    >
                      {q.text}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-400 italic">
                  No hay preguntas asociadas
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <Divider />
      <div className="flex justify-between items-center mb-6">
        <SectionTitle>Preguntas</SectionTitle>
        <PrimaryButton>Agregar Pregunta</PrimaryButton>
      </div>
        <div className="grid gap-4 md:grid-cols-2">
          {userQuestions.length ? (
            userQuestions.map((uq) => (
              <div
                key={uq.user_QuestionId}
                className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:shadow-md transition"
              >
                {/* Question text */}
                <h3 className="text-sm font-semibold text-gray-800 mb-2">
                  {uq.question?.text || 'Pregunta sin texto'}
                </h3>

                {/* Meta info */}
                <div className="flex justify-between text-xs text-gray-400">
                  <span>
                    Estado:{' '}
                    {uq.question?.isActive ? (
                      <span className="text-green-600 font-medium">Activa</span>
                    ) : (
                      <span className="text-red-500 font-medium">Inactiva</span>
                    )}
                  </span>

                  <span>ID: {uq.question?.questionId}</span>
                </div>

                {/* Answers placeholder */}
                <div className="mt-3">
                  {uq.answers?.length ? (
                    <p className="text-xs text-gray-500">
                      Respuestas registradas: {uq.answers.length}
                    </p>
                  ) : (
                    <p className="text-xs text-gray-400 italic">
                      Sin respuestas aún
                    </p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-400 italic">
              No hay preguntas registradas para este usuario.
            </p>
          )}
        </div>
    </>
  );
};

export default MyKPIs;
