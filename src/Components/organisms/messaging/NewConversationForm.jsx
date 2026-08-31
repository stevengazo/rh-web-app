import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { Loader2, Search, Users } from 'lucide-react';

import messagingApi from '../../../api/messagingApi';
import EmployeeApi from '../../../api/employeesApi';
import { useAppContext } from '../../../context/AppContext';
import { mensajeDeError } from '../../../utils/apiError';
import { fieldClasses } from '../../atoms/fieldClasses';

import Label from '../../Label';
import TextInput from '../../TextInput';
import CheckBoxInput from '../../CheckBoxInput';
import PrimaryButton from '../../PrimaryButton';
import SecondaryButton from '../../SecondaryButton';

const nombreDe = (e) =>
  [e?.firstName, e?.lastName].filter(Boolean).join(' ').trim() ||
  e?.userName ||
  e?.email ||
  'Sin nombre';

/**
 * Iniciar una conversación directa o crear un grupo.
 *
 * @param {(conversationId:number)=>void} onCreated
 * @param {()=>void} [onCancel]
 */
const NewConversationForm = ({ onCreated, onCancel }) => {
  const { user } = useAppContext();
  const userId = user?.id;

  const [modo, setModo] = useState('directo'); // 'directo' | 'grupo'
  const [empleados, setEmpleados] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [seleccion, setSeleccion] = useState(() => new Set());
  const [titulo, setTitulo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    EmployeeApi.getAllEmployees()
      .then((r) =>
        setEmpleados(
          (r.data ?? []).filter((e) => e.isActive && !e.deleted && e.id !== userId)
        )
      )
      .catch((e) => {
        console.error(e);
        toast.error('No se pudieron cargar los colaboradores.');
      });
  }, [userId]);

  const filtrados = useMemo(() => {
    const t = busqueda.trim().toLowerCase();
    const base = t
      ? empleados.filter((e) =>
          [nombreDe(e), e.email, e.departament?.name]
            .filter(Boolean)
            .some((c) => String(c).toLowerCase().includes(t))
        )
      : empleados;
    return [...base].sort((a, b) => nombreDe(a).localeCompare(nombreDe(b)));
  }, [empleados, busqueda]);

  const alternar = (id) =>
    setSeleccion((prev) => {
      const next = new Set(prev);
      if (modo === 'directo') {
        next.clear();
        if (!prev.has(id)) next.add(id);
      } else {
        next.has(id) ? next.delete(id) : next.add(id);
      }
      return next;
    });

  const cambiarModo = (m) => {
    setModo(m);
    setSeleccion(new Set());
    setError('');
  };

  const crear = async (e) => {
    e.preventDefault();
    setError('');

    const ids = [...seleccion];
    if (ids.length === 0) {
      setError('Selecciona al menos un colaborador.');
      return;
    }
    if (modo === 'grupo' && !titulo.trim()) {
      setError('El grupo necesita un nombre.');
      return;
    }

    setLoading(true);
    try {
      const res =
        modo === 'directo'
          ? await messagingApi.startDirect(userId, ids[0])
          : await messagingApi.startGroup(userId, titulo.trim(), ids);
      onCreated?.(res.data.conversationId);
    } catch (err) {
      console.error(err);
      setError(mensajeDeError(err, 'No se pudo crear la conversación.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={crear} className="space-y-5 text-ink">
      <div>
        <h2 className="text-lg font-semibold">Nuevo mensaje</h2>
      </div>

      <div className="inline-flex rounded-lg border border-stroke-soft bg-surface-alt p-1">
        {[
          ['directo', 'Directo'],
          ['grupo', 'Grupo'],
        ].map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => cambiarModo(id)}
            className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              modo === id ? 'bg-surface text-brand shadow-sm' : 'text-ink-muted hover:text-ink'
            }`}
          >
            {id === 'grupo' && <Users size={14} />}
            {label}
          </button>
        ))}
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      {modo === 'grupo' && (
        <div>
          <Label htmlFor="grp-name">Nombre del grupo *</Label>
          <TextInput
            id="grp-name"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Ej: Equipo de Ventas"
          />
        </div>
      )}

      <div>
        <div className="mb-1 flex items-center justify-between">
          <Label className="mb-0">
            {modo === 'directo' ? 'Colaborador *' : 'Participantes *'}
          </Label>
          {modo === 'grupo' && (
            <span className="text-xs text-ink-muted">
              {seleccion.size} seleccionado{seleccion.size === 1 ? '' : 's'}
            </span>
          )}
        </div>

        <div className="relative mb-2">
          <Search
            size={15}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
          />
          <input
            type="search"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por nombre, correo o departamento…"
            className={fieldClasses({ className: 'h-9 pl-9' })}
          />
        </div>

        <div className="max-h-64 space-y-1 overflow-y-auto rounded-xl border border-stroke-soft p-2 scrollbar-slim">
          {filtrados.length === 0 ? (
            <p className="p-3 text-center text-sm text-ink-muted">Sin colaboradores.</p>
          ) : (
            filtrados.map((e) => (
              <label
                key={e.id}
                className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 hover:bg-canvas"
              >
                <input
                  type={modo === 'directo' ? 'radio' : 'checkbox'}
                  name="destinatario"
                  checked={seleccion.has(e.id)}
                  onChange={() => alternar(e.id)}
                  className="accent-brand"
                />
                <span className="text-sm">
                  {nombreDe(e)}
                  {e.departament?.name && (
                    <span className="text-ink-muted"> — {e.departament.name}</span>
                  )}
                </span>
              </label>
            ))
          )}
        </div>
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
              Creando…
            </>
          ) : modo === 'directo' ? (
            'Abrir conversación'
          ) : (
            'Crear grupo'
          )}
        </PrimaryButton>
      </div>
    </form>
  );
};

export default NewConversationForm;
