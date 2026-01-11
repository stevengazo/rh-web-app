import PageTitle from '../components/PageTitle';
import SectionTitle from '../components/SectionTitle';
import ObjetivesTable from '../Components/organisms/ObjetivesTable';
import AddObjetive from '../Components/organisms/AddObjetive';

import kpiApi from '../api/kpiApi';
import { useEffect, useState } from 'react';
import AddObjetiveCategory from '../Components/organisms/AddObjetiveCategory';

const KPIPage = () => {
  const [kpis, setKpis] = useState([]);

  useEffect(() => {
    async function GetDataAsync() {
      await kpiApi
        .getAllKPIs()
        .then((e) => setKpis(e.data))
        .catch((e) => console.error(e));
    }
    GetDataAsync();
  }, []);

  return (
    <div>
      <SectionTitle>Indicadores de Rendimiento</SectionTitle>
      <p>
        Gestión y administración de la gestión de los indicadores de Rendimiento
        de los empleados
      </p>

      <div className=" flex flex-col gap-2 w-full border border-red-400 rounded p-2">
        <AddObjetiveCategory />
        <hr />
        <AddObjetive />
        <hr />
        <ObjetivesTable objetives={kpis} />
      </div>
    </div>
  );
};

export default KPIPage;
