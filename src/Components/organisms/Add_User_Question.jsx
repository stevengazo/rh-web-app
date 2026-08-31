import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

import user_questionApi from '../../api/user_questionApi';
import employeesApi from '../../api/employeesApi';
import questionApi from '../../api/questionsApi';
import { mensajeDeError } from '../../utils/apiError';

import Label from '../Label';
import SelectInput from '../SelectInput';
import PrimaryButton from '../PrimaryButton';
import SecondaryButton from '../SecondaryButton';

const nombreDe = (e) =>
  [e?.firstName, e?.lastName].filter(Boolean).join(' ').trim() ||
  e?.userName ||
  e?.email ||
  'Sin nombre';

/**
 * Asigna una pregunta a un colaborador.
 *
 * @param {string} [userId]    Fija el colaborador y oculta el selector.
 * @param {number} [questionId] Preselecciona la pregunta.
 * @param {() => void} [onSaved]
 * @param {() => void} [onCancel]
 */
const Add_User_Question = ({ userId, questionId, onSaved, onCancel }) => {
  const [employees, setEmployees] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [form, setForm] = useState({
    userId: userId ?? '',
    questionId: questionId ? String(questionId) : '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const eligeEmpleado = !userId;

  useEffect(() => {
    const cargar = async () => {
      try {
        const [eRes, qRes] = await Promise.all([
          eligeEmpleado ? employeesApi.getAllEmployees() : Promise.resolve({ data: [] }),
          questionApi.getAllQuestions(),
        ]);
        setEmployees((eRes.data ?? []).filter((e) => e.isActive && !e.deleted));
        setQuestions((qRes.data ?? []).filter((q) => q.isActive));
      } catch (err) {
        console.error(err);
        toast.error('No se pudieron cargar los datos.');
      }
    };
    cargar();
  }, [eligeEmpleado]);

  const empleadosOrdenados = useMemo(
    () => [...employees].sort((a, b) => nombreDe(a).localeCompare(nombreDe(b))),
    [employees]
  );

  const set = (name, value) => setForm((prev) => ({ ...prev, [name]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.userId) {
      setError('Selecciona al colaborador.');
      return;
    }
    if (!form.questionId) {
      setError('Selecciona la pregunta.');
      return;
    }

    setLoading(true);
    try {
      await user_questionApi.createUser_Question({
        userId: form.userId,
        questionId: Number(form.questionId),
      });
      toast.success('Pregunta asignada.');
      onSaved?.();
    } catch (err) {
      console.error(err);
      setError(mensajeDeError(err, 'No se pudo asignar la pregunta.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 text-ink">
      <div>
        <h2 className="text-lg font-semibold">Asignar pregunta</h2>
        <p className="mt-1 text-xs text-ink-muted">
          Solo se listan las preguntas activas.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      {eligeEmpleado && (
        <div>
          <Label htmlFor="uq-user">Colaborador *</Label>
          <SelectInput
            id="uq-user"
            value={form.userId}
            onChange={(e) => set('userId', e.target.value)}
          >
            <option value="">Selecciona un colaborador…</option>
            {empleadosOrdenados.map((e) => (
              <option key={e.id} value={e.id}>
                {nombreDe(e)}
                {e.departament?.name ? ` — ${e.departament.name}` : ''}
              </option>
            ))}
          </SelectInput>
        </div>
      )}

      <div>
        <Label htmlFor="uq-q">Pregunta *</Label>
        <SelectInput
          id="uq-q"
          value={form.questionId}
          onChange={(e) => set('questionId', e.target.value)}
        >
          <option value="">Selecciona una pregunta…</option>
          {questions.map((q) => (
            <option key={q.questionId} value={q.questionId}>
              {q.text}
            </option>
          ))}
        </SelectInput>
      </div>

      <div className="flex justify-end gap-3 border-t border-stroke-soft pt-4">
        {onCancel && (
          <SecondaryButton onClick={onCancel} disabled={loading}>
            Cancelar
          </SecondaryButton>
        )}
        <PrimaryButton type="submit" disabled={loading}>
          {loading ? (
            <>
              <Loader2 size={15} className="animate-spin" />
              Asignando…
            </>
          ) : (
            'Asignar'
          )}
        </PrimaryButton>
      </div>
    </form>
  );
};

export default Add_User_Question;
