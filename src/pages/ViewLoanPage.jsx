import PageTitle from '../components/PageTitle';
import { useParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import loansApi from '../api/loansApi';
import { useEffect, useState } from 'react';
import paymentApi from '../api/paymentsApi';
import Divider from '../Components/Divider';
import SectionTitle from '../Components/SectionTitle';
import PrimaryButton from '../Components/PrimaryButton';
import OffCanvas from '../components/OffCanvas';
import PaymentAdd from '../Components/organisms/PaymentAdd';

import { motion, AnimatePresence } from 'framer-motion';
const ViewLoanPage = () => {
  const { id } = useParams();
  const { user } = useAppContext();
  const [loan, setLoan] = useState();

  const [open, setOpen] = useState(false);
  const [canvasTitle, setCanvasTitle] = useState('');
  const [canvasContent, setCanvasContent] = useState(null);

  const openCanvas = (title, content) => {
    setCanvasTitle(title);
    setCanvasContent(content);
    setOpen(true);
  };

  useEffect(() => {
    async function getData() {
      const response = await loansApi.getLoansById(id);
      setLoan(response.data);
    }

    getData();
  }, [id]);

  return (
    <>
      <div className="max-w-6xl mx-auto p-4 space-y-6">
        {/* Título */}
        <PageTitle>Información del Préstamo</PageTitle>

        {/* ================= INFO ================= */}
        <div className="bg-white rounded-xl shadow p-6">
          <SectionTitle>Detalle del préstamo</SectionTitle>
          <Divider className="my-3" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">ID Préstamo</p>
              <p className="font-medium">{loan?.loanId}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Título</p>
              <p className="font-medium">{loan?.title}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Monto</p>
              <p className="font-medium">₡ {loan?.amount?.toLocaleString()}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Meses de pago</p>
              <p className="font-medium">{loan?.paymentMonths}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Estado</p>
              <span className="inline-block px-2 py-1 text-xs rounded bg-yellow-100 text-yellow-800">
                {loan?.state}
              </span>
            </div>

            <div>
              <p className="text-sm text-gray-500">Fecha de solicitud</p>
              <p className="font-medium">{loan?.requestAt?.split('T')[0]}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Aprobado por</p>
              <p className="font-medium">{loan?.approvedBy || '—'}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Fecha de aprobación</p>
              <p className="font-medium">
                {loan?.approvedAt?.split('T')[0] || '—'}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Creado el</p>
              <p className="font-medium">{loan?.createdAt?.split('T')[0]}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Última actualización</p>
              <p className="font-medium">
                {loan?.lastUpdatedAt?.split('T')[0]}
              </p>
            </div>
          </div>

          {/* Descripción */}
          <div className="mt-4">
            <p className="text-sm text-gray-500 mb-1">Descripción</p>
            <p className="text-gray-700">{loan?.description || '—'}</p>
          </div>
        </div>

        {/* ================= ACCIONES ================= */}
        <div className="bg-white rounded-xl shadow p-6">
          <SectionTitle>Acciones</SectionTitle>
          <Divider className="my-3" />

          <div className="flex flex-wrap gap-2">
            <PrimaryButton>Editar</PrimaryButton>
            <button className="border rounded border-red-500 text-red-500 px-2  ">
              Eliminar
            </button>
            <PrimaryButton>Aprobar Préstamo</PrimaryButton>
          </div>
        </div>

        {/* ================= PAGOS ================= */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex justify-between items-center">
            <SectionTitle>Pagos</SectionTitle>
            <PrimaryButton
              onClick={() => openCanvas('Agregar Pago', <PaymentAdd loanId={id}  />)}
            >
              Agregar Pago
            </PrimaryButton>
          </div>

          <Divider className="my-3" />

          {loan?.payments?.length ? (
            <table className="min-w-full border text-sm">
              {/* tabla de pagos */}
            </table>
          ) : (
            <p className="text-sm text-gray-500">No hay pagos registrados.</p>
          )}
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <OffCanvas
            isOpen={open}
            onClose={() => setOpen(false)}
            title={canvasTitle}
          >
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
    </>
  );
};

export default ViewLoanPage;
