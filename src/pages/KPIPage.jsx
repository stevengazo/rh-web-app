import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ObjetivesTable from '../Components/organisms/ObjetivesTable';
import AddObjetive from '../Components/organisms/AddObjetive';
import AddObjetiveCategory from '../Components/organisms/AddObjetiveCategory';
import ObjetivesByUser from '../Components/organisms/ObjetivesByUser';
import Add_User_Objetive from '../Components/organisms/Add_User_Objetive';
import OffCanvasLarge from '../Components/OffCanvasLarge';
import user_objetiveApi from '../api/user_objetiveApi';
import useOffCanvas from '../hooks/useOffCanvas';
import EmployeeApi from '../api/employeesApi';
import kpiApi from '../api/kpiApi';

const KPIPage = () => {
  const [kpis, setKpis] = useState([]);
  const [kpisByUser, setKpisByUser] = useState([]);
  const [employees, setEmployees] = useState([]);
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

  return (
    <>
      {/* OffCanvas */}
      <AnimatePresence>
        {open && (
          <OffCanvasLarge
            isOpen={open}
            onClose={closeCanvas}
            title={canvasTitle}
          >
            <motion.div
              initial={{ x: 40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 40, opacity: 0 }}
            >
              {canvasContent}
            </motion.div>
          </OffCanvasLarge>
        )}
      </AnimatePresence>
      <>
        <div className="max-w-7xl mx-auto px-4 space-y-6">
          {/* HEADER */}
          <header className="space-y-1">
            <h1 className="text-2xl font-semibold">
              Indicadores de Rendimiento
            </h1>
            <p className="text-sm text-gray-600">
              Gestión y administración de los indicadores de rendimiento de los
              empleados.
            </p>
          </header>

          <button
            className="border rounded p-1 text-white bg-blue-500 hover:bg-blue-800 duration-200"
            onClick={() => openCanvas('Agregar Objetivo', <AddObjetive />)}
          >
            Agregar Objetivo
          </button>

          <button
            className="border rounded p-1 text-white bg-blue-500 hover:bg-blue-800 duration-200"
            onClick={() =>
              openCanvas('Agregar Categorías', <AddObjetiveCategory />)
            }
          >
            Agregar Categorías
          </button>

          <button
            className="border rounded p-1 text-white bg-blue-500 hover:bg-blue-800 duration-200"
            onClick={() =>
              openCanvas('Agregar Objetivo a Usuario', <Add_User_Objetive />)
            }
          >
            Agregar Objetivo a Usuario
          </button>

          <h2 className="font-semibold mb-4">Objetivos (KPIs)</h2>
          <ObjetivesTable objetives={kpis} />

        
          <ObjetivesByUser ObjetivesByUser={kpisByUser} Employees={employees} />
        </div>
      </>
    </>
  );
};

export default KPIPage;
