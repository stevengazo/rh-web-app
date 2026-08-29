import { useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import {
  CheckCircle2,
  ChevronDown,
  Copy,
  History,
  Loader2,
  Plus,
  RefreshCw,
  Save,
  Send,
  Trash2,
  Webhook,
  XCircle,
} from 'lucide-react';

import Label from '../Label';
import TextInput from '../TextInput';
import SelectInput from '../SelectInput';
import PrimaryButton from '../PrimaryButton';
import SecondaryButton from '../SecondaryButton';
import webhooksApi from '../../api/webhooksApi';
import { FORMATOS, METODOS } from '../../data/webhooks';
import { mensajeDeError } from '../../utils/apiError';
import { useAppContext } from '../../context/AppContext';

/** Suscripción recién creada, todavía sin id del servidor. */
const webhookNuevo = () => ({
  local: crypto.randomUUID(),
  name: '',
  url: '',
  method: 'POST',
  active: true,
  events: [],
  format: 'json',
  fields: [],
  template: '',
  headers: '',
  secret: null,
});

/** Del formato del API al que usa el formulario. */
const desdeApi = (w) => ({
  webhookSubscriptionId: w.webhookSubscriptionId,
  name: w.name ?? '',
  url: w.url ?? '',
  method: w.method ?? 'POST',
  active: w.active,
  events: (w.events ?? '').split(',').filter(Boolean),
  format: w.format ?? 'json',
  fields: (w.fields ?? '').split(',').filter(Boolean),
  template: w.template ?? '',
  headers: w.headers ?? '',
  hasSecret: w.hasSecret,
  lastDelivery: w.lastDelivery,
  failedCount: w.failedCount,
  // `null` = no tocar el secreto guardado.
  secret: null,
});

const formatFechaHora = (valor) => {
  if (!valor) return '—';
  const f = new Date(valor);
  return Number.isNaN(f.getTime())
    ? '—'
    : f.toLocaleString('es-CR', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      });
};

/**
 * Webhooks salientes: a dónde avisar y con qué.
 *
 * Los envíos los hace la API cuando ocurre el evento; aquí solo se declaran.
 * El catálogo de disparadores viene también de la API: es quien los publica,
 * así que es la única fuente fiable de qué se puede escuchar.
 */
