import { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  BarChart3,
  Brain,
  CheckCircle2,
  ClipboardCheck,
  ClipboardList,
  Clock,
  Eye,
  PlayCircle,
  Plus,
  Power,
  RefreshCw,
  Search,
  Trash2,
} from 'lucide-react';

import psychometricTestsApi from '../api/psychometricTestsApi';
import psychometricAssignmentsApi from '../api/psychometricAssignmentsApi';
import { mensajeDeError } from '../utils/apiError';
import { useConfirm } from '../hooks/useConfirm';
import useOffCanvas from '../hooks/useOffCanvas';
import {
  PSYCH_STATUS,
  estadoDeAplicacion,
} from '../utils/psychometricStatus';

import PageTitle from '../Components/PageTitle';
import Divider from '../Components/Divider';
import PrimaryButton from '../Components/PrimaryButton';
import SecondaryButton from '../Components/SecondaryButton';
import OffCanvas from '../Components/OffCanvas';
import Tabs from '../Components/molecules/Tabs';
import HelpButton from '../Components/molecules/HelpButton';
import PsychometricStatusBadge from '../Components/molecules/PsychometricStatusBadge';
import RowActionButton from '../Components/molecules/RowActionButton';
import { fieldClasses } from '../Components/atoms/fieldClasses';

import PsychometricTestForm from '../Components/organisms/psychometrics/PsychometricTestForm';
import AssignTestForm from '../Components/organisms/psychometrics/AssignTestForm';
import PsychometricResultsPanel from '../Components/organisms/psychometrics/PsychometricResultsPanel';

const nombreDe = (u) =>
  [u?.firstName, u?.lastName].filter(Boolean).join(' ').trim() ||
  u?.userName ||
  u?.email ||
  'Sin nombre';

const formatFecha = (v) => {
  if (!v || String(v).startsWith('0001-01-01')) return '—';
  const f = new Date(v);
  return Number.isNaN(f.getTime())
    ? '—'
    : f.toLocaleDateString('es-CR', { day: '2-digit', month: 'short', year: 'numeric' });
};

const TABS = {
  APLICACIONES: 'aplicaciones',
  PRUEBAS: 'pruebas',
  RESULTADOS: 'resultados',
};

