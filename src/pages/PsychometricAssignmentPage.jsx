import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowLeft,
  RefreshCw,
} from 'lucide-react';

import psychometricAssignmentsApi from '../api/psychometricAssignmentsApi';
import { useConfirm } from '../hooks/useConfirm';
import { estadoDeAplicacion, tieneResultado } from '../utils/psychometricStatus';

import PageTitle from '../Components/PageTitle';
import SectionTitle from '../Components/SectionTitle';
import Divider from '../Components/Divider';
import SecondaryButton from '../Components/SecondaryButton';
import PsychometricStatusBadge from '../Components/molecules/PsychometricStatusBadge';

import PsychometricProfileChart from '../Components/organisms/psychometrics/PsychometricProfileChart';
import PsychometricResponsesTable from '../Components/organisms/psychometrics/PsychometricResponsesTable';
import ReviewNotesForm from '../Components/organisms/psychometrics/ReviewNotesForm';

const nombreDe = (u) =>
  [u?.firstName, u?.lastName].filter(Boolean).join(' ').trim() ||
  u?.userName ||
  u?.email ||
  'Sin nombre';

const formatFechaHora = (v) => {
  if (!v || String(v).startsWith('0001-01-01')) return '—';
  const f = new Date(v);
  return Number.isNaN(f.getTime())
    ? '—'
    : f.toLocaleString('es-CR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
};

const Dato = ({ label, children }) => (
  <div>
    <p className="text-xs uppercase tracking-wide text-ink-muted">{label}</p>
    <p className="mt-0.5 text-sm font-medium text-ink">{children}</p>
  </div>
);

const PsychometricAssignmentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { confirm, dialog } = useConfirm();

  const [a, setA] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const cargar = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const res = await psychometricAssignmentsApi.getById(id);
      setA(res.data ?? null);
    } catch (e) {
      console.error(e);
      setError(
        e?.response?.status === 404
          ? 'La aplicación no existe.'
          : 'No se pudo cargar la aplicación.'
      );
    } finally {
      setCargando(false);
    }
  }, [id]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  if (cargando) {
    return (
      <div className="mx-auto max-w-5xl space-y-4 p-4">
        <div className="h-8 w-64 animate-pulse rounded bg-stroke-soft" />
        <div className="h-40 animate-pulse rounded-xl bg-surface-alt" />
        <div className="h-72 animate-pulse rounded-xl bg-surface-alt" />
      </div>
    );
  }

  if (error || !a) {
    return (
      <div className="mx-auto max-w-5xl p-4">
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-stroke bg-surface-alt py-16 text-ink-muted">
          <AlertTriangle size={30} className="text-amber-600" />
          <p className="text-sm font-medium">{error ?? 'Aplicación no encontrada'}</p>
          <SecondaryButton onClick={() => navigate('/manager/psicometria')}>
            <ArrowLeft size={15} />
            Volver
          </SecondaryButton>
        </div>
      </div>
    );
  }

  const estado = estadoDeAplicacion(a);
  const scores = a.scores ?? [];
  const conResultado = tieneResultado(a);

  return (
    <>
      {dialog}

      <div className="mx-auto max-w-5xl space-y-6 p-4">
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
              <PageTitle className="mb-0">{a.test?.name}</PageTitle>
              <PsychometricStatusBadge value={estado} />
            </div>
            <SecondaryButton onClick={cargar}>
              <RefreshCw size={15} />
              Actualizar
            </SecondaryButton>
          </div>

          <p className="mt-1 text-sm text-ink-muted">
            {nombreDe(a.user)}
            {a.user?.email && ` · ${a.user.email}`}
          </p>
        </div>

        {/* Datos */}
        <div className="rounded-xl border border-stroke-soft bg-surface p-6 shadow-sm">
          <SectionTitle>Datos de la aplicación</SectionTitle>
          <Divider className="my-3" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Dato label="Asignada por">{a.assignedBy || '—'}</Dato>
            <Dato label="Asignada el">{formatFechaHora(a.assignedAt)}</Dato>
            <Dato label="Fecha límite">{a.dueDate ? formatFechaHora(a.dueDate) : '—'}</Dato>
            <Dato label="Iniciada">{formatFechaHora(a.startedAt)}</Dato>
            <Dato label="Completada">{formatFechaHora(a.completedAt)}</Dato>
            <Dato label="Revisada">{formatFechaHora(a.reviewedAt)}</Dato>
          </div>
        </div>

        {/* Perfil */}
        {conResultado ? (
          <div className="rounded-xl border border-stroke-soft bg-surface p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <SectionTitle className="mb-0">Perfil por dimensión</SectionTitle>
              {a.overallPercentage != null && (
                <span className="rounded-full bg-brand-tint px-3 py-1 text-sm font-semibold text-brand-700">
                  Global: {Math.round(a.overallPercentage)}%
                </span>
              )}
            </div>
            <Divider className="my-3" />

            {scores.length > 0 ? (
              <div className="grid gap-6 lg:grid-cols-2">
                <PsychometricProfileChart scores={scores} />

                <div className="overflow-x-auto rounded-xl border border-stroke-soft">
                  <table className="min-w-full">
                    <thead className="bg-surface-alt text-ink-secondary">
                      <tr>
                        <th className="px-3 py-2 text-left text-sm font-semibold">Dimensión</th>
                        <th className="px-3 py-2 text-right text-sm font-semibold">Puntaje</th>
                        <th className="px-3 py-2 text-right text-sm font-semibold">Promedio</th>
                        <th className="px-3 py-2 text-right text-sm font-semibold">%</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stroke-soft bg-surface">
                      {scores.map((s) => (
                        <tr key={s.psychometricDimensionId}>
                          <td className="px-3 py-2 text-sm font-medium text-ink">
                            {s.dimensionName}
                          </td>
                          <td className="px-3 py-2 text-right text-sm text-ink-secondary">
                            {Number(s.rawScore)} / {Number(s.maxScore)}
                          </td>
                          <td className="px-3 py-2 text-right text-sm text-ink-secondary">
                            {Number(s.average).toFixed(2)}
                          </td>
                          <td className="px-3 py-2 text-right text-sm font-semibold text-ink">
                            {Math.round(Number(s.percentage))}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <p className="text-sm text-ink-muted">
                No se calcularon puntajes: la prueba no tiene ítems con dimensión.
              </p>
            )}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-stroke bg-surface-alt p-6 text-center text-sm text-ink-muted">
            El colaborador todavía no ha enviado la evaluación.
          </div>
        )}

        {/* Revisión */}
        {conResultado && (
          <div className="rounded-xl border border-stroke-soft bg-surface p-6 shadow-sm">
            <SectionTitle>Revisión</SectionTitle>
            <Divider className="my-3" />
            <ReviewNotesForm
              assignment={a}
              onChanged={cargar}
              confirmReopen={() =>
                confirm({
                  title: '¿Reabrir la evaluación?',
                  message:
                    'Se borrará el resultado y el colaborador podrá volver a responder.',
                  tone: 'danger',
                  confirmLabel: 'Reabrir',
                })
              }
            />
          </div>
        )}

        {/* Respuestas */}
        {conResultado && (
          <div className="rounded-xl border border-stroke-soft bg-surface p-6 shadow-sm">
            <SectionTitle>Respuestas</SectionTitle>
            <Divider className="my-3" />
            <PsychometricResponsesTable
              questions={a.test?.questions ?? []}
              dimensions={a.test?.dimensions ?? []}
              responses={a.responses ?? []}
            />
          </div>
        )}

      </div>
    </>
  );
};

export default PsychometricAssignmentPage;
