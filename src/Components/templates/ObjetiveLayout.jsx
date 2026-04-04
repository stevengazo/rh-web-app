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
    <div className="space-y-6 text-gray-200">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-white">
            Resultados
          </h2>

          <span className="text-xs px-2 py-1 rounded-md bg-gray-800 text-gray-300 border border-gray-700">
            {results.length} registros
          </span>
        </div>

        <PrimaryButton onClick={toggleAddResult}>
          {showAddResult ? 'Cancelar' : 'Agregar resultado'}
        </PrimaryButton>
      </div>

      {/* Divider más suave para dark */}
      <div className="border-t border-gray-700/60" />

      {/* FORM CARD */}
      {showAddResult && (
        <div className="bg-gray-900 border border-gray-700 rounded-xl shadow-sm p-5">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-300">
              Nuevo resultado
            </h3>
            <p className="text-xs text-gray-500">
              Registra una nueva evaluación
            </p>
          </div>

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
      <div className="bg-gray-900 border border-gray-700 rounded-xl shadow-sm overflow-hidden">
        {results.length === 0 ? (
          <div className="text-center py-14 text-sm text-gray-400">
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