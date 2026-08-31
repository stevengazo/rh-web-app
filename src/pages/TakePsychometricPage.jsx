import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  AlertTriangle,
  ArrowLeft,
  Check,
  CheckCircle2,
  Cloud,
  Loader2,
} from 'lucide-react';

import psychometricAssignmentsApi from '../api/psychometricAssignmentsApi';
import { useAppContext } from '../context/AppContext';
import { mensajeDeError } from '../utils/apiError';
import { useConfirm } from '../hooks/useConfirm';
import { QUESTION_KIND, puedeResponder } from '../utils/psychometricStatus';

import PageTitle from '../Components/PageTitle';
import PrimaryButton from '../Components/PrimaryButton';
import SecondaryButton from '../Components/SecondaryButton';
import LikertScale from '../Components/molecules/LikertScale';

const TakePsychometricPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAppContext();
  const quien = user?.userName ?? user?.email ?? 'Sistema';
  const { confirm, dialog } = useConfirm();

  const [data, setData] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // { [questionId]: { value?, optionId? } }
  const [respuestas, setRespuestas] = useState({});
  const [guardando, setGuardando] = useState(false);
  const [guardadoOk, setGuardadoOk] = useState(false);
  const [enviando, setEnviando] = useState(false);

  const timer = useRef(null);
  const pendientesGuardar = useRef(false);

  const cargar = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const res = await psychometricAssignmentsApi.getById(id);
      const a = res.data;
      setData(a);

      const map = {};
      for (const r of a.responses ?? []) {
        map[r.psychometricQuestionId] = {
          value: r.value ?? undefined,
          optionId: r.psychometricOptionId ?? undefined,
        };
      }
      setRespuestas(map);
    } catch (e) {
      console.error(e);
      setError(
        e?.response?.status === 404
          ? 'La evaluación no existe.'
          : 'No se pudo cargar la evaluación.'
      );
    } finally {
      setCargando(false);
    }
  }, [id]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const preguntas = useMemo(
    () =>
      [...(data?.test?.questions ?? [])].sort(
        (x, y) => (x.displayOrder ?? 0) - (y.displayOrder ?? 0)
      ),
    [data]
  );

  const dimNombre = useMemo(
    () =>
      new Map(
        (data?.test?.dimensions ?? []).map((d) => [d.psychometricDimensionId, d.name])
      ),
    [data]
  );

  const respondida = useCallback(
    (q) => {
      const r = respuestas[q.psychometricQuestionId];
      if (!r) return false;
      return q.questionType === QUESTION_KIND.MULTIPLE_CHOICE
        ? r.optionId != null
        : r.value != null;
    },
    [respuestas]
  );

  const contestadas = preguntas.filter(respondida).length;
  const total = preguntas.length;
  const progreso = total > 0 ? Math.round((contestadas / total) * 100) : 0;

  const guardar = useCallback(
    async (map) => {
      if (!data) return;
      setGuardando(true);
      setGuardadoOk(false);
      try {
        const items = Object.entries(map)
          .filter(([, r]) => r && (r.value != null || r.optionId != null))
          .map(([qid, r]) => ({
            questionId: Number(qid),
            value: r.value ?? null,
            optionId: r.optionId ?? null,
          }));
        await psychometricAssignmentsApi.saveResponses(id, items);
        setGuardadoOk(true);
        pendientesGuardar.current = false;
      } catch (e) {
        console.error(e);
        toast.error(mensajeDeError(e, 'No se pudo guardar. Revisa tu conexión.'));
      } finally {
        setGuardando(false);
      }
    },
    [data, id]
  );

  const responder = (q, patch) => {
    setGuardadoOk(false);
    pendientesGuardar.current = true;
    setRespuestas((prev) => {
      const next = {
        ...prev,
        [q.psychometricQuestionId]: {
          ...prev[q.psychometricQuestionId],
          ...patch,
        },
      };
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => guardar(next), 800);
      return next;
    });
  };

  // Guardado al salir si quedó algo pendiente.
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    []
  );

  const enviar = async () => {
    if (contestadas < total) {
      toast.error(`Faltan ${total - contestadas} ítem(s) por responder.`);
      return;
    }

    const ok = await confirm({
      title: '¿Enviar la evaluación?',
      message: 'Una vez enviada no podrás cambiar tus respuestas.',
      confirmLabel: 'Enviar',
    });
    if (ok === false) return;

    setEnviando(true);
    try {
      // Asegura que lo último quede guardado antes de enviar.
      if (timer.current) clearTimeout(timer.current);
      if (pendientesGuardar.current) await guardar(respuestas);

      await psychometricAssignmentsApi.submit(id, quien);
      toast.success('Evaluación enviada. ¡Gracias!');
      navigate('/my-evaluations');
    } catch (e) {
      console.error(e);
      toast.error(mensajeDeError(e, 'No se pudo enviar la evaluación.'));
    } finally {
      setEnviando(false);
    }
  };

  if (cargando) {
    return (
      <div className="mx-auto max-w-3xl space-y-4">
        <div className="h-8 w-64 animate-pulse rounded bg-stroke-soft" />
        <div className="h-24 animate-pulse rounded-xl bg-surface-alt" />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 animate-pulse rounded-xl bg-surface-alt" />
        ))}
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="mx-auto max-w-3xl">
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-stroke bg-surface-alt py-16 text-ink-muted">
          <AlertTriangle size={30} className="text-amber-600" />
          <p className="text-sm font-medium">{error ?? 'Evaluación no encontrada'}</p>
          <SecondaryButton onClick={() => navigate('/my-evaluations')}>
            <ArrowLeft size={15} />
            Volver
          </SecondaryButton>
        </div>
      </div>
    );
  }

  if (!puedeResponder(data)) {
    return (
      <div className="mx-auto max-w-3xl">
        <div className="flex flex-col items-center gap-3 rounded-xl border border-stroke-soft bg-surface py-16 text-ink-muted shadow-sm">
          <CheckCircle2 size={30} className="text-green-600" />
          <p className="text-sm font-medium text-ink">Ya enviaste esta evaluación</p>
          <p className="text-xs">Recursos Humanos revisará el resultado.</p>
          <SecondaryButton onClick={() => navigate('/my-evaluations')}>
            <ArrowLeft size={15} />
            Volver a mis evaluaciones
          </SecondaryButton>
        </div>
      </div>
    );
  }

  return (
    <>
      {dialog}

      <div className="mx-auto max-w-3xl space-y-6">
        <div>
          <button
            type="button"
            onClick={() => navigate('/my-evaluations')}
            className="mb-2 inline-flex items-center gap-1.5 text-sm font-semibold text-ink-muted transition-colors hover:text-brand"
          >
            <ArrowLeft size={15} />
            Mis evaluaciones
          </button>
          <PageTitle className="mb-0">{data.test?.name}</PageTitle>
          {data.test?.instructions && (
            <div className="mt-3 rounded-xl border border-stroke-soft bg-surface-alt p-4 text-sm text-ink-secondary">
              {data.test.instructions}
            </div>
          )}
        </div>

        {/* Progreso + estado de guardado (pegajoso) */}
        <div className="sticky top-16 z-10 rounded-xl border border-stroke-soft bg-surface/95 p-3 shadow-sm backdrop-blur">
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="font-semibold text-ink">
              {contestadas} de {total} respondidos
            </span>
            <span className="inline-flex items-center gap-1 text-ink-muted">
              {guardando ? (
                <>
                  <Loader2 size={13} className="animate-spin" />
                  Guardando…
                </>
              ) : guardadoOk ? (
                <>
                  <Check size={13} className="text-green-600" />
                  Guardado
                </>
              ) : (
                <>
                  <Cloud size={13} />
                  Se guarda solo
                </>
              )}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-canvas">
            <div
              className="h-full rounded-full bg-linear-to-r from-brand to-accent transition-all"
              style={{ width: `${progreso}%` }}
            />
          </div>
        </div>

        {/* Ítems */}
        <div className="space-y-3">
          {preguntas.map((q, i) => {
            const r = respuestas[q.psychometricQuestionId] ?? {};
            const dim = dimNombre.get(q.psychometricDimensionId);

            return (
              <div
                key={q.psychometricQuestionId}
                className={`rounded-xl border bg-surface p-5 shadow-sm transition-colors ${
                  respondida(q) ? 'border-stroke-soft' : 'border-brand/30'
                }`}
              >
                <div className="mb-3 flex items-start gap-2">
                  <span className="mt-0.5 text-sm font-semibold text-ink-muted">
                    {i + 1}.
                  </span>
                  <div>
                    <p className="text-sm font-medium text-ink">{q.text}</p>
                    {dim && (
                      <p className="mt-0.5 text-[11px] uppercase tracking-wide text-ink-muted">
                        {dim}
                      </p>
                    )}
                  </div>
                </div>

                {q.questionType === QUESTION_KIND.MULTIPLE_CHOICE ? (
                  <div className="space-y-1.5">
                    {(q.options ?? []).map((o) => {
                      const activo = r.optionId === o.psychometricOptionId;
                      return (
                        <label
                          key={o.psychometricOptionId}
                          className={`flex cursor-pointer items-center gap-2 rounded-lg border p-2.5 text-sm transition-colors ${
                            activo
                              ? 'border-brand bg-brand-tint text-brand-700'
                              : 'border-stroke-soft hover:border-brand/40'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`q-${q.psychometricQuestionId}`}
                            checked={activo}
                            onChange={() =>
                              responder(q, {
                                optionId: o.psychometricOptionId,
                                value: undefined,
                              })
                            }
                            className="accent-brand"
                          />
                          {o.text}
                        </label>
                      );
                    })}
                  </div>
                ) : (
                  <LikertScale
                    name={`q-${q.psychometricQuestionId}`}
                    value={r.value ?? null}
                    onChange={(v) => responder(q, { value: v, optionId: undefined })}
                  />
                )}
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-stroke-soft pt-4">
          <p className="text-sm text-ink-muted">
            {contestadas < total
              ? `Faltan ${total - contestadas} ítem(s).`
              : 'Todo respondido.'}
          </p>
          <PrimaryButton onClick={enviar} disabled={enviando || contestadas < total}>
            {enviando ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                Enviando…
              </>
            ) : (
              'Enviar evaluación'
            )}
          </PrimaryButton>
        </div>
      </div>
    </>
  );
};

export default TakePsychometricPage;
