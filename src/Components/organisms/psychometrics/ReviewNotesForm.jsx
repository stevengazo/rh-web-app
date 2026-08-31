import { useState } from 'react';
import toast from 'react-hot-toast';
import { ClipboardCheck, Loader2, RotateCcw } from 'lucide-react';

import psychometricAssignmentsApi from '../../../api/psychometricAssignmentsApi';
import { useAppContext } from '../../../context/AppContext';
import { mensajeDeError } from '../../../utils/apiError';
import { PSYCH_STATUS, estadoDeAplicacion } from '../../../utils/psychometricStatus';

import PrimaryButton from '../../PrimaryButton';
import SecondaryButton from '../../SecondaryButton';

const areaClass =
  'w-full resize-none rounded-md border border-stroke border-b-2 border-b-ink-muted ' +
  'bg-surface px-3 py-2 text-sm text-ink placeholder:text-ink-muted ' +
  'transition-colors focus:border-b-brand focus:outline-none';

/**
 * Conclusión del evaluador + botones de Revisar / Reabrir.
 *
 * @param {object} assignment
 * @param {()=>void} onChanged
 * @param {(fn:Function)=>Promise} [confirmReopen]  Diálogo de confirmación para reabrir.
 */
const ReviewNotesForm = ({ assignment, onChanged, confirmReopen }) => {
  const { user } = useAppContext();
  const quien = user?.userName ?? user?.email ?? 'Sistema';

  const [notes, setNotes] = useState(assignment?.reviewNotes ?? '');
  const [loading, setLoading] = useState(false);

  const estado = estadoDeAplicacion(assignment);
  const revisada = estado === PSYCH_STATUS.REVIEWED;

  const revisar = async () => {
    setLoading(true);
    try {
      await psychometricAssignmentsApi.review(assignment.psychometricAssignmentId, {
        notes: notes.trim() || null,
        userName: quien,
      });
      toast.success('Aplicación revisada.');
      onChanged?.();
    } catch (err) {
      console.error(err);
      toast.error(mensajeDeError(err, 'No se pudo revisar.'));
    } finally {
      setLoading(false);
    }
  };

  const reabrir = async () => {
    if (confirmReopen) {
      const ok = await confirmReopen();
      if (ok === false) return;
    }
    setLoading(true);
    try {
      await psychometricAssignmentsApi.reopen(
        assignment.psychometricAssignmentId,
        quien
      );
      toast.success('Aplicación reabierta.');
      onChanged?.();
    } catch (err) {
      console.error(err);
      toast.error(mensajeDeError(err, 'No se pudo reabrir.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <label
        htmlFor="review-notes"
        className="block text-sm font-semibold text-ink-secondary"
      >
        Conclusión del evaluador
      </label>
      <textarea
        id="review-notes"
        rows={4}
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Interpretación del perfil, observaciones y recomendaciones"
        className={areaClass}
      />

      {assignment.reviewedBy && (
        <p className="text-xs text-ink-muted">
          Revisada por {assignment.reviewedBy}
          {assignment.reviewedAt &&
            ` · ${new Date(assignment.reviewedAt).toLocaleDateString('es-CR')}`}
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        <PrimaryButton onClick={revisar} disabled={loading}>
          {loading ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <ClipboardCheck size={15} />
          )}
          {revisada ? 'Actualizar revisión' : 'Marcar como revisada'}
        </PrimaryButton>

        <SecondaryButton onClick={reabrir} disabled={loading}>
          <RotateCcw size={15} />
          Reabrir para el colaborador
        </SecondaryButton>
      </div>
    </div>
  );
};

export default ReviewNotesForm;
