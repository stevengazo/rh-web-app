import PageTitle from '../components/PageTitle';

import questionApi from '../api/questionsApi';
import QuestionsTable from '../Components/organisms/QuestionsTable';
import AddQuestion from '../Components/organisms/AddQuestion';
import AddQuestionCategory from '../Components/organisms/AddQuestionCategory';
import { useEffect, useState } from 'react';
import Add_User_Question from '../Components/organisms/Add_User_Question';
import EmployeeApi from '../api/employeesApi';
import QuestionsByUser from '../Components/organisms/QuestionsByUser';
import user_questionApi from '../api/user_questionApi';

const TABS = {
  QUESTIONS: 'questions',
  BY_USER: 'byUser',
  ASSIGN: 'assign',
  SETTINGS: 'settings',
};

const QuestionPage = () => {
  const [activeTab, setActiveTab] = useState(TABS.OBJECTIVES);
  const [questions, setQuestions] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [questionsByUser, setQuestionsByUser] = useState([]);

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
    <div className="space-y-1">
      <PageTitle>Preguntas</PageTitle>

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

          <TabButton
            active={activeTab === TABS.ASSIGN}
            onClick={() => setActiveTab(TABS.ASSIGN)}
          >
            Asignar Pregunta
          </TabButton>
          <TabButton
            active={activeTab === TABS.SETTINGS}
            onClick={() => setActiveTab(TABS.SETTINGS)}
          >
            Configuración
          </TabButton>
        </nav>
      </div>

      {/* Content */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        {/* TAB 1 */}
        {activeTab === TABS.QUESTIONS && (
          <div className="space-y-6">
            <AddQuestion />
            <hr />
            <QuestionsTable Questions={questions} />
          </div>
        )}

        {/* TAB 2 */}
        {activeTab === TABS.BY_USER && (
          <div className="space-y-4">
            <QuestionsByUser
              QuestionsByUser={questionsByUser}
              Employees={employees}
            />
          </div>
        )}

        {/* TAB 3 */}
        {activeTab === TABS.ASSIGN && (
          <div className="space-y-4">
            <Add_User_Question />
          </div>
        )}

        {/* TAB 4 */}
        {activeTab === TABS.SETTINGS && (
          <div className="space-y-4">
            <AddQuestionCategory />
          </div>
        )}
      </div>
    </div>
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
