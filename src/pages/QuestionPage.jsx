import PageTitle from '../components/PageTitle';

import questionApi from '../api/questionsApi';
import AddQuestionCategory from '../Components/organisms/AddQuestionCategory';
import { useState } from 'react';

const TABS = {
  QUESTIONS: 'questions',
  BY_USER: 'byUser',
  ASSIGN: 'assign',
  SETTINGS: 'settings',
};

const QuestionPage = () => {
  const [activeTab, setActiveTab] = useState(TABS.OBJECTIVES);
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
           
          </div>
        )}

        {/* TAB 2 */}
        {activeTab === TABS.BY_USER && (
          <div className="space-y-4">
              </div>
        )}

        {/* TAB 3 */}
        {activeTab === TABS.ASSIGN && (
          <div className="space-y-4">
          
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
