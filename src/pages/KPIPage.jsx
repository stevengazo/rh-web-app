import { useEffect, useState } from 'react';

import ObjetivesTable from '../Components/organisms/ObjetivesTable';
import AddObjetive from '../Components/organisms/AddObjetive';
import AddObjetiveCategory from '../Components/organisms/AddObjetiveCategory';
import ObjetivesByUser from '../Components/organisms/ObjetivesByUser';
import Add_User_Objetive from '../Components/organisms/Add_User_Objetive';
import user_objetiveApi from '../api/user_objetiveApi';
import EmployeeApi from '../api/employeesApi';

import kpiApi from '../api/kpiApi';

const TABS = {
  OBJECTIVES: 'objectives',
  BY_USER: 'byUser',
  ASSIGN: 'assign',
  SETTINGS: 'settings',
};

const KPIPage = () => {
  const [activeTab, setActiveTab] = useState(TABS.OBJECTIVES);
  const [kpis, setKpis] = useState([]);
  const [kpisByUser, setKpisByUser] = useState([]);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    async function getDataAsync() {
      try {
        const response = await kpiApi.getAllKPIs();
        setKpis(response.data);
        const re2 = await user_objetiveApi.getAllUser_Objetives();
        setKpisByUser(re2.data);

        const ResEmpl = await EmployeeApi.getAllEmployees();
        setEmployees(ResEmpl.data);
      } catch (error) {
        console.error(error);
      }
    }

    getDataAsync();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="space-y-1">
        <h1>Indicadores de Rendimiento</h1>
        <p className="text-sm text-gray-600">
          Gestión y administración de los indicadores de rendimiento de los
          empleados.
        </p>
      </header>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-6">
          <TabButton
            active={activeTab === TABS.OBJECTIVES}
            onClick={() => setActiveTab(TABS.OBJECTIVES)}
          >
            Objetivos
          </TabButton>

          <TabButton
            active={activeTab === TABS.BY_USER}
            onClick={() => setActiveTab(TABS.BY_USER)}
          >
            Objetivos por Usuario
          </TabButton>

          <TabButton
            active={activeTab === TABS.ASSIGN}
            onClick={() => setActiveTab(TABS.ASSIGN)}
          >
            Asignar Objetivo
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
      <div className="py-2">
        {/* TAB 1 */}
        {activeTab === TABS.OBJECTIVES && (
          <div className="">
            <section className="flex flex-row gap-0 justify-items-start align-bottom">
              <div className="w-2/5 p-2">
                <AddObjetive />
              </div>
              <div className="w-3/5  p-2">
                <h2>Objetivos (KPIS)</h2>
                <ObjetivesTable objetives={kpis} />
              </div>
            </section>
          </div>
        )}

        {/* TAB 2 */}
        {activeTab === TABS.BY_USER && (
          <div className="space-y-4">
            <ObjetivesByUser
              ObjetivesByUser={kpisByUser}
              Employees={employees}
            />
          </div>
        )}

        {/* TAB 3 */}
        {activeTab === TABS.ASSIGN && <Add_User_Objetive />}

        {/* TAB 4 */}
        {activeTab === TABS.SETTINGS && <AddObjetiveCategory />}
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

export default KPIPage;
