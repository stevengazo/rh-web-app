import { useEffect, useState } from 'react';
import EmployeeApi from '../api/employeesApi';
import PageTitle from '../Components/PageTitle';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import SecondaryButton from '../Components/SecondaryButton';
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
  CHARTS: 'Graficas'
};

const ViewPerformancePage = () => {
  const [employee, setEmployee] = useState(null);
  const [objectives, setObjectives] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();
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
          objectives.map((obj) => GetResultsAsync(obj.user_ObjetiveId))
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
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-2 inline-flex items-center gap-1.5 text-sm font-semibold text-ink-muted transition-colors hover:text-brand"
      >
        <ArrowLeft size={15} />
        Volver
      </button>

      <PageTitle className="mb-0">
        Desempeño · {employee?.firstName} {employee?.lastName}
      </PageTitle>
      <p className="text-sm text-ink-muted">
        Objetivos, preguntas y resultados registrados para este colaborador.
      </p>

      <Divider />

      {loading && <p className="text-sm text-ink-muted mb-4">Cargando…</p>}

      {!loading && objectives.length === 0 && questions.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-stroke bg-surface-alt py-14 text-ink-muted">
          <p className="text-sm font-medium">
            Este colaborador no tiene objetivos ni preguntas asignadas.
          </p>
          <SecondaryButton onClick={() => navigate('/manager/kpis')}>
            Ir a Indicadores de Rendimiento
          </SecondaryButton>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-stroke-soft mb-5">
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
            <p className="text-sm text-ink-muted">Sin datos para graficar</p>
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
          ? 'border-brand text-brand'
          : 'border-transparent text-ink-muted hover:text-ink hover:border-stroke'
      }
    `}
  >
    {children}
  </button>
);

const Header = ({ title }) => (
  <div className="mb-4">
    <h2 className="text-lg font-semibold text-ink">{title}</h2>
  </div>
);

export default ViewPerformancePage;
