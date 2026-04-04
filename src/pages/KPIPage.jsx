import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import ObjetivesTable from '../Components/organisms/ObjetivesTable';
import AddObjetive from '../Components/organisms/AddObjetive';
import AddObjetiveCategory from '../Components/organisms/AddObjetiveCategory';
import ObjetivesByUser from '../Components/organisms/ObjetivesByUser';
import Add_User_Objetive from '../Components/organisms/Add_User_Objetive';

import OffCanvas from '../Components/OffCanvas';

import user_objetiveApi from '../api/user_objetiveApi';
import EmployeeApi from '../api/employeesApi';
import kpiApi from '../api/kpiApi';

import useOffCanvas from '../hooks/useOffCanvas';

const TABS = {
  KPIS: 'kpis',
  KPIS_BY_USER: 'kpis_by_user',
};

const KPIPage = () => {
  const [kpis, setKpis] = useState([]);
  const [kpisByUser, setKpisByUser] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [activeTab, setActiveTab] = useState(TABS.KPIS);

  const { open, canvasTitle, canvasContent, openCanvas, closeCanvas } =
    useOffCanvas();

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

  const baseBtn =
    'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 shadow-sm';

  const primaryBtn =
    'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md active:scale-[0.97]';

  return (
    <>
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

      <div className="max-w-7xl mx-auto px-4 space-y-6">
        {/* HEADER */}
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold">Indicadores de Rendimiento</h1>
          <p className="text-sm text-gray-600">
            Gestión y administración de los indicadores de rendimiento de los
            empleados.
          </p>
        </header>

        {/* ACTIONS */}
        <div className="flex flex-wrap gap-3">
          <button
            className={`${baseBtn} ${primaryBtn}`}
            onClick={() => openCanvas('Agregar Objetivo', <AddObjetive />)}
          >
            Agregar Objetivo
          </button>

          <button
            className={`${baseBtn} ${primaryBtn}`}
            onClick={() =>
              openCanvas('Agregar Categorías', <AddObjetiveCategory />)
            }
          >
            Agregar Categorías
          </button>

          <button
            className={`${baseBtn} ${primaryBtn}`}
            onClick={() =>
              openCanvas('Agregar Objetivo a Usuario', <Add_User_Objetive />)
            }
          >
            Agregar Objetivo a Usuario
          </button>
        </div>

        {/* TABS */}
        <div className="border-b flex gap-6">
          <button
            onClick={() => setActiveTab(TABS.KPIS)}
            className={`pb-2 text-sm font-medium transition ${
              activeTab === TABS.KPIS
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            KPIs
          </button>

          <button
            onClick={() => setActiveTab(TABS.KPIS_BY_USER)}
            className={`pb-2 text-sm font-medium transition ${
              activeTab === TABS.KPIS_BY_USER
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            KPIs por Usuario
          </button>
        </div>

        {/* CONTENT */}
        <AnimatePresence mode="wait">
          {activeTab === TABS.KPIS && (
            <motion.div
              key="kpis"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <h2 className="font-semibold mb-4">Objetivos (KPIs)</h2>
              <ObjetivesTable objetives={kpis} />
            </motion.div>
          )}

          {activeTab === TABS.KPIS_BY_USER && (
            <motion.div
              key="kpis_by_user"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <ObjetivesByUser
                ObjetivesByUser={kpisByUser}
                Employees={employees}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default KPIPage;
