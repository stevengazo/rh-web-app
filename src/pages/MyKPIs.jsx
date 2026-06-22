import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import SectionTitle from '../Components/SectionTitle';
import Divider from '../Components/Divider';
import OffCanvasLarge from '../Components/OffCanvasLarge';

import ObjetiveLayout from '../Components/templates/ObjetiveLayout';
import QuestionsLayout from '../Components/templates/QuestionsLayout';

import { useAppContext } from '../context/AppContext';

import user_objetiveApi from '../api/user_objetiveApi';
import user_questionApi from '../api/user_questionApi';

const MyKPIs = () => {
  const { user } = useAppContext();

  const [userObjetives, setUserObjetives] = useState([]);
  const [userQuestions, setUserQuestions] = useState([]);

  const [viewMode, setViewMode] = useState('cards');

  // OffCanvas
  const [open, setOpen] = useState(false);
  const [canvasTitle, setCanvasTitle] = useState('');
  const [canvasContent, setCanvasContent] = useState(null);

  useEffect(() => {
    if (!user?.id) return;

    const fetchData = async () => {
      try {
        const response = await user_objetiveApi.getAllByUser(user.id);
        setUserObjetives(response.data || []);

        const questionsResponse = await user_questionApi.getUser_QuestionByUser(
          user.id
        );

        setUserQuestions(questionsResponse.data || []);
      } catch (error) {
        console.error('Error loading KPI data:', error);
      }
    };

    fetchData();
  }, [user?.id]);

  const openCanvas = (title, content) => {
    setCanvasTitle(title);
    setCanvasContent(content);
    setOpen(true);
  };

  return (
    <>
      {/* OffCanvas */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <OffCanvasLarge
              isOpen={open}
              onClose={() => setOpen(false)}
              title={canvasTitle}
            >
              <motion.div
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 50, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {canvasContent}
              </motion.div>
            </OffCanvasLarge>
          </motion.div>
        )}
      </AnimatePresence>

      <SectionTitle>Mis Indicadores de Rendimiento</SectionTitle>
      <Divider />

      {/* OBJETIVOS */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <SectionTitle>Objetivos Asignados</SectionTitle>

          {/* View toggle */}
          <div className="flex border border-stroke rounded-md overflow-hidden">
            <button
              onClick={() => setViewMode('cards')}
              className={`px-4 py-1 text-sm ${
                viewMode === 'cards'
                  ? 'bg-brand text-white'
                  : 'bg-surface text-ink-muted'
              }`}
            >
              Cards
            </button>

            <button
              onClick={() => setViewMode('table')}
              className={`px-4 py-1 text-sm ${
                viewMode === 'table'
                  ? 'bg-brand text-white'
                  : 'bg-surface text-ink-muted'
              }`}
            >
              Tabla
            </button>
          </div>
        </div>

        {/* CARD VIEW */}
        {viewMode === 'cards' && (
          <div className="grid gap-6 md:grid-cols-2">
            {userObjetives.map((obj) => (
              <div
                key={obj.user_ObjetiveId}
                onClick={() =>
                  openCanvas(
                    `Objetivo ${obj.objetive?.title || 'Sin título'}`,
                    <ObjetiveLayout User_Objetive={obj} />
                  )
                }
                className="bg-surface rounded-xl border border-stroke-soft shadow-sm hover:shadow-md transition-shadow p-6 cursor-pointer"
              >
                <h2 className="text-lg font-semibold text-ink">
                  {obj.objetive?.title || 'Sin título'}
                </h2>

                <p className="text-ink-muted text-sm mt-2">
                  {obj.objetive?.description || 'Sin descripción'}
                </p>

                <div className="mt-4 text-xs text-ink-muted">
                  {obj.objetive?.questions?.length || 0} preguntas asociadas
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TABLE VIEW */}
        {viewMode === 'table' && (
          <div className="overflow-x-auto border border-stroke-soft rounded-xl">
            <table className="min-w-full text-sm">
              <thead className="bg-surface-alt text-ink-secondary">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold">Objetivo</th>
                  <th className="text-left px-4 py-3 font-semibold">Descripción</th>
                  <th className="text-left px-4 py-3 font-semibold">Preguntas</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-stroke-soft">
                {userObjetives.map((obj) => (
                  <tr
                    key={obj.user_ObjetiveId}
                    onClick={() =>
                      openCanvas(
                        `Objetivo ${obj.objetive?.title || 'Sin título'}`,
                        <ObjetiveLayout User_Objetive={obj} />
                      )
                    }
                    className="hover:bg-canvas transition-colors cursor-pointer"
                  >
                    <td className="px-4 py-3 font-medium text-ink">
                      {obj.objetive?.title}
                    </td>

                    <td className="px-4 py-3 text-ink-muted">
                      {obj.objetive?.description}
                    </td>

                    <td className="px-4 py-3 text-ink-muted">
                      {obj.objetive?.questions?.length || 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Divider />

      {/* PREGUNTAS */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <SectionTitle>Preguntas</SectionTitle>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {userQuestions.map((uq) => (
            <div
              key={uq.user_QuestionId}
              onClick={() =>
                openCanvas(
                  `Pregunta ${uq.question?.text || 'Sin título'}`,
                  <QuestionsLayout User_Question={uq} />
                )
              }
              className="bg-surface rounded-xl border border-stroke-soft shadow-sm p-5 hover:shadow-md transition cursor-pointer"
            >
              <h3 className="text-sm font-semibold text-ink mb-2">
                {uq.question?.text}
              </h3>

              <div className="flex justify-between text-xs text-ink-muted">
                <span>{uq.question?.isActive ? 'Activa' : 'Inactiva'}</span>

                <span>ID: {uq.question?.questionId}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default MyKPIs;
