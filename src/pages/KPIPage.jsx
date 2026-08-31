import { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FolderTree, Layers, Plus, RefreshCw, Target, Users } from 'lucide-react';

import kpiApi from '../api/kpiApi';
import user_objetiveApi from '../api/user_objetiveApi';
import ObjetiveCategories from '../api/ObjetiveCategories';
import { mensajeDeError } from '../utils/apiError';
import { useConfirm } from '../hooks/useConfirm';
import useOffCanvas from '../hooks/useOffCanvas';

import PageTitle from '../Components/PageTitle';
import Divider from '../Components/Divider';
import PrimaryButton from '../Components/PrimaryButton';
import SecondaryButton from '../Components/SecondaryButton';
import OffCanvas from '../Components/OffCanvas';
import Tabs from '../Components/molecules/Tabs';
import HelpButton from '../Components/molecules/HelpButton';

import ObjetivesTable from '../Components/organisms/ObjetivesTable';
import ObjetivesByUser from '../Components/organisms/ObjetivesByUser';
import CategoryTable from '../Components/organisms/CategoryTable';
import AddObjetive from '../Components/organisms/AddObjetive';
import AddObjetiveCategory from '../Components/organisms/AddObjetiveCategory';
import Add_User_Objetive from '../Components/organisms/Add_User_Objetive';

const TABS = { OBJETIVOS: 'objetivos', POR_USUARIO: 'usuario', CATEGORIAS: 'categorias' };

const StatCard = ({ icon: Icon, label, valor, accent }) => (
  <div className="flex items-center gap-3 rounded-xl border border-stroke-soft bg-surface p-4 shadow-sm">
    <span className={`grid h-11 w-11 place-items-center rounded-lg ${accent}`}>
      <Icon size={20} />
    </span>
    <div className="min-w-0">
      <p className="text-xl font-semibold leading-none text-ink">{valor}</p>
      <p className="mt-1 truncate text-sm text-ink-muted">{label}</p>
    </div>
  </div>
);

