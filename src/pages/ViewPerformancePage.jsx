import { useEffect, useState } from 'react';
import EmployeeApi from '../api/employeesApi';
import SectionTitle from '../Components/SectionTitle';
import { useParams } from 'react-router-dom';
import Divider from '../Components/Divider';
import PrimaryButton from '../Components/PrimaryButton';

const TABS = {
  MAIN: 'Datos',
  CHARTS: 'Graficas',

  SEARCH: 'Buscar',
};

const ViewPerformancePage = () => {
  const [employee, setEmployee] = useState({});
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState(TABS.MAIN);

  useEffect(() => {
    async function GetData() {
      const Resp = await EmployeeApi.getEmployeeById(id);
      setEmployee(Resp.data);
      console.log(Resp.data);
    }
    GetData();
  }, []);

  return (
    <>
      <SectionTitle>
        Indicadores de Rendimiento - {employee.firstName} {employee.lastName}
      </SectionTitle>
      <Divider />

      {/* Tabs */}
      <div className="border-b border-gray-200">
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

      {/* INFO */}
      {activeTab === TABS.MAIN && (
        <div className="p-2 py-3">
          <Header
            title="Detalles del Empleado"
            action={() =>
              openCanvas(
                'Editar Información',
                <EmployeeEdit employee={employee} setEmployee={setEmployee} />
              )
            }
          />
          <div className="flex flex-row w-full justify-items-center gap-3">
            {/*Objetivos*/}
            <div className="p-3 border rounded w-1/2 border-gray-200 shadow ">
              <h3 className=" text-2xl font-bold text-gray-500">Objetivos</h3>
              <Divider />
            </div>
            {/*Preguntas*/}
            <div className="p-3 border rounded w-1/2 border-gray-200 shadow ">
              <h3 className=" text-2xl font-bold text-gray-500">Preguntas</h3>
              <Divider />
            </div>
          </div>
        </div>
      )}

      {/* chars*/}
      {activeTab === TABS.CHARTS && (
        <div className="p-2 py-3">
          <Header title="Gráficas" />
        </div>
      )}

      {/* chars*/}
      {activeTab === TABS.SEARCH && (
        <div className="p-2 py-3">
          <Header title="Busqueda" />
        </div>
      )}
    </>
  );
};

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

const Header = ({ title, action }) => (
  <div className="flex justify-between items-center mb-4">
    <SectionTitle>{title}</SectionTitle>
  </div>
);

export default ViewPerformancePage;
