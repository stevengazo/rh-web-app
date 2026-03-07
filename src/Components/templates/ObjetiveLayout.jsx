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
  }, [User_Objetive]);

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

        <div className="flex items-center gap-3">
          <h2>Resultados</h2>
          <span className="text-xs px-2 py-1 rounded-md bg-gray-100 text-gray-600">
            {results.length} registros
          </span>
        </div>

        <PrimaryButton onClick={toggleAddResult}>
          {showAddResult ? 'Cancelar' : 'Agregar resultado'}
        </PrimaryButton>

      </div>

      <Divider />

      {/* FORM CARD */}
      {showAddResult && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm transition-all">

          <h3 className="text-sm font-semibold text-gray-700 mb-4">
            Nuevo Resultado
          </h3>

          <ResultAdd
            user_ObjetiveId={User_Objetive.user_ObjetiveId}
            onSuccess={() => {
              setShowAddResult(false);
              LoadResults();
            }}
          />

        </div>
      )}

      {/* TABLE CARD */}
      <div className=" border border-gray-200 rounded-xl shadow-sm overflow-hidden">

        {results.length === 0 ? (
          <div className="text-center py-12 text-sm text-gray-500">
            No hay resultados registrados para este objetivo.
          </div>
        ) : (
          <ResultsTable results={results} />
        )}

      </div>

    </div>
  );
};

export default ObjetiveLayout;