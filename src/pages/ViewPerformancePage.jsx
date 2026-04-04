import { useEffect, useState } from 'react';
import EmployeeApi from '../api/employeesApi';
import SectionTitle from '../Components/SectionTitle';
import { useParams } from 'react-router-dom';
import Divider from '../Components/Divider';
import user_objetiveApi from '../api/user_objetiveApi';
import answersApi from '../api/answersApi';
import resultsApi from '../api/resultsApi';
import user_questionApi from '../api/user_questionApi';
import KPISChart from '../Components/KPISChart';
import ObjectivesCard from '../Components/atoms/ObjetivesCard';
import QuestionsCard from '../Components/atoms/QuestionsCard';

const TABS = {
  MAIN: 'Datos',
  CHARTS: 'Graficas',
  SEARCH: 'Buscar',
};

const ViewPerformancePage = () => {
  const [employee, setEmployee] = useState(null);
  const [objectives, setObjectives] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const { id } = useParams();
  const [activeTab, setActiveTab] = useState(TABS.CHARTS);

  const GetUserAsync = async () => {
    if (!id) return;
    const resp = await EmployeeApi.getEmployeeById(id);
    setEmployee(resp.data);
  };

  const GetUserObjectivesAsync = async () => {
    if (!id) return;
    const resp = await user_objetiveApi.getAllByUser(id);
    setObjectives(resp.data);
  };

  const GetUserQuestionAsync = async () => {
    if (!id) return;
    const resp = await user_questionApi.getUser_QuestionByUser(id);
    setQuestions(resp.data);
  };

  const GetAnswersAsync = async () => {
    if (!id) return;
    const resp = await answersApi.getAllByUser(id);
    setAnswers(resp.data);
  };

  const GetResultsAsync = async (userObjetiveId) => {
    try {
      const resp = await resultsApi.searchResults({
        user_ObjetiveId: userObjetiveId,
      });

      return resp.data; // ← importante
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  useEffect(() => {
    if (!id) return;

    const loadData = async () => {
      setLoading(true);

      try {
        await Promise.all([
          GetUserAsync(),
          GetUserObjectivesAsync(),
          GetUserQuestionAsync(),
          GetAnswersAsync(),
        ]);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  useEffect(() => {
    if (!objectives.length) return;

    const loadResults = async () => {
      try {
        const responses = await Promise.all(
          objectives.map((obj) => GetResultsAsync(obj.id))
        );

        // flatten
        const flatResults = responses.flat();
        setResults(flatResults);
      } catch (error) {
        console.error(error);
      }
    };

    loadResults();
  }, [objectives]);

  return (
    <div className="max-w-6xl mx-auto p-5">
      <SectionTitle>
        Indicadores de Rendimiento - {employee?.firstName} {employee?.lastName}
      </SectionTitle>

      <Divider />

      {loading && <p className="text-sm text-gray-400 mb-4">Cargando...</p>}

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-5">
        <nav className="flex gap-6">
          {Object.entries(TABS).map(([key, value]) => (
            <TabButton
              key={key}
              active={activeTab === value}
              onClick={() => setActiveTab(value)}
            >
              {value}
            </TabButton>
          ))}
        </nav>
      </div>

      {/* MAIN */}
      {activeTab === TABS.MAIN && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* OBJETIVOS */}
          <ObjectivesCard objectives={objectives} results={results} />

          {/* PREGUNTAS */}
          <QuestionsCard questions={questions} answers={answers} />
        </div>
      )}

      {/* CHARTS */}
      {activeTab === TABS.CHARTS && (
        <div>
          <Header title="Gráficas" />

          {objectives.length === 0 ? (
            <p className="text-sm text-gray-400">Sin datos para graficar</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {objectives.map((o) => {
                const res = results.filter(
                  (e) => e.user_ObjetiveId === o.user_ObjetiveId
                );

                return <KPISChart objetive={o} results={res} />;
              })}
            </div>
          )}
        </div>
      )}

      {/* SEARCH */}
      {activeTab === TABS.SEARCH && (
        <div>
          <Header title="Busqueda" />
          <p className="text-sm text-gray-400">Implementar búsqueda</p>
        </div>
      )}
    </div>
  );
};

/* UI */

const TabButton = ({ active, children, onClick }) => (
  <button
    onClick={onClick}
    className={`pb-3 text-sm font-medium border-b-2 transition
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

const Header = ({ title }) => (
  <div className="mb-4">
    <h2 className="text-lg font-semibold text-gray-700">{title}</h2>
  </div>
);

export default ViewPerformancePage;