const WebhookSettings = () => {
  const { user } = useAppContext();

  const [disparadores, setDisparadores] = useState([]);
  const [webhooks, setWebhooks] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [abierto, setAbierto] = useState(null);
  const [guardando, setGuardando] = useState(null);

  const cargar = useCallback(async () => {
    setCargando(true);

    try {
      const [eventosRes, listaRes] = await Promise.all([
        webhooksApi.getEvents(),
        webhooksApi.getAll(),
      ]);

      setDisparadores(Array.isArray(eventosRes?.data) ? eventosRes.data : []);
      setWebhooks((listaRes?.data ?? []).map(desdeApi));
    } catch (error) {
      console.error(error);
      toast.error(mensajeDeError(error, 'No se pudieron cargar los webhooks.'));
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  /** Los eventos vienen planos; se agrupan para mostrarlos. */
  const grupos = useMemo(() => {
    const mapa = new Map();

    disparadores.forEach((e) => {
      if (!mapa.has(e.group)) mapa.set(e.group, []);
      mapa.get(e.group).push(e);
    });

    return [...mapa.entries()].map(([grupo, eventos]) => ({ grupo, eventos }));
  }, [disparadores]);

  const clave = (w) => w.webhookSubscriptionId ?? w.local;

  const actualizar = (id, parcial) => {
    setWebhooks((prev) =>
      prev.map((w) => (clave(w) === id ? { ...w, ...parcial, sucio: true } : w))
    );
  };

  const agregar = () => {
    const nuevo = webhookNuevo();
    setWebhooks((prev) => [...prev, nuevo]);
    setAbierto(nuevo.local);
  };

  const eliminar = async (w) => {
    if (!window.confirm('¿Eliminar este webhook?')) return;

    // Si nunca se guardó, basta con quitarlo de la lista.
    if (!w.webhookSubscriptionId) {
      setWebhooks((prev) => prev.filter((x) => clave(x) !== clave(w)));
      return;
    }

    try {
      await webhooksApi.remove(w.webhookSubscriptionId);
      toast.success('Webhook eliminado');
      await cargar();
    } catch (error) {
      console.error(error);
      toast.error(mensajeDeError(error, 'No se pudo eliminar el webhook.'));
    }
  };

  const guardar = async (w) => {
    setGuardando(clave(w));

    const cuerpo = {
      name: w.name,
      url: w.url,
      method: w.method,
      active: w.active,
      events: w.events,
      format: w.format,
      fields: w.fields,
      template: w.template,
      headers: w.headers,
      secret: w.secret,
      userName: user?.userName ?? user?.email,
    };

    try {
      if (w.webhookSubscriptionId) {
        await webhooksApi.update(w.webhookSubscriptionId, cuerpo);
      } else {
        await webhooksApi.create(cuerpo);
      }

      toast.success('Webhook guardado');
      await cargar();
    } catch (error) {
      console.error(error);
      toast.error(mensajeDeError(error, 'No se pudo guardar el webhook.'));
    } finally {
      setGuardando(null);
    }
  };

  const probar = async (w) => {
    if (!w.webhookSubscriptionId) {
      toast.error('Guarda el webhook antes de probarlo.');
      return;
    }

    setGuardando(clave(w));

    try {
      const resp = await webhooksApi.test(w.webhookSubscriptionId);
      const r = resp?.data;

      if (r?.success) {
        toast.success(`El receptor respondió ${r.statusCode} en ${r.durationMs} ms`);
      } else {
        toast.error(`Falló: ${r?.statusCode ?? 'sin respuesta'} · ${r?.response ?? ''}`);
      }

      await cargar();
    } catch (error) {
      console.error(error);
      toast.error(mensajeDeError(error, 'No se pudo enviar la prueba.'));
    } finally {
      setGuardando(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-ink">Endpoints</h3>
          <p className="mt-0.5 text-sm text-ink-muted">
            {cargando
              ? 'Cargando…'
              : webhooks.length === 0
                ? 'Sin webhooks configurados.'
                : `${webhooks.length} configurado${webhooks.length === 1 ? '' : 's'}.`}
          </p>
        </div>

        <div className="flex gap-2">
          <SecondaryButton onClick={cargar} disabled={cargando}>
            <RefreshCw size={15} className={cargando ? 'animate-spin' : undefined} />
            Actualizar
          </SecondaryButton>

          <PrimaryButton onClick={agregar}>
            <Plus size={15} />
            Nuevo webhook
          </PrimaryButton>
        </div>
      </div>

      {cargando ? (
        <div className="space-y-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-xl bg-surface-alt" />
          ))}
        </div>
      ) : webhooks.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-stroke bg-surface-alt py-12 text-ink-muted">
          <Webhook size={28} />
          <p className="text-sm font-medium">Nada configurado todavía</p>
          <p className="text-center text-xs">
            Un webhook avisa a otro sistema cuando pasa algo aquí: una planilla
            aprobada, una certificación por vencer…
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {webhooks.map((w) => (
            <WebhookCard
              key={clave(w)}
              webhook={w}
              grupos={grupos}
              abierto={abierto === clave(w)}
              ocupado={guardando === clave(w)}
              onAlternar={() =>
                setAbierto(abierto === clave(w) ? null : clave(w))
              }
              onCambiar={(parcial) => actualizar(clave(w), parcial)}
              onEliminar={() => eliminar(w)}
              onGuardar={() => guardar(w)}
              onProbar={() => probar(w)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

/** Un webhook, plegado o desplegado. */
const WebhookCard = ({
  webhook,
  grupos,
  abierto,
  ocupado,
  onAlternar,
  onCambiar,
  onEliminar,
  onGuardar,
  onProbar,
}) => {
  const [vistaPrevia, setVistaPrevia] = useState('');
  const [entregas, setEntregas] = useState(null);

  const todos = useMemo(
    () => grupos.flatMap((g) => g.eventos),
    [grupos]
  );

  /* Solo se ofrecen los campos que **todos** los eventos elegidos comparten:
     si un webhook escucha dos eventos, el cuerpo tiene que poder armarse en
     ambos casos. */
  const camposDisponibles = useMemo(() => {
    const listas = webhook.events
      .map((id) => todos.find((e) => e.id === id)?.fields ?? [])
      .filter((l) => l.length);

    if (listas.length === 0) return [];

    return listas.reduce((comun, lista) =>
      comun.filter((c) => lista.includes(c))
    );
  }, [webhook.events, todos]);

  /* La vista previa la calcula el backend con el mismo código que usa al
     enviar: si se replicara aquí, acabaría mintiendo. */
  useEffect(() => {
    if (!abierto || webhook.events.length === 0) return;

    let vigente = true;

    webhooksApi
      .preview(
        {
          url: webhook.url || 'https://ejemplo.com',
          method: webhook.method,
          events: webhook.events,
          format: webhook.format,
          fields: webhook.fields,
          template: webhook.template,
        },
        webhook.events[0]
      )
      .then((r) => {
        if (!vigente) return;
        try {
          setVistaPrevia(JSON.stringify(JSON.parse(r.data.body), null, 2));
        } catch {
          setVistaPrevia(r.data.body);
        }
      })
      .catch(() => vigente && setVistaPrevia(''));

    return () => {
      vigente = false;
    };
  }, [
    abierto,
    webhook.url,
    webhook.method,
    webhook.events,
    webhook.format,
    webhook.fields,
    webhook.template,
  ]);

  const verEntregas = async () => {
    if (!webhook.webhookSubscriptionId) return;

    try {
      const r = await webhooksApi.getDeliveries(webhook.webhookSubscriptionId, 20);
      setEntregas(r.data ?? []);
    } catch (error) {
      console.error(error);
      toast.error('No se pudo cargar la bitácora.');
    }
  };

  const alternarEvento = (id) => {
    const siguiente = webhook.events.includes(id)
      ? webhook.events.filter((e) => e !== id)
      : [...webhook.events, id];

    onCambiar({ events: siguiente });
  };

  const alternarCampo = (campo) => {
    const actuales = webhook.fields.length ? webhook.fields : camposDisponibles;
    const siguiente = actuales.includes(campo)
      ? actuales.filter((c) => c !== campo)
      : [...actuales, campo];

    onCambiar({ fields: siguiente });
  };

  return (
    <div className="overflow-hidden rounded-xl border border-stroke-soft bg-surface">
      {/* Cabecera */}
      <div className="flex items-center gap-3 p-4">
        <button
          type="button"
          onClick={onAlternar}
          aria-expanded={abierto}
          className="flex min-w-0 flex-1 items-center gap-3 text-left"
        >
          <span
            className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg
              ${webhook.active ? 'bg-brand-tint text-brand' : 'bg-surface-alt text-ink-muted'}`}
          >
            <Webhook size={17} />
          </span>

          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-semibold text-ink">
              {webhook.name || 'Webhook sin nombre'}
            </span>
            <span className="block truncate text-xs text-ink-muted">
              {webhook.url || 'Sin URL'} ·{' '}
              {webhook.events.length === 0
                ? 'sin disparadores'
                : `${webhook.events.length} disparador${webhook.events.length === 1 ? '' : 'es'}`}
            </span>
          </span>

          <ChevronDown
            size={17}
            className={`shrink-0 text-ink-muted transition-transform ${abierto ? 'rotate-180' : ''}`}
          />
        </button>

        <label className="flex shrink-0 cursor-pointer items-center gap-1.5 text-xs text-ink-muted">
          <input
            type="checkbox"
            checked={webhook.active}
            onChange={(e) => onCambiar({ active: e.target.checked })}
            className="h-3.5 w-3.5 accent-brand"
          />
          Activo
        </label>

        <button
          type="button"
          onClick={onEliminar}
          title="Eliminar webhook"
          aria-label="Eliminar webhook"
          className="grid h-8 w-8 shrink-0 place-items-center rounded-md text-ink-muted
                     transition-colors hover:bg-red-50 hover:text-red-600"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {abierto && (
        <div className="space-y-6 border-t border-stroke-soft p-4">
          {/* Destino */}
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor={`wh-nombre-${webhook.webhookSubscriptionId}`}>Nombre</Label>
              <TextInput
                id={`wh-nombre-${webhook.webhookSubscriptionId}`}
                value={webhook.name}
                onChange={(e) => onCambiar({ name: e.target.value })}
                placeholder="Ej: Avisar a Contabilidad"
              />
            </div>

            <div>
              <Label htmlFor={`wh-metodo-${webhook.webhookSubscriptionId}`}>Método</Label>
              <SelectInput
                id={`wh-metodo-${webhook.webhookSubscriptionId}`}
                value={webhook.method}
                onChange={(e) => onCambiar({ method: e.target.value })}
              >
                {METODOS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </SelectInput>
            </div>

            <div className="sm:col-span-2">
              <Label htmlFor={`wh-url-${webhook.webhookSubscriptionId}`}>URL de destino</Label>
              <TextInput
                id={`wh-url-${webhook.webhookSubscriptionId}`}
                value={webhook.url}
                onChange={(e) => onCambiar({ url: e.target.value })}
                placeholder="https://ejemplo.com/hooks/rh"
              />
            </div>

            <div className="sm:col-span-2">
              <Label htmlFor={`wh-secreto-${webhook.webhookSubscriptionId}`}>
                Secreto de firma (opcional)
              </Label>
              <TextInput
                id={`wh-secreto-${webhook.webhookSubscriptionId}`}
                type="password"
                value={webhook.secret ?? ''}
                onChange={(e) => onCambiar({ secret: e.target.value })}
                autoComplete="off"
                placeholder={
                  webhook.hasSecret
                    ? 'Hay un secreto guardado. Escribe uno nuevo para cambiarlo.'
                    : 'Se usa para firmar el cuerpo con HMAC-SHA256'
                }
              />
              <p className="mt-1 text-xs text-ink-muted">
                Con secreto, cada envío llevará la cabecera{' '}
                <code className="rounded bg-surface-alt px-1">X-RH-Signature</code>{' '}
                para que el receptor pueda verificar que viene de aquí.
              </p>
            </div>
          </section>

          {/* Disparadores */}
          <section>
            <h4 className="text-xs font-bold uppercase tracking-widest text-brand">
              Disparadores
            </h4>
            <p className="mt-0.5 text-xs text-ink-muted">
              Qué tiene que pasar para que se envíe.
            </p>

            <div className="mt-3 space-y-4">
              {grupos.map((grupo) => (
                <div key={grupo.grupo}>
                  <p className="mb-1.5 text-xs font-semibold text-ink-secondary">
                    {grupo.grupo}
                  </p>

                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {grupo.eventos.map((evento) => (
                      <label
                        key={evento.id}
                        className={`flex cursor-pointer items-start gap-2 rounded-lg border p-2.5 transition-colors
                          ${
                            webhook.events.includes(evento.id)
                              ? 'border-brand bg-brand-tint'
                              : 'border-stroke-soft bg-surface hover:border-brand'
                          }`}
                      >
                        <input
                          type="checkbox"
                          checked={webhook.events.includes(evento.id)}
                          onChange={() => alternarEvento(evento.id)}
                          className="mt-0.5 h-3.5 w-3.5 shrink-0 accent-brand"
                        />
                        <span className="min-w-0">
                          <span className="block text-xs font-semibold text-ink">
                            {evento.name}
                          </span>
                          <span className="block text-[11px] leading-snug text-ink-muted">
                            {evento.description}
                          </span>
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Construcción del cuerpo */}
          <section>
            <h4 className="text-xs font-bold uppercase tracking-widest text-brand">
              Construcción de la consulta
            </h4>
            <p className="mt-0.5 text-xs text-ink-muted">
              Qué se manda y con qué forma.
            </p>

            <div className="mt-3 sm:max-w-xs">
              <Label htmlFor={`wh-formato-${webhook.webhookSubscriptionId}`}>Formato</Label>
              <SelectInput
                id={`wh-formato-${webhook.webhookSubscriptionId}`}
                value={webhook.format}
                onChange={(e) => onCambiar({ format: e.target.value })}
              >
                {FORMATOS.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.nombre}
                  </option>
                ))}
              </SelectInput>
              <p className="mt-1 text-xs text-ink-muted">
                {FORMATOS.find((f) => f.id === webhook.format)?.descripcion}
              </p>
            </div>

            {webhook.format === 'custom' ? (
              <div className="mt-4">
                <Label htmlFor={`wh-plantilla-${webhook.webhookSubscriptionId}`}>Plantilla</Label>
                <textarea
                  id={`wh-plantilla-${webhook.webhookSubscriptionId}`}
                  rows={6}
                  value={webhook.template}
                  onChange={(e) => onCambiar({ template: e.target.value })}
                  placeholder={'{\n  "mensaje": "Planilla {{payrollId}} aprobada",\n  "monto": {{totalAmount}}\n}'}
                  className="w-full resize-y rounded-md border border-stroke border-b-2
                             border-b-ink-muted bg-surface px-3 py-2 font-mono text-xs
                             text-ink placeholder:text-ink-muted transition-colors
                             focus:border-b-brand focus:outline-none"
                />
                <p className="mt-1 text-xs text-ink-muted">
                  Usa <code className="rounded bg-surface-alt px-1">{'{{campo}}'}</code>{' '}
                  para insertar valores. Campos disponibles:{' '}
                  {camposDisponibles.join(', ') || 'elige un disparador primero'}.
                </p>
              </div>
            ) : (
              camposDisponibles.length > 0 && (
                <div className="mt-4">
                  <p className="mb-2 text-xs font-semibold text-ink-secondary">
                    Campos a incluir
                  </p>

                  <div className="flex flex-wrap gap-1.5">
                    {camposDisponibles.map((campo) => {
                      const incluido = webhook.fields.length
                        ? webhook.fields.includes(campo)
                        : true;

                      return (
                        <button
                          key={campo}
                          type="button"
                          onClick={() => alternarCampo(campo)}
                          className={`rounded-full border px-2.5 py-0.5 font-mono text-[11px] transition-colors
                            ${
                              incluido
                                ? 'border-brand bg-brand-tint text-brand-700'
                                : 'border-stroke-soft bg-surface text-ink-muted'
                            }`}
                        >
                          {campo}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )
            )}
          </section>

          {/* Vista previa */}
          <section>
            <div className="mb-2 flex items-center justify-between gap-2">
              <h4 className="text-xs font-bold uppercase tracking-widest text-brand">
                Vista previa
              </h4>

              <SecondaryButton
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(vistaPrevia);
                    toast.success('Copiado');
                  } catch {
                    toast.error('El navegador no permitió copiar.');
                  }
                }}
              >
                <Copy size={14} />
                Copiar
              </SecondaryButton>
            </div>

            <pre className="overflow-x-auto rounded-lg border border-stroke-soft bg-surface-alt p-3 font-mono text-[11px] leading-relaxed text-ink">
              {webhook.method} {webhook.url || '<url>'}
              {'\n'}content-type: application/json
              {'\n'}x-rh-event: {webhook.events[0] ?? '<evento>'}
              {webhook.secret || webhook.hasSecret
                ? '\nx-rh-signature: sha256=<hmac>'
                : ''}
              {'\n\n'}
              {vistaPrevia || 'Elige un disparador para ver el cuerpo.'}
            </pre>
          </section>

          {/* Bitácora */}
          {webhook.webhookSubscriptionId && (
            <section>
              <div className="mb-2 flex items-center justify-between gap-2">
                <h4 className="text-xs font-bold uppercase tracking-widest text-brand">
                  Últimos envíos
                </h4>

                <SecondaryButton onClick={verEntregas}>
                  <History size={14} />
                  {entregas === null ? 'Ver bitácora' : 'Actualizar'}
                </SecondaryButton>
              </div>

              {entregas === null ? (
                <p className="text-xs text-ink-muted">
                  {webhook.lastDelivery
                    ? `Último: ${formatFechaHora(webhook.lastDelivery.createdAt)} · ${webhook.lastDelivery.success ? 'correcto' : 'falló'}`
                    : 'Todavía no se ha enviado nada.'}
                  {webhook.failedCount > 0 && ` · ${webhook.failedCount} con error`}
                </p>
              ) : entregas.length === 0 ? (
                <p className="text-xs text-ink-muted">Sin envíos registrados.</p>
              ) : (
                <ul className="divide-y divide-stroke-soft rounded-lg border border-stroke-soft">
                  {entregas.map((d) => (
                    <li
                      key={d.webhookDeliveryId}
                      className="flex items-center gap-3 px-3 py-2 text-xs"
                    >
                      {d.success ? (
                        <CheckCircle2 size={14} className="shrink-0 text-green-700" />
                      ) : (
                        <XCircle size={14} className="shrink-0 text-red-600" />
                      )}

                      <span className="w-40 shrink-0 truncate font-mono text-ink-secondary">
                        {d.event}
                      </span>

                      <span className="w-32 shrink-0 text-ink-muted">
                        {formatFechaHora(d.createdAt)}
                      </span>

                      <span className="w-16 shrink-0 text-ink-muted">
                        {d.statusCode ?? '—'}
                      </span>

                      <span className="w-16 shrink-0 text-ink-muted">
                        {d.durationMs} ms
                      </span>

                      <span className="min-w-0 flex-1 truncate text-ink-muted">
                        {d.response}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}

          {/* Acciones */}
          <div className="flex flex-wrap justify-end gap-3 border-t border-stroke-soft pt-4">
            {webhook.webhookSubscriptionId && (
              <SecondaryButton onClick={onProbar} disabled={ocupado}>
                <Send size={15} />
                Enviar prueba
              </SecondaryButton>
            )}

            <PrimaryButton onClick={onGuardar} disabled={ocupado}>
              {ocupado ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <Save size={15} />
              )}
              {webhook.webhookSubscriptionId ? 'Guardar cambios' : 'Crear webhook'}
            </PrimaryButton>
          </div>
        </div>
      )}
    </div>
  );
};

export default WebhookSettings;
