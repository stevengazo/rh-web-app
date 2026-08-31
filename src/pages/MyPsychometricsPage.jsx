import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Brain, CalendarClock, CheckCircle2 } from 'lucide-react';

import psychometricAssignmentsApi from '../api/psychometricAssignmentsApi';
import { useAppContext } from '../context/AppContext';
import {
  PSYCH_STATUS,
  estadoDeAplicacion,
  puedeResponder,
} from '../utils/psychometricStatus';

import PageTitle from '../Components/PageTitle';
import PrimaryButton from '../Components/PrimaryButton';
import PsychometricStatusBadge from '../Components/molecules/PsychometricStatusBadge';

const formatFecha = (v) => {
  if (!v || String(v).startsWith('0001-01-01')) return null;
  const f = new Date(v);
  return Number.isNaN(f.getTime())
    ? null
    : f.toLocaleDateString('es-CR', { day: '2-digit', month: 'long', year: 'numeric' });
};

const MyPsychometricsPage = () => {
  const navigate = useNavigate();
  const { user } = useAppContext();
  const userId = user?.id;

  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  const cargar = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await psychometricAssignmentsApi.getByUser(userId);
      setAssignments(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      console.error(e);
      setAssignments([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const { pendientes, enviadas } = useMemo(() => {
    const pend = [];
    const env = [];
    for (const a of assignments) {
      (puedeResponder(a) ? pend : env).push(a);
    }
    return { pendientes: pend, enviadas: env };
  }, [assignments]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-56 animate-pulse rounded bg-stroke-soft" />
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="h-32 animate-pulse rounded-xl bg-surface-alt" />
        ))}
      </div>
    );
  }

  const Tarjeta = ({ a }) => {
    const estado = estadoDeAplicacion(a);
    const limite = formatFecha(a.dueDate);
    const responder = puedeResponder(a);

    return (
      <article className="rounded-xl border border-stroke-soft bg-surface p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="font-semibold text-ink">{a.testName}</h2>
            {a.testDescription && (
              <p className="mt-1 text-sm text-ink-secondary">{a.testDescription}</p>
            )}
          </div>
          <PsychometricStatusBadge value={estado} />
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-ink-muted">
          <span>
            {a.answeredCount}/{a.questionCount} ítems respondidos
          </span>
          {limite && (
            <span className="inline-flex items-center gap-1">
              <CalendarClock size={13} />
              Fecha límite: {limite}
            </span>
          )}
        </div>

        {responder && (
          <div className="mt-4">
            <PrimaryButton
              onClick={() => navigate(`/my-evaluations/${a.psychometricAssignmentId}`)}
            >
              {estado === PSYCH_STATUS.IN_PROGRESS ? 'Continuar' : 'Responder'}
              <ArrowRight size={15} />
            </PrimaryButton>
          </div>
        )}

        {!responder && (
          <p className="mt-3 inline-flex items-center gap-1.5 text-sm text-green-700">
            <CheckCircle2 size={15} />
            Enviada. Recursos Humanos revisará el resultado.
          </p>
        )}
      </article>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <PageTitle className="mb-0">Mis evaluaciones</PageTitle>
        <p className="text-sm text-ink-muted">
          Cuestionarios psicométricos que Recursos Humanos te ha asignado.
        </p>
      </div>

      {assignments.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-stroke bg-surface-alt py-16 text-ink-muted">
          <Brain size={30} />
          <p className="text-sm font-medium">No tienes evaluaciones asignadas</p>
        </div>
      ) : (
        <>
          {pendientes.length > 0 && (
            <section className="space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wide text-ink-muted">
                Pendientes ({pendientes.length})
              </h3>
              {pendientes.map((a) => (
                <Tarjeta key={a.psychometricAssignmentId} a={a} />
              ))}
            </section>
          )}

          {enviadas.length > 0 && (
            <section className="space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wide text-ink-muted">
                Enviadas ({enviadas.length})
              </h3>
              {enviadas.map((a) => (
                <Tarjeta key={a.psychometricAssignmentId} a={a} />
              ))}
            </section>
          )}
        </>
      )}
    </div>
  );
};

export default MyPsychometricsPage;
