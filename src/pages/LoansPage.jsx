import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Wallet, CheckCircle2, Clock } from 'lucide-react';

import loansApi from '../api/loansApi';

import LoansAdd from '../Components/organisms/LoansAdd';
import LoansTable from '../Components/organisms/LoansTable';
import OffCanvas from '../Components/OffCanvas';

import PageTitle from '../Components/PageTitle';
import Divider from '../Components/Divider';
import PrimaryButton from '../Components/PrimaryButton';

const LoansPage = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [isCanvasOpen, setIsCanvasOpen] = useState(false);
  const [canvasTitle, setCanvasTitle] = useState('');
  const [canvasContent, setCanvasContent] = useState(null);

  const openCanvas = (title, content) => {
    setCanvasTitle(title);
    setCanvasContent(content);
    setIsCanvasOpen(true);
  };

  const closeCanvas = () => {
    setIsCanvasOpen(false);
    setCanvasContent(null);
  };

  const fetchLoans = async () => {
    try {
      setLoading(true);
      const response = await loansApi.getAllsLoans();
      setLoans(response.data ?? []);
    } catch (error) {
      console.error('Error loading loans', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  /* filtro */
  const filteredLoans = useMemo(() => {
    if (!search.trim()) return loans;

    const q = search.toLowerCase();

    return loans.filter((loan) =>
      [loan.user?.firstName, loan.user?.lastName, loan.reason, loan.createdBy]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(q))
    );
  }, [loans, search]);

  /* métricas */
  const stats = useMemo(() => {
    const total = loans.length;

    const approved = loans.filter((l) => l.status === 'approved').length;

    const pending = loans.filter((l) => l.status === 'pending').length;

    return { total, approved, pending };
  }, [loans]);

  return (
    <>
      {/* OffCanvas */}
      <AnimatePresence>
        {isCanvasOpen && (
          <OffCanvas
            isOpen={isCanvasOpen}
            onClose={closeCanvas}
            title={canvasTitle}
          >
            <motion.div
              initial={{ x: 60, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 60, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              {canvasContent}
            </motion.div>
          </OffCanvas>
        )}
      </AnimatePresence>

      {/* HEADER */}
      <div className="flex items-center justify-between gap-4">
        <PageTitle>Préstamos</PageTitle>

        <PrimaryButton
          onClick={() =>
            openCanvas('Agregar Préstamo', <LoansAdd onCreated={fetchLoans} />)
          }
        >
          Agregar Préstamo
        </PrimaryButton>
      </div>

      <Divider />

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center gap-3 shadow-sm">
          <Wallet className="text-blue-500" />
          <div>
            <p className="text-sm text-gray-500">Total préstamos</p>
            <p className="text-xl font-semibold">{stats.total}</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center gap-3 shadow-sm">
          <CheckCircle2 className="text-green-500" />
          <div>
            <p className="text-sm text-gray-500">Aprobados</p>
            <p className="text-xl font-semibold">{stats.approved}</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center gap-3 shadow-sm">
          <Clock className="text-orange-500" />
          <div>
            <p className="text-sm text-gray-500">Pendientes</p>
            <p className="text-xl font-semibold">{stats.pending}</p>
          </div>
        </div>
      </div>

      {/* SEARCH */}
      <div className="mt-6 flex justify-between items-center gap-4">
        <input
          type="text"
          placeholder="Buscar por empleado, motivo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="
            w-full md:max-w-md
            border border-gray-300 rounded-lg
            px-4 py-2 text-sm
            focus:outline-none focus:ring-2 focus:ring-blue-400
          "
        />
      </div>

      {/* TABLE */}
      <div className="bg-white border border-gray-200 rounded-xl mt-6">
        {loading ? (
          <div className="p-8 text-center text-gray-500">
            Cargando préstamos...
          </div>
        ) : (
          <LoansTable loans={filteredLoans} />
        )}
      </div>
    </>
  );
};

export default LoansPage;