const KPIPage = () => {
  const { confirm, dialog } = useConfirm();
  const { open, canvasTitle, canvasContent, openCanvas, closeCanvas } = useOffCanvas();

  const [tab, setTab] = useState(TABS.OBJETIVOS);
  const [objetivos, setObjetivos] = useState([]);
  const [asignados, setAsignados] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);

  const cargar = useCallback(async () => {
    setLoading(true);
    try {
      const [oRes, aRes, cRes] = await Promise.all([
        kpiApi.getAllKPIs(),
        user_objetiveApi.getAllUser_Objetives(),
        ObjetiveCategories.getAllObjetiveCategories(),
      ]);
      setObjetivos(Array.isArray(oRes.data) ? oRes.data : []);
      setAsignados(Array.isArray(aRes.data) ? aRes.data : []);
      setCategorias(Array.isArray(cRes.data) ? cRes.data : []);
    } catch (err) {
      console.error(err);
      toast.error(mensajeDeError(err, 'No se pudieron cargar los indicadores.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const stats = useMemo(
    () => ({
      total: objetivos.length,
      activos: objetivos.filter((o) => o.isActive).length,
      categorias: categorias.length,
      asignaciones: asignados.length,
    }),
    [objetivos, categorias, asignados]
  );

  const trasGuardar = () => {
    closeCanvas();
    cargar();
  };

  const ejecutar = async (fn, exito, err) => {
    try {
      await fn();
      toast.success(exito);
      await cargar();
    } catch (e) {
      console.error(e);
      toast.error(mensajeDeError(e, err));
    }
  };

  /* --- Objetivos --- */
  const nuevoObjetivo = () =>
    openCanvas('Nuevo objetivo', <AddObjetive onSaved={trasGuardar} onCancel={closeCanvas} />);
  const editarObjetivo = (o) =>
    openCanvas('Editar objetivo', <AddObjetive objetive={o} onSaved={trasGuardar} onCancel={closeCanvas} />);
  const asignarObjetivo = (o) =>
    openCanvas('Asignar objetivo', <Add_User_Objetive objetiveId={o?.objetiveId} onSaved={trasGuardar} onCancel={closeCanvas} />);
  const eliminarObjetivo = async (o) => {
    const ok = await confirm({
      title: `¿Eliminar "${o.title}"?`,
      message: 'Se quitará de todos los colaboradores que lo tengan asignado.',
      tone: 'danger',
      confirmLabel: 'Eliminar',
    });
    if (ok === false) return;
    ejecutar(() => kpiApi.deleteKPI(o.objetiveId), 'Objetivo eliminado.', 'No se pudo eliminar.');
  };

  /* --- Asignaciones --- */
  const quitarAsignacion = async (uo) => {
    const ok = await confirm({
      title: '¿Quitar el objetivo de este colaborador?',
      tone: 'danger',
      confirmLabel: 'Quitar',
    });
    if (ok === false) return;
    ejecutar(
      () => user_objetiveApi.deleteUser_Objetive(uo.user_ObjetiveId),
      'Asignación quitada.',
      'No se pudo quitar la asignación.'
    );
  };

  /* --- Categorías --- */
  const nuevaCategoria = () =>
    openCanvas('Nueva categoría', <AddObjetiveCategory onSaved={trasGuardar} onCancel={closeCanvas} />);
  const editarCategoria = (c) =>
    openCanvas('Editar categoría', <AddObjetiveCategory category={c} onSaved={trasGuardar} onCancel={closeCanvas} />);
  const eliminarCategoria = async (c) => {
    const ok = await confirm({
      title: `¿Eliminar la categoría "${c.name}"?`,
      message: 'No se puede si tiene objetivos asociados.',
      tone: 'danger',
      confirmLabel: 'Eliminar',
    });
    if (ok === false) return;
    ejecutar(
      () => ObjetiveCategories.deleteObjetiveCategory(c.objetiveCategoryId),
      'Categoría eliminada.',
      'No se pudo eliminar la categoría.'
    );
  };

  const accionPrimaria = {
    [TABS.OBJETIVOS]: { label: 'Nuevo objetivo', fn: nuevoObjetivo },
    [TABS.POR_USUARIO]: { label: 'Asignar objetivo', fn: () => asignarObjetivo() },
    [TABS.CATEGORIAS]: { label: 'Nueva categoría', fn: nuevaCategoria },
  }[tab];

  return (
    <>
      {dialog}

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

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <PageTitle className="mb-0">Indicadores de Rendimiento</PageTitle>
            <HelpButton area="kpis" />
          </div>
          <p className="text-sm text-ink-muted">
            Objetivos (KPIs) del personal, sus categorías y a quién están asignados.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <SecondaryButton onClick={cargar} disabled={loading}>
            <RefreshCw size={15} className={loading ? 'animate-spin' : undefined} />
            Actualizar
          </SecondaryButton>
          <PrimaryButton onClick={accionPrimaria.fn}>
            <Plus size={16} />
            {accionPrimaria.label}
          </PrimaryButton>
        </div>
      </div>

      <Divider />

      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard icon={Target} label="Objetivos" valor={stats.total} accent="bg-brand-tint text-brand" />
        <StatCard icon={Layers} label="Activos" valor={stats.activos} accent="bg-green-50 text-green-700" />
        <StatCard icon={FolderTree} label="Categorías" valor={stats.categorias} accent="bg-amber-50 text-amber-700" />
        <StatCard icon={Users} label="Asignaciones" valor={stats.asignaciones} accent="bg-violet-50 text-violet-700" />
      </div>

      <Tabs
        idGrupo="kpis"
        value={tab}
        onChange={setTab}
        items={[
          { id: TABS.OBJETIVOS, label: 'Objetivos', icon: Target, count: objetivos.length },
          { id: TABS.POR_USUARIO, label: 'Por colaborador', icon: Users },
          { id: TABS.CATEGORIAS, label: 'Categorías', icon: FolderTree, count: categorias.length },
        ]}
      />

      <div className="mt-5">
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 animate-pulse rounded-lg bg-surface-alt" />
            ))}
          </div>
        ) : tab === TABS.OBJETIVOS ? (
          <ObjetivesTable
            objetives={objetivos}
            onEdit={editarObjetivo}
            onDelete={eliminarObjetivo}
            onAssign={asignarObjetivo}
          />
        ) : tab === TABS.POR_USUARIO ? (
          <ObjetivesByUser ObjetivesByUser={asignados} onDelete={quitarAsignacion} />
        ) : (
          <CategoryTable
            categories={categorias}
            idKey="objetiveCategoryId"
            onEdit={editarCategoria}
            onDelete={eliminarCategoria}
          />
        )}
      </div>
    </>
  );
};

export default KPIPage;
