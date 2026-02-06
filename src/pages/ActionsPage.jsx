import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';

import SectionTitle from '../Components/SectionTitle';
import Divider from '../Components/Divider';
import PrimaryButton from '../Components/PrimaryButton';
import OffCanvas from '../Components/OffCanvas';
import ActionAdd from '../Components/organisms/ActionAdd';

import { useAppContext } from '../context/AppContext';
import actionApi from '../api/actionApi';
import CardAction from '../Components/CardActions';
import ViewAction from '../Components/organisms/ViewAction';
import ActionTable from '../Components/organisms/ActionTable';

const ActionsPage = () => {
  const { user } = useAppContext();

  const [approvedActions, setApprovedActions] = useState([]);
  const [pendingActions, setPendingActions] = useState([]);
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [canvasTitle, setCanvasTitle] = useState('');
  const [canvasContent, setCanvasContent] = useState(null);

  const openCanvas = (title, content) => {
    setCanvasTitle(title);
    setCanvasContent(content);
    setOpen(true);
  };

  useEffect(() => {
    const loadActions = async () => {
      try {
        const approvedRes = await actionApi.searchActions({ Approved: true });
        setApprovedActions(approvedRes.data ?? []);
      } catch (error) {
        console.error(error);
        setApprovedActions([]);
      }

      try {
        const pendingRes = await actionApi.searchActions({ Approved: false });
        setPendingActions(pendingRes.data ?? []);
      } catch (error) {
        console.error(error);
        setPendingActions([]);
      }
    };

    loadActions();
  }, []);

  const filterActions = (actions) => {
    if (!search) return actions;

    const term = search.toLowerCase();

    return actions.filter(
      (a) =>
        `${a.user?.firstName} ${a.user?.lastName}`
          .toLowerCase()
          .includes(term) ||
        a.description?.toLowerCase().includes(term) ||
        a.actionType?.name?.toLowerCase().includes(term)
    );
  };

  return (
    <>
      {/* OffCanvas */}
      <AnimatePresence>
        {open && (
          <OffCanvas
            isOpen={open}
            onClose={() => setOpen(false)}
            title={canvasTitle}
          >
            {canvasContent}
          </OffCanvas>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between">
        <SectionTitle>Acciones de Personal</SectionTitle>

        <PrimaryButton
          onClick={() =>
            openCanvas('Agregar Acción', <ActionAdd author={user} />)
          }
        >
          Agregar Acción
        </PrimaryButton>
      </div>

      <Divider />

      {/* Search */}
      <input
        type="text"
        placeholder="Buscar por empleado, tipo o descripción…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="
          w-full md:w-1/3 px-4 py-2 mb-6
          border border-slate-300 rounded-lg
          focus:ring-2 focus:ring-blue-500 focus:outline-none
        "
      />

      {/* Pendientes */}
      <SectionTitle>Sin aprobar</SectionTitle>
      <motion.div layout className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filterActions(pendingActions).map((a) => (
          <CardAction
            key={a.actionId}
            action={a}
            status="pending"
            OnHandleClick={() => {
              openCanvas('Información de Acciòn', <ViewAction action={a} />);
            }}
          />
        ))}
      </motion.div>

      {/* Aprobadas */}
      <SectionTitle className="mt-8">Aprobadas</SectionTitle>
      <motion.div layout className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filterActions(approvedActions).map((a) => (
          <CardAction
            key={a.actionId}
            action={a}
            status="approved"
            OnHandleClick={() => {
              openCanvas('Información de Acciòn', <ViewAction action={a} />);
            }}
          />
        ))}
      </motion.div>
    </>
  );
};

export default ActionsPage;
