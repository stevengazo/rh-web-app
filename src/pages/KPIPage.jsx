import PageTitle from "../components/PageTitle";
import SectionTitle from "../components/SectionTitle";
import ObjetivesTable from "../Components/organisms/ObjetivesTable";

import kpiApi from "../api/kpiApi";
import { useEffect, useState } from "react";

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
    console.log(kpis);
  }, []);

  return (
    <div>
      <SectionTitle>Indicadores de Rendimiento</SectionTitle>
      <p>
        Gestión y administración de la gestión de los indicadores de Rendimiento
        de los empleados
      </p>

      <ObjetivesTable objetives={kpis} />
    </div>
  );
};

export default KPIPage;
