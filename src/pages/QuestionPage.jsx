import PageTitle from '../Components/PageTitle';
import { AnimatePresence, motion } from 'framer-motion';
import questionApi from '../api/questionsApi';
import QuestionsTable from '../Components/organisms/QuestionsTable';
import AddQuestion from '../Components/organisms/AddQuestion';
import AddQuestionCategory from '../Components/organisms/AddQuestionCategory';
import { useEffect, useState } from 'react';
import Add_User_Question from '../Components/organisms/Add_User_Question';
import EmployeeApi from '../api/employeesApi';
import QuestionsByUser from '../Components/organisms/QuestionsByUser';
import user_questionApi from '../api/user_questionApi';

import OffCanvas from '../Components/OffCanvas';
import useOffCanvas from '../hooks/useOffCanvas';

const TABS = {
  QUESTIONS: 'questions',
  BY_USER: 'byUser',
  ASSIGN: 'assign',
  SETTINGS: 'settings',
};
const baseBtn =
  'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 shadow-sm';

const primaryBtn =
  'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md active:scale-[0.97]';

const QuestionPage = () => {
  const [activeTab, setActiveTab] = useState(TABS.OBJECTIVES);
  const [questions, setQuestions] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [questionsByUser, setQuestionsByUser] = useState([]);

  const { open, canvasTitle, canvasContent, openCanvas, closeCanvas } =
    useOffCanvas();

  useEffect(() => {
    async function GetData() {
      // Questions
      const RespQuestions = await questionApi.getAllQuestions();
      setQuestions(RespQuestions.data);
      // Employees
      const RespEmployees = await EmployeeApi.getAllEmployees();
      setEmployees(RespEmployees.data);
      // Questions By User
      const RestQuesByUser = await user_questionApi.getAllUser_Questions();
      setQuestionsByUser(RestQuesByUser.data);
    }
    GetData();
  }, []);

  return (
    <>
      <div>
        {/* OffCanvas */}
        <AnimatePresence>
          {open && (
            <OffCanvas isOpen={open} onClose={closeCanvas} title={canvasTitle}>
              <motion.div
                initial={{ x: 40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 40, opacity: 0 }}
              >
                {canvasContent}
              </motion.div>
            </OffCanvas>
          )}
        </AnimatePresence>
      </div>

      <div className="max-w-7xl mx-auto px-4 space-y-6">
        {/* HEADER */}
        <header className="space-y-1">
          <PageTitle>Preguntas</PageTitle>
          <p className="text-sm text-gray-600">
            Gestión y administración de las preguntas del personal.
          </p>
        </header>

        {/* ACTIONS */}
        <div className="flex flex-wrap gap-3">
          <button
            className={`${baseBtn} ${primaryBtn}`}
            onClick={() => openCanvas('Agregar Preguntas', <AddQuestion />)}
          >
            Agregar Pregunta
          </button>

          <button
            className={`${baseBtn} ${primaryBtn}`}
            onClick={() =>
              openCanvas('Agregar Categoria', <AddQuestionCategory />)
            }
          >
            Agregar Catergoria
          </button>

          <button
            className={`${baseBtn} ${primaryBtn}`}
            onClick={() =>
              openCanvas('Asignar Categoria', <Add_User_Question />)
            }
          >
            Asignar Pregunta
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex gap-6">
            <TabButton
              active={activeTab === TABS.QUESTIONS}
              onClick={() => setActiveTab(TABS.QUESTIONS)}
            >
              Preguntas
            </TabButton>

            <TabButton
              active={activeTab === TABS.BY_USER}
              onClick={() => setActiveTab(TABS.BY_USER)}
            >
              Preguntas por Usuario
            </TabButton>
          </nav>
        </div>

        {/* Content */}
        <div className=" py-2 ">
          {/* TAB 1 */}
          {activeTab === TABS.QUESTIONS && (
            <QuestionsTable Questions={questions} />
          )}

          {/* TAB 2 */}
          {activeTab === TABS.BY_USER && (

              <QuestionsByUser
                QuestionsByUser={questionsByUser}
                Employees={employees}
              />
  
          )}
        </div>
      </div>
    </>
  );
};

const TabButton = ({ active, children, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`pb-3 text-sm font-medium transition-colors border-b-2
        ${
          active
            ? 'border-blue-600 text-blue-600'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
        }
      `}
    >
      {children}
    </button>
  );
};

export default QuestionPage;
