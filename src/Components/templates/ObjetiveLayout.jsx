import { useEffect, useState } from 'react';
import SectionTitle from '../SectionTitle';
import Divider from '../Divider';
import ResultAdd from '../organisms/ResultAdd';
import ResultsTable from '../organisms/ResultsTable';
import PrimaryButton from '../PrimaryButton';
import resultsApi from '../../api/resultsApi';

const ObjetiveLayout = ({ User_Objetive }) => {
  const [showAddResult, setShowAddResult] = useState(false);
  const [results, setResults] = useState([]);
  const toggleAddResult = () => {
    setShowAddResult((prev) => !prev);
  };

  const LoadResults = async () => {
    try {
      const res = await resultsApi.searchResults({
        user_ObjetiveId: User_Objetive.user_ObjetiveId,
      });
      setResults(res.data);
    } catch (error) {
      console.error('Error cargando resultados', error);
    }
  };

  useEffect(() => {
    if (User_Objetive?.user_ObjetiveId) {
      LoadResults();
    }
  }, []);

  return (
    <>
      {/* Header + Button */}
      <div className="flex items-center justify-between">
        <SectionTitle>Resultados</SectionTitle>

        <PrimaryButton onClick={toggleAddResult}>
          {showAddResult ? 'Cancelar' : 'Agregar resultado'}
        </PrimaryButton>
      </div>

      <Divider />

      {/* Formulario (toggle) */}
      {showAddResult && (
        <div className="mb-6">
          <ResultAdd
            user_ObjetiveId={User_Objetive.user_ObjetiveId}
            onSuccess={() => setShowAddResult(false)}
          />
        </div>
      )}

      {/* Tabla */}
      <ResultsTable results={results} />
    </>
  );
};

export default ObjetiveLayout;
