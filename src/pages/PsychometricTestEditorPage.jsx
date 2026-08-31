import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  AlertTriangle,
  ArrowLeft,
  Layers,
  ListChecks,
  Lock,
  Pencil,
  Plus,
  Power,
  RefreshCw,
  Trash2,
} from 'lucide-react';

import psychometricTestsApi from '../api/psychometricTestsApi';
import { mensajeDeError } from '../utils/apiError';
import { useConfirm } from '../hooks/useConfirm';
import useOffCanvas from '../hooks/useOffCanvas';
import { QUESTION_KIND } from '../utils/psychometricStatus';

import PageTitle from '../Components/PageTitle';
import SectionTitle from '../Components/SectionTitle';
import Divider from '../Components/Divider';
import PrimaryButton from '../Components/PrimaryButton';
import SecondaryButton from '../Components/SecondaryButton';
import OffCanvas from '../Components/OffCanvas';
import RowActionButton from '../Components/molecules/RowActionButton';

import PsychometricTestForm from '../Components/organisms/psychometrics/PsychometricTestForm';
import DimensionForm from '../Components/organisms/psychometrics/DimensionForm';
import QuestionForm from '../Components/organisms/psychometrics/QuestionForm';

const PsychometricTestEditorPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { confirm, dialog } = useConfirm();
  const { open, canvasTitle, canvasContent, openCanvas, closeCanvas } = useOffCanvas();

  const [test, setTest] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const cargar = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const res = await psychometricTestsApi.getById(id);
      setTest(res.data ?? null);
    } catch (e) {
      console.error(e);
      setError(
        e?.response?.status === 404
          ? 'La prueba no existe.'
          : 'No se pudo cargar la prueba.'
      );
    } finally {
      setCargando(false);
    }
  }, [id]);

  useEffect(() => {
    cargar();
  }, [cargar]);

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

  if (cargando) {
    return (
      <div className="mx-auto max-w-4xl space-y-4 p-4">
        <div className="h-8 w-64 animate-pulse rounded bg-stroke-soft" />
        <div className="h-40 animate-pulse rounded-xl bg-surface-alt" />
        <div className="h-64 animate-pulse rounded-xl bg-surface-alt" />
      </div>
    );
  }

  if (error || !test) {
    return (
      <div className="mx-auto max-w-4xl p-4">
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-stroke bg-surface-alt py-16 text-ink-muted">
          <AlertTriangle size={30} className="text-amber-600" />
          <p className="text-sm font-medium">{error ?? 'Prueba no encontrada'}</p>
          <SecondaryButton onClick={() => navigate('/manager/psicometria')}>
            <ArrowLeft size={15} />
            Volver
          </SecondaryButton>
        </div>
      </div>
    );
  }

  const dims = test.dimensions ?? [];
  const questions = test.questions ?? [];
  const locked = test.locked;
  const dimNombre = new Map(dims.map((d) => [d.psychometricDimensionId, d.name]));

  const editarMeta = () =>
    openCanvas(
      'Editar prueba',
      <PsychometricTestForm
        test={test}
        onSaved={() => {
          closeCanvas();
          cargar();
        }}
        onCancel={closeCanvas}
      />
    );

  const nuevaDimension = () =>
    openCanvas(
      'Nueva dimensión',
      <DimensionForm
        testId={test.psychometricTestId}
        nextOrder={dims.length}
        onSaved={() => {
          closeCanvas();
          cargar();
        }}
        onCancel={closeCanvas}
      />
    );

  const editarDimension = (d) =>
    openCanvas(
      'Editar dimensión',
      <DimensionForm
        testId={test.psychometricTestId}
        dimension={d}
        onSaved={() => {
          closeCanvas();
          cargar();
        }}
        onCancel={closeCanvas}
      />
    );

  const nuevoItem = () =>
    openCanvas(
      'Nuevo ítem',
      <QuestionForm
        testId={test.psychometricTestId}
        dimensions={dims}
        nextOrder={questions.length}
        locked={locked}
        onSaved={() => {
          closeCanvas();
          cargar();
        }}
        onCancel={closeCanvas}
      />
    );

  const editarItem = (q) =>
    openCanvas(
      'Editar ítem',
      <QuestionForm
        testId={test.psychometricTestId}
        dimensions={dims}
        question={q}
        locked={locked}
        onSaved={() => {
          closeCanvas();
          cargar();
        }}
        onCancel={closeCanvas}
      />
    );

  const borrarDimension = async (d) => {
    const ok = await confirm({
      title: `¿Quitar la dimensión "${d.name}"?`,
      message: 'Sus ítems quedarán sin dimensión (no puntúan).',
      tone: 'danger',
      confirmLabel: 'Quitar',
    });
    if (ok === false) return;
    ejecutar(
      () => psychometricTestsApi.removeDimension(test.psychometricTestId, d.psychometricDimensionId),
      'Dimensión quitada.',
      'No se pudo quitar la dimensión.'
    );
  };

  const borrarItem = async (q) => {
    const ok = await confirm({
      title: '¿Quitar este ítem?',
      tone: 'danger',
      confirmLabel: 'Quitar',
    });
    if (ok === false) return;
    ejecutar(
      () => psychometricTestsApi.removeQuestion(test.psychometricTestId, q.psychometricQuestionId),
      'Ítem quitado.',
      'No se pudo quitar el ítem.'
    );
  };

  const toggleActiva = () =>
    ejecutar(
      () =>
        test.isActive
          ? psychometricTestsApi.deactivate(test.psychometricTestId)
          : psychometricTestsApi.activate(test.psychometricTestId),
      test.isActive ? 'Prueba desactivada.' : 'Prueba activada.',
      'No se pudo cambiar el estado.'
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

      <div className="mx-auto max-w-4xl space-y-6 p-4">
        <div>
          <button
            type="button"
            onClick={() => navigate('/manager/psicometria')}
            className="mb-2 inline-flex items-center gap-1.5 text-sm font-semibold text-ink-muted transition-colors hover:text-brand"
          >
            <ArrowLeft size={15} />
            Volver a psicometría
          </button>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <PageTitle className="mb-0">{test.name}</PageTitle>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                  test.isActive
                    ? 'border-green-200 bg-green-50 text-green-700'
                    : 'border-stroke bg-surface-alt text-ink-secondary'
                }`}
              >
                {test.isActive ? 'Activa' : 'Borrador'}
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              <SecondaryButton onClick={cargar}>
                <RefreshCw size={15} />
                Actualizar
              </SecondaryButton>
              <SecondaryButton onClick={editarMeta}>
                <Pencil size={15} />
                Editar datos
              </SecondaryButton>
              <PrimaryButton onClick={toggleActiva}>
                <Power size={15} />
                {test.isActive ? 'Desactivar' : 'Activar'}
              </PrimaryButton>
            </div>
          </div>

          {test.description && (
            <p className="mt-2 text-sm text-ink-secondary">{test.description}</p>
          )}
        </div>

        {locked && (
          <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            <Lock size={16} className="mt-0.5 shrink-0" />
            La prueba ya tiene respuestas guardadas. Solo se puede corregir el texto
            y el orden de los ítems; no cambiar dimensiones, tipos ni opciones.
          </div>
        )}

        {/* Dimensiones */}
        <section className="rounded-xl border border-stroke-soft bg-surface p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <SectionTitle className="mb-0">
              <span className="inline-flex items-center gap-2">
                <Layers size={18} />
                Dimensiones ({dims.length})
              </span>
            </SectionTitle>
            <PrimaryButton onClick={nuevaDimension}>
              <Plus size={15} />
              Agregar
            </PrimaryButton>
          </div>
          <Divider className="my-3" />

          {dims.length === 0 ? (
            <p className="text-sm text-ink-muted">
              Agrega las dimensiones (rasgos/escalas) hacia las que puntúan los ítems.
            </p>
          ) : (
            <ul className="divide-y divide-stroke-soft">
              {dims.map((d) => (
                <li key={d.psychometricDimensionId} className="flex items-start justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="font-medium text-ink">{d.name}</p>
                    {d.description && (
                      <p className="text-xs text-ink-muted">{d.description}</p>
                    )}
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <RowActionButton icon={Pencil} label="Editar" tono="brand" onClick={() => editarDimension(d)} />
                    <RowActionButton icon={Trash2} label="Quitar" tono="danger" onClick={() => borrarDimension(d)} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Ítems */}
        <section className="rounded-xl border border-stroke-soft bg-surface p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <SectionTitle className="mb-0">
              <span className="inline-flex items-center gap-2">
                <ListChecks size={18} />
                Ítems ({questions.length})
              </span>
            </SectionTitle>
            <PrimaryButton onClick={nuevoItem}>
              <Plus size={15} />
              Agregar
            </PrimaryButton>
          </div>
          <Divider className="my-3" />

          {questions.length === 0 ? (
            <p className="text-sm text-ink-muted">Agrega al menos un ítem para poder activar la prueba.</p>
          ) : (
            <ul className="divide-y divide-stroke-soft">
              {questions.map((q, i) => (
                <li key={q.psychometricQuestionId} className="flex items-start justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="text-sm text-ink">
                      <span className="mr-2 text-ink-muted">{i + 1}.</span>
                      {q.text}
                    </p>
                    <p className="mt-0.5 flex flex-wrap gap-2 text-xs text-ink-muted">
                      <span className="rounded bg-surface-alt px-1.5 py-0.5">
                        {q.questionType === QUESTION_KIND.MULTIPLE_CHOICE
                          ? `Opción múltiple · ${q.options?.length ?? 0} opc.`
                          : 'Likert 1–5'}
                      </span>
                      <span className="rounded bg-surface-alt px-1.5 py-0.5">
                        {dimNombre.get(q.psychometricDimensionId) ?? 'Sin dimensión'}
                      </span>
                      {q.reverseScored && (
                        <span className="rounded bg-amber-50 px-1.5 py-0.5 text-amber-700">invertido</span>
                      )}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <RowActionButton icon={Pencil} label="Editar" tono="brand" onClick={() => editarItem(q)} />
                    {!locked && (
                      <RowActionButton icon={Trash2} label="Quitar" tono="danger" onClick={() => borrarItem(q)} />
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
};

export default PsychometricTestEditorPage;
