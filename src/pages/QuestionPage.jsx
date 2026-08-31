import { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FolderTree, Layers, ListChecks, Plus, RefreshCw, Users } from 'lucide-react';

import questionApi from '../api/questionsApi';
import user_questionApi from '../api/user_questionApi';
import questionCategoryApi from '../api/QuestionCategories';
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

import QuestionsTable from '../Components/organisms/QuestionsTable';
import QuestionsByUser from '../Components/organisms/QuestionsByUser';
import CategoryTable from '../Components/organisms/CategoryTable';
import AddQuestion from '../Components/organisms/AddQuestion';
import AddQuestionCategory from '../Components/organisms/AddQuestionCategory';
import Add_User_Question from '../Components/organisms/Add_User_Question';

const TABS = { PREGUNTAS: 'preguntas', POR_USUARIO: 'usuario', CATEGORIAS: 'categorias' };

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

const QuestionPage = () => {
  const { confirm, dialog } = useConfirm();
  const { open, canvasTitle, canvasContent, openCanvas, closeCanvas } = useOffCanvas();

  const [tab, setTab] = useState(TABS.PREGUNTAS);
  const [preguntas, setPreguntas] = useState([]);
  const [asignadas, setAsignadas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);

  const cargar = useCallback(async () => {
    setLoading(true);
    try {
      const [qRes, aRes, cRes] = await Promise.all([
        questionApi.getAllQuestions(),
        user_questionApi.getAllUser_Questions(),
        questionCategoryApi.getAllQuestionCategories(),
      ]);
      setPreguntas(Array.isArray(qRes.data) ? qRes.data : []);
      setAsignadas(Array.isArray(aRes.data) ? aRes.data : []);
      setCategorias(Array.isArray(cRes.data) ? cRes.data : []);
    } catch (err) {
      console.error(err);
      toast.error(mensajeDeError(err, 'No se pudieron cargar las preguntas.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const stats = useMemo(
    () => ({
      total: preguntas.length,
      activas: preguntas.filter((q) => q.isActive).length,
      categorias: categorias.length,
      asignaciones: asignadas.length,
    }),
    [preguntas, categorias, asignadas]
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

  const nuevaPregunta = () =>
    openCanvas('Nueva pregunta', <AddQuestion onSaved={trasGuardar} onCancel={closeCanvas} />);
  const editarPregunta = (q) =>
    openCanvas('Editar pregunta', <AddQuestion question={q} onSaved={trasGuardar} onCancel={closeCanvas} />);
  const asignarPregunta = (q) =>
    openCanvas('Asignar pregunta', <Add_User_Question questionId={q?.questionId} onSaved={trasGuardar} onCancel={closeCanvas} />);
  const eliminarPregunta = async (q) => {
    const ok = await confirm({
      title: '¿Eliminar esta pregunta?',
      message: 'Se quitará de todos los colaboradores que la tengan asignada.',
      tone: 'danger',
      confirmLabel: 'Eliminar',
    });
    if (ok === false) return;
    ejecutar(() => questionApi.deleteQuestion(q.questionId), 'Pregunta eliminada.', 'No se pudo eliminar.');
  };

  const quitarAsignacion = async (uq) => {
    const ok = await confirm({
      title: '¿Quitar la pregunta de este colaborador?',
      tone: 'danger',
      confirmLabel: 'Quitar',
    });
    if (ok === false) return;
    ejecutar(
      () => user_questionApi.deleteUser_Question(uq.user_QuestionId),
      'Asignación quitada.',
      'No se pudo quitar la asignación.'
    );
  };

  const nuevaCategoria = () =>
    openCanvas('Nueva categoría', <AddQuestionCategory onSaved={trasGuardar} onCancel={closeCanvas} />);
  const editarCategoria = (c) =>
    openCanvas('Editar categoría', <AddQuestionCategory category={c} onSaved={trasGuardar} onCancel={closeCanvas} />);
  const eliminarCategoria = async (c) => {
    const ok = await confirm({
      title: `¿Eliminar la categoría "${c.name}"?`,
      message: 'No se puede si tiene preguntas asociadas.',
      tone: 'danger',
      confirmLabel: 'Eliminar',
    });
    if (ok === false) return;
    ejecutar(
      () => questionCategoryApi.deleteQuestionCategory(c.questionCategoryId),
      'Categoría eliminada.',
      'No se pudo eliminar la categoría.'
    );
  };

  const accionPrimaria = {
    [TABS.PREGUNTAS]: { label: 'Nueva pregunta', fn: nuevaPregunta },
    [TABS.POR_USUARIO]: { label: 'Asignar pregunta', fn: () => asignarPregunta() },
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
            <PageTitle className="mb-0">Preguntas</PageTitle>
            <HelpButton area="preguntas" />
          </div>
          <p className="text-sm text-ink-muted">
            Banco de preguntas para la evaluación de desempeño, por categoría y colaborador.
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
        <StatCard icon={ListChecks} label="Preguntas" valor={stats.total} accent="bg-brand-tint text-brand" />
        <StatCard icon={Layers} label="Activas" valor={stats.activas} accent="bg-green-50 text-green-700" />
        <StatCard icon={FolderTree} label="Categorías" valor={stats.categorias} accent="bg-amber-50 text-amber-700" />
        <StatCard icon={Users} label="Asignaciones" valor={stats.asignaciones} accent="bg-violet-50 text-violet-700" />
      </div>

      <Tabs
        idGrupo="preguntas"
        value={tab}
        onChange={setTab}
        items={[
          { id: TABS.PREGUNTAS, label: 'Preguntas', icon: ListChecks, count: preguntas.length },
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
        ) : tab === TABS.PREGUNTAS ? (
          <QuestionsTable
            Questions={preguntas}
            onEdit={editarPregunta}
            onDelete={eliminarPregunta}
            onAssign={asignarPregunta}
          />
        ) : tab === TABS.POR_USUARIO ? (
          <QuestionsByUser QuestionsByUser={asignadas} onDelete={quitarAsignacion} />
        ) : (
          <CategoryTable
            categories={categorias}
            idKey="questionCategoryId"
            onEdit={editarCategoria}
            onDelete={eliminarCategoria}
          />
        )}
      </div>
    </>
  );
};

export default QuestionPage;
