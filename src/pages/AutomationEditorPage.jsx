import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  AlertTriangle,
  ArrowLeft,
  FlaskConical,
  Loader2,
  Power,
  Save,
} from 'lucide-react';

import automationsApi from '../api/automationsApi';
import { useAppContext } from '../context/AppContext';
import { mensajeDeError } from '../utils/apiError';

import PageTitle from '../Components/PageTitle';
import SectionTitle from '../Components/SectionTitle';
import Divider from '../Components/Divider';
import PrimaryButton from '../Components/PrimaryButton';
import SecondaryButton from '../Components/SecondaryButton';
import Label from '../Components/Label';
import TextInput from '../Components/TextInput';
import SelectInput from '../Components/SelectInput';
import CheckBoxInput from '../Components/CheckBoxInput';

import ConditionBuilder from '../Components/organisms/automations/ConditionBuilder';
import ActionBuilder from '../Components/organisms/automations/ActionBuilder';
import AutomationRunsTable from '../Components/organisms/automations/AutomationRunsTable';

const areaClass =
  'w-full resize-none rounded-md border border-stroke border-b-2 border-b-ink-muted ' +
  'bg-surface px-3 py-2 text-sm text-ink placeholder:text-ink-muted ' +
  'transition-colors focus:border-b-brand focus:outline-none';

const VACIO = {
  name: '',
  description: '',
  enabled: true,
  triggerEvent: '',
  conditions: [],
  actions: [],
};

const AutomationEditorPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAppContext();
  const quien = user?.userName ?? user?.email ?? 'Sistema';
  const esNueva = id === 'nueva';

  const [catalog, setCatalog] = useState(null);
  const [form, setForm] = useState(VACIO);
  const [runs, setRuns] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [guardando, setGuardando] = useState(false);

  const [sample, setSample] = useState('');
  const [simResultado, setSimResultado] = useState(null);
  const [simulando, setSimulando] = useState(false);

  const cargar = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const cRes = await automationsApi.getCatalog();
      setCatalog(cRes.data);

      if (!esNueva) {
        const [rRes, runsRes] = await Promise.all([
          automationsApi.getById(id),
          automationsApi.getRuns(id, 30),
        ]);
        const r = rRes.data;
        setForm({
          name: r.name ?? '',
          description: r.description ?? '',
          enabled: r.enabled,
          triggerEvent: r.triggerEvent ?? '',
          conditions: r.conditions ?? [],
          actions: r.actions ?? [],
        });
        setRuns(Array.isArray(runsRes.data) ? runsRes.data : []);
      }
    } catch (e) {
      console.error(e);
      setError(
        e?.response?.status === 404
          ? 'La automatización no existe.'
          : 'No se pudo cargar.'
      );
    } finally {
      setCargando(false);
    }
  }, [id, esNueva]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const eventos = catalog?.events ?? [];
  const eventoActual = useMemo(
    () => eventos.find((e) => e.id === form.triggerEvent),
    [eventos, form.triggerEvent]
  );
  const fields = eventoActual?.fields ?? [];

  const gruposDeEvento = useMemo(() => {
    const map = new Map();
    for (const e of eventos) {
      if (!map.has(e.group)) map.set(e.group, []);
      map.get(e.group).push(e);
    }
    return [...map.entries()];
  }, [eventos]);

  const set = (patch) => setForm((prev) => ({ ...prev, ...patch }));

  // Prellena el JSON de ejemplo con los campos del evento elegido.
  useEffect(() => {
    if (!eventoActual) return;
    const ejemplo = Object.fromEntries(
      eventoActual.fields.map((f) => [f, f.toLowerCase().includes('id') ? '' : ''])
    );
    setSample(JSON.stringify(ejemplo, null, 2));
    setSimResultado(null);
  }, [eventoActual]);

  const guardar = async () => {
    if (!form.name.trim()) return toast.error('El nombre es obligatorio.');
    if (!form.triggerEvent) return toast.error('Elige un disparador.');
    if (form.actions.length === 0) return toast.error('Agrega al menos una acción.');

    setGuardando(true);
    try {
      const dto = { ...form, name: form.name.trim(), userName: quien };
      if (esNueva) {
        const res = await automationsApi.create(dto);
        toast.success('Automatización creada.');
        navigate(`/manager/automatizaciones/${res.data.automationRuleId}`, {
          replace: true,
        });
      } else {
        await automationsApi.update(id, dto);
        toast.success('Cambios guardados.');
        cargar();
      }
    } catch (e) {
      console.error(e);
      toast.error(mensajeDeError(e, 'No se pudo guardar.'));
    } finally {
      setGuardando(false);
    }
  };

  const alternarActiva = async () => {
    try {
      await (form.enabled
        ? automationsApi.disable(id)
        : automationsApi.enable(id));
      set({ enabled: !form.enabled });
      toast.success(form.enabled ? 'Desactivada.' : 'Activada.');
    } catch (e) {
      toast.error(mensajeDeError(e, 'No se pudo cambiar el estado.'));
    }
  };

  const simular = async () => {
    if (esNueva) {
      toast.error('Guarda la automatización antes de simular.');
      return;
    }
    setSimulando(true);
    try {
      const res = await automationsApi.simulate(id, sample);
      setSimResultado(res.data);
    } catch (e) {
      toast.error(mensajeDeError(e, 'No se pudo simular.'));
    } finally {
      setSimulando(false);
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

  if (error) {
    return (
      <div className="mx-auto max-w-4xl p-4">
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-stroke bg-surface-alt py-16 text-ink-muted">
          <AlertTriangle size={30} className="text-amber-600" />
          <p className="text-sm font-medium">{error}</p>
          <SecondaryButton onClick={() => navigate('/manager/automatizaciones')}>
            <ArrowLeft size={15} />
            Volver
          </SecondaryButton>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-4">
      <div>
        <button
          type="button"
          onClick={() => navigate('/manager/automatizaciones')}
          className="mb-2 inline-flex items-center gap-1.5 text-sm font-semibold text-ink-muted transition-colors hover:text-brand"
        >
          <ArrowLeft size={15} />
          Automatizaciones
        </button>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <PageTitle className="mb-0">
            {esNueva ? 'Nueva automatización' : form.name || 'Automatización'}
          </PageTitle>
          <div className="flex flex-wrap gap-2">
            {!esNueva && (
              <SecondaryButton onClick={alternarActiva}>
                <Power size={15} />
                {form.enabled ? 'Desactivar' : 'Activar'}
              </SecondaryButton>
            )}
            <PrimaryButton onClick={guardar} disabled={guardando}>
              {guardando ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <Save size={15} />
              )}
              Guardar
            </PrimaryButton>
          </div>
        </div>
      </div>

      {/* Datos */}
      <section className="rounded-xl border border-stroke-soft bg-surface p-6 shadow-sm">
        <SectionTitle>Datos</SectionTitle>
        <Divider className="my-3" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label htmlFor="au-name">Nombre *</Label>
            <TextInput
              id="au-name"
              value={form.name}
              onChange={(e) => set({ name: e.target.value })}
              placeholder="Ej: Avisar al colaborador cuando se aprueba su préstamo"
            />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="au-desc">Descripción</Label>
            <textarea
              id="au-desc"
              rows={2}
              value={form.description}
              onChange={(e) => set({ description: e.target.value })}
              className={areaClass}
            />
          </div>
        </div>
        <div className="mt-3">
          <CheckBoxInput
            label="Activa"
            checked={form.enabled}
            onChange={(e) => set({ enabled: e.target.checked })}
          />
        </div>
      </section>

      {/* Disparador */}
      <section className="rounded-xl border border-stroke-soft bg-surface p-6 shadow-sm">
        <SectionTitle>
          <span className="text-brand">Cuando</span> ocurre…
        </SectionTitle>
        <Divider className="my-3" />
        <Label htmlFor="au-trigger">Evento *</Label>
        <SelectInput
          id="au-trigger"
          value={form.triggerEvent}
          onChange={(e) => set({ triggerEvent: e.target.value })}
        >
          <option value="">Selecciona un evento…</option>
          {gruposDeEvento.map(([grupo, evs]) => (
            <optgroup key={grupo} label={grupo}>
              {evs.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name}
                </option>
              ))}
            </optgroup>
          ))}
        </SelectInput>
        {eventoActual && (
          <p className="mt-2 text-xs text-ink-muted">{eventoActual.description}</p>
        )}
      </section>

      {/* Condiciones */}
      <section className="rounded-xl border border-stroke-soft bg-surface p-6 shadow-sm">
        <SectionTitle>
          <span className="text-brand">Si</span> se cumple…
        </SectionTitle>
        <Divider className="my-3" />
        {form.triggerEvent ? (
          <ConditionBuilder
            fields={fields}
            value={form.conditions}
            onChange={(conditions) => set({ conditions })}
          />
        ) : (
          <p className="text-sm text-ink-muted">Elige primero un evento disparador.</p>
        )}
      </section>

      {/* Acciones */}
      <section className="rounded-xl border border-stroke-soft bg-surface p-6 shadow-sm">
        <SectionTitle>
          <span className="text-brand">Entonces</span> ejecuta…
        </SectionTitle>
        <Divider className="my-3" />
        <ActionBuilder
          value={form.actions}
          onChange={(actions) => set({ actions })}
          fields={fields}
          tests={catalog?.psychometricTests ?? []}
        />
      </section>

      {/* Simular */}
      {!esNueva && (
        <section className="rounded-xl border border-stroke-soft bg-surface p-6 shadow-sm">
          <SectionTitle>
            <span className="inline-flex items-center gap-2">
              <FlaskConical size={17} />
              Simular
            </span>
          </SectionTitle>
          <Divider className="my-3" />
          <p className="mb-2 text-xs text-ink-muted">
            Un payload de ejemplo para probar las condiciones sin ejecutar nada.
          </p>
          <textarea
            rows={6}
            value={sample}
            onChange={(e) => setSample(e.target.value)}
            className={`${areaClass} font-mono text-xs`}
          />
          <div className="mt-2">
            <SecondaryButton onClick={simular} disabled={simulando}>
              {simulando ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <FlaskConical size={15} />
              )}
              Probar
            </SecondaryButton>
          </div>

          {simResultado && (
            <div className="mt-3 rounded-lg border border-stroke-soft bg-surface-alt p-3 text-sm">
              <p className="font-semibold text-ink">
                {simResultado.matched
                  ? '✓ Las condiciones se cumplen.'
                  : '✗ Las condiciones no se cumplen.'}
              </p>
              {simResultado.matched && (
                <ul className="mt-1 list-disc space-y-0.5 pl-5 text-ink-secondary">
                  {(simResultado.wouldRun ?? []).map((w, i) => (
                    <li key={i}>{w.preview}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </section>
      )}

      {/* Registro */}
      {!esNueva && (
        <section className="rounded-xl border border-stroke-soft bg-surface p-6 shadow-sm">
          <SectionTitle>Registro de ejecuciones</SectionTitle>
          <Divider className="my-3" />
          <AutomationRunsTable runs={runs} />
        </section>
      )}
    </div>
  );
};

export default AutomationEditorPage;