const Indicador = ({ icon: Icon, label, valor, accent }) => (
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

const PsychometricPage = () => {
  const navigate = useNavigate();
  const { confirm, dialog } = useConfirm();
  const { open, canvasTitle, canvasContent, openCanvas, closeCanvas } = useOffCanvas();

  const [tab, setTab] = useState(TABS.APLICACIONES);

  const [assignments, setAssignments] = useState([]);
  const [tests, setTests] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');

  const cargar = useCallback(async () => {
    setLoading(true);
    try {
      const [aRes, tRes, sRes] = await Promise.all([
        psychometricAssignmentsApi.getAll(),
        psychometricTestsApi.getAll(),
        psychometricAssignmentsApi.getStats(),
      ]);
      setAssignments(Array.isArray(aRes.data) ? aRes.data : []);
      setTests(Array.isArray(tRes.data) ? tRes.data : []);
      setStats(sRes.data ?? null);
    } catch (err) {
      console.error(err);
      toast.error(mensajeDeError(err, 'No se pudo cargar el módulo.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const aplicacionesFiltradas = useMemo(() => {
    const q = search.trim().toLowerCase();
    return assignments.filter((a) => {
      if (filtroEstado && estadoDeAplicacion(a) !== filtroEstado) return false;
      if (!q) return true;
      return [a.testName, nombreDe(a.user), a.user?.email]
        .filter(Boolean)
        .some((c) => String(c).toLowerCase().includes(q));
    });
  }, [assignments, search, filtroEstado]);

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

  const toggleActiva = (t) =>
    ejecutar(
      () =>
        t.isActive
          ? psychometricTestsApi.deactivate(t.psychometricTestId)
          : psychometricTestsApi.activate(t.psychometricTestId),
      t.isActive ? 'Prueba desactivada.' : 'Prueba activada.',
      'No se pudo cambiar el estado de la prueba.'
    );

  const eliminarPrueba = async (t) => {
    const ok = await confirm({
      title: `¿Eliminar "${t.name}"?`,
      message: 'Solo se puede si no tiene aplicaciones.',
      tone: 'danger',
      confirmLabel: 'Eliminar',
    });
    if (ok === false) return;
    ejecutar(
      () => psychometricTestsApi.remove(t.psychometricTestId),
      'Prueba eliminada.',
      'No se pudo eliminar la prueba.'
    );
  };

  const eliminarAplicacion = async (a) => {
    const ok = await confirm({
      title: '¿Eliminar esta aplicación?',
      message: `Se quitará la asignación de ${nombreDe(a.user)} y sus respuestas.`,
      tone: 'danger',
      confirmLabel: 'Eliminar',
    });
    if (ok === false) return;
    ejecutar(
      () => psychometricAssignmentsApi.remove(a.psychometricAssignmentId),
      'Aplicación eliminada.',
      'No se pudo eliminar la aplicación.'
    );
  };

  const abrirNuevaPrueba = () =>
    openCanvas(
      'Nueva prueba',
      <PsychometricTestForm
        onSaved={(id) => {
          closeCanvas();
          if (id) navigate(`/manager/psicometria/prueba/${id}`);
        }}
        onCancel={closeCanvas}
      />
    );

  const abrirAsignar = () =>
    openCanvas(
      'Asignar prueba',
      <AssignTestForm
        onAssigned={() => {
          closeCanvas();
          cargar();
        }}
        onCancel={closeCanvas}
      />
    );

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
            <PageTitle className="mb-0">Psicometría</PageTitle>
            <HelpButton area="psicometria" />
          </div>
          <p className="text-sm text-ink-muted">
            Pruebas psicométricas: catálogo, asignación y resultados por colaborador.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <SecondaryButton onClick={cargar} disabled={loading}>
            <RefreshCw size={15} className={loading ? 'animate-spin' : undefined} />
            Actualizar
          </SecondaryButton>
          {tab === TABS.APLICACIONES && (
            <PrimaryButton onClick={abrirAsignar}>
              <Plus size={16} />
              Asignar prueba
            </PrimaryButton>
          )}
          {tab === TABS.PRUEBAS && (
            <PrimaryButton onClick={abrirNuevaPrueba}>
              <Plus size={16} />
              Nueva prueba
            </PrimaryButton>
          )}
        </div>
      </div>

      <Divider />

      {stats && (
        <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Indicador icon={Clock} label="Asignadas" valor={stats.asignadas} accent="bg-amber-50 text-amber-700" />
          <Indicador icon={PlayCircle} label="En progreso" valor={stats.enProgreso} accent="bg-brand-tint text-brand" />
          <Indicador icon={CheckCircle2} label="Completadas" valor={stats.completadas} accent="bg-green-50 text-green-700" />
          <Indicador icon={ClipboardCheck} label="Revisadas" valor={stats.revisadas} accent="bg-violet-50 text-violet-700" />
        </div>
      )}

      <Tabs
        idGrupo="psico"
        value={tab}
        onChange={setTab}
        items={[
          { id: TABS.APLICACIONES, label: 'Aplicaciones', icon: ClipboardList, count: assignments.length },
          { id: TABS.PRUEBAS, label: 'Pruebas', icon: Brain, count: tests.length },
          { id: TABS.RESULTADOS, label: 'Resultados', icon: BarChart3 },
        ]}
      />

      {tab === TABS.APLICACIONES && (
        <div className="mt-5">
          <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="relative sm:col-span-2">
              <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
              <input
                type="search"
                placeholder="Buscar por prueba o colaborador…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={fieldClasses({ className: 'h-10 pl-9' })}
              />
            </div>
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              aria-label="Filtrar por estado"
              className={fieldClasses({ className: 'h-10' })}
            >
              <option value="">Todo estado</option>
              {Object.values(PSYCH_STATUS).map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="overflow-x-auto rounded-xl border border-stroke-soft shadow-sm">
            {loading ? (
              <div className="space-y-2 p-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-12 animate-pulse rounded-lg bg-surface-alt" />
                ))}
              </div>
            ) : aplicacionesFiltradas.length === 0 ? (
              <div className="flex flex-col items-center gap-2 bg-surface py-16 text-ink-muted">
                <ClipboardList size={30} />
                <p className="text-sm font-medium">No hay aplicaciones que mostrar</p>
              </div>
            ) : (
              <table className="min-w-full">
                <thead className="bg-surface-alt text-ink-secondary">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Colaborador</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Prueba</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Asignada</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold">Avance</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold">Resultado</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Estado</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stroke-soft bg-surface">
                  {aplicacionesFiltradas.map((a) => (
                    <tr
                      key={a.psychometricAssignmentId}
                      onClick={() =>
                        navigate(`/manager/psicometria/aplicacion/${a.psychometricAssignmentId}`)
                      }
                      className="cursor-pointer transition hover:bg-canvas"
                    >
                      <td className="px-4 py-3 text-sm font-medium text-ink">{nombreDe(a.user)}</td>
                      <td className="px-4 py-3 text-sm text-ink-secondary">{a.testName}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-ink-secondary">
                        {formatFecha(a.assignedAt)}
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-ink-secondary">
                        {a.answeredCount}/{a.questionCount}
                      </td>
                      <td className="px-4 py-3 text-right text-sm font-semibold text-ink">
                        {a.overallPercentage != null
                          ? `${Math.round(a.overallPercentage)}%`
                          : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <PsychometricStatusBadge value={estadoDeAplicacion(a)} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1">
                          <RowActionButton
                            icon={Eye}
                            label="Ver aplicación"
                            tono="brand"
                            onClick={() =>
                              navigate(`/manager/psicometria/aplicacion/${a.psychometricAssignmentId}`)
                            }
                          />
                          <RowActionButton
                            icon={Trash2}
                            label="Eliminar aplicación"
                            tono="danger"
                            onClick={() => eliminarAplicacion(a)}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {tab === TABS.PRUEBAS && (
        <div className="mt-5 overflow-x-auto rounded-xl border border-stroke-soft shadow-sm">
          {loading ? (
            <div className="space-y-2 p-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-12 animate-pulse rounded-lg bg-surface-alt" />
              ))}
            </div>
          ) : tests.length === 0 ? (
            <div className="flex flex-col items-center gap-2 bg-surface py-16 text-ink-muted">
              <Brain size={30} />
              <p className="text-sm font-medium">Aún no hay pruebas</p>
              <p className="text-xs">Crea una con "Nueva prueba".</p>
            </div>
          ) : (
            <table className="min-w-full">
              <thead className="bg-surface-alt text-ink-secondary">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Prueba</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold">Dimensiones</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold">Ítems</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold">Aplicaciones</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Estado</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stroke-soft bg-surface">
                {tests.map((t) => (
                  <tr
                    key={t.psychometricTestId}
                    onClick={() => navigate(`/manager/psicometria/prueba/${t.psychometricTestId}`)}
                    className="cursor-pointer transition hover:bg-canvas"
                  >
                    <td className="px-4 py-3 text-sm font-medium text-ink">
                      {t.name}
                      {t.description && (
                        <span className="block max-w-md truncate text-xs font-normal text-ink-muted">
                          {t.description}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-ink-secondary">{t.dimensions}</td>
                    <td className="px-4 py-3 text-center text-sm text-ink-secondary">{t.questions}</td>
                    <td className="px-4 py-3 text-center text-sm text-ink-secondary">{t.assignments}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                          t.isActive
                            ? 'border-green-200 bg-green-50 text-green-700'
                            : 'border-stroke bg-surface-alt text-ink-secondary'
                        }`}
                      >
                        {t.isActive ? 'Activa' : 'Borrador'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <RowActionButton
                          icon={Power}
                          label={t.isActive ? 'Desactivar' : 'Activar'}
                          tono={t.isActive ? 'default' : 'brand'}
                          onClick={() => toggleActiva(t)}
                        />
                        <RowActionButton
                          icon={Trash2}
                          label="Eliminar prueba"
                          tono="danger"
                          onClick={() => eliminarPrueba(t)}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {tab === TABS.RESULTADOS && (
        <div className="mt-5">
          <PsychometricResultsPanel />
        </div>
      )}
    </>
  );
};

export default PsychometricPage;
