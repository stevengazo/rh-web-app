import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Plug,
  Plus,
  Power,
  RefreshCw,
  Sparkles,
  Webhook,
  Workflow,
  XCircle,
  Zap,
} from 'lucide-react';

import PageTitle from '../Components/PageTitle';
import Divider from '../Components/Divider';
import PrimaryButton from '../Components/PrimaryButton';
import SecondaryButton from '../Components/SecondaryButton';
import HelpButton from '../Components/molecules/HelpButton';
import RowActionButton from '../Components/molecules/RowActionButton';
import { useConfirm } from '../hooks/useConfirm';

import automationsApi from '../api/automationsApi';
import webhooksApi from '../api/webhooksApi';
import mcpApi from '../api/mcpApi';
import { estadoIa, modeloPara } from '../api/iaClient';
import { USO } from '../data/modelosIa';
import { mensajeDeError } from '../utils/apiError';
import { RUN_STATUS_STYLE } from '../utils/automations';

const formatFechaHora = (valor) => {
  if (!valor) return null;
  const f = new Date(valor);
  return Number.isNaN(f.getTime())
    ? null
    : f.toLocaleString('es-CR', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      });
};

const StatCard = ({ icon: Icon, label, valor, accent }) => (
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

const Canal = ({ icon: Icono, titulo, descripcion, activo, resumen, detalle, a, cta }) => (
  <div className="rounded-xl border border-stroke-soft bg-surface p-5">
    <div className="flex items-start gap-3">
      <span
        className={`grid h-11 w-11 shrink-0 place-items-center rounded-lg
          ${activo ? 'bg-brand-tint text-brand' : 'bg-surface-alt text-ink-muted'}`}
      >
        <Icono size={20} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-sm font-semibold text-ink">{titulo}</h3>
          <span
            className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold
              ${activo ? 'border-green-200 bg-green-50 text-green-700' : 'border-stroke bg-surface-alt text-ink-muted'}`}
          >
            {activo ? <CheckCircle2 size={11} /> : <XCircle size={11} />}
            {activo ? 'Activo' : 'Inactivo'}
          </span>
        </div>
        <p className="mt-1 text-sm text-ink-muted">{descripcion}</p>
        {resumen && <p className="mt-2 text-sm font-medium text-ink">{resumen}</p>}
        {detalle && <p className="mt-0.5 text-xs text-ink-muted">{detalle}</p>}
        <Link
          to={a}
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:underline"
        >
          {cta}
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  </div>
);

const AutomationsPage = () => {
  const navigate = useNavigate();
  const { confirm, dialog } = useConfirm();

  const [reglas, setReglas] = useState([]);
  const [stats, setStats] = useState(null);
  const [webhooks, setWebhooks] = useState([]);
  const [mcp, setMcp] = useState(null);
  const [cargando, setCargando] = useState(true);

  const cargar = useCallback(async () => {
    setCargando(true);
    try {
      const [rRes, sRes, whRes, mcpRes] = await Promise.all([
        automationsApi.getAll().catch(() => null),
        automationsApi.getStats().catch(() => null),
        webhooksApi.getAll().catch(() => null),
        mcpApi.getConfig().catch(() => null),
      ]);
      setReglas(rRes?.data ?? []);
      setStats(sRes?.data ?? null);
      setWebhooks(whRes?.data ?? []);
      setMcp(mcpRes?.data ?? null);
    } catch (error) {
      console.error(error);
      toast.error(mensajeDeError(error, 'No se pudo cargar el estado.'));
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const ejecutar = async (fn, exito, err) => {
    try {
      await fn();
      toast.success(exito);
      await cargar();
    } catch (e) {
      toast.error(mensajeDeError(e, err));
    }
  };

  const toggle = (r) =>
    ejecutar(
      () => (r.enabled ? automationsApi.disable(r.automationRuleId) : automationsApi.enable(r.automationRuleId)),
      r.enabled ? 'Automatización desactivada.' : 'Automatización activada.',
      'No se pudo cambiar el estado.'
    );

  const eliminar = async (r) => {
    const ok = await confirm({
      title: `¿Eliminar "${r.name}"?`,
      tone: 'danger',
      confirmLabel: 'Eliminar',
    });
    if (ok === false) return;
    ejecutar(
      () => automationsApi.remove(r.automationRuleId),
      'Automatización eliminada.',
      'No se pudo eliminar.'
    );
  };

  const activosWh = webhooks.filter((w) => w.active);
  const ia = estadoIa();

  const ultimoWh = useMemo(
    () =>
      activosWh
        .map((w) => w.lastDelivery)
        .filter(Boolean)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0],
    [activosWh]
  );

  return (
    <>
      {dialog}

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <PageTitle className="mb-0">Automatizaciones</PageTitle>
            <HelpButton area="automatizaciones" />
          </div>
          <p className="text-sm text-ink-muted">
            Reglas que reaccionan solas a lo que pasa en el sistema.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <SecondaryButton onClick={cargar} disabled={cargando}>
            <RefreshCw size={15} className={cargando ? 'animate-spin' : undefined} />
            Actualizar
          </SecondaryButton>
          <PrimaryButton onClick={() => navigate('/manager/automatizaciones/nueva')}>
            <Plus size={16} />
            Nueva automatización
          </PrimaryButton>
        </div>
      </div>

      <Divider />

      {stats && (
        <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard icon={Zap} label="Automatizaciones" valor={stats.total} accent="bg-brand-tint text-brand" />
          <StatCard icon={CheckCircle2} label="Activas" valor={stats.activas} accent="bg-green-50 text-green-700" />
          <StatCard icon={Activity} label="Ejecuciones (7 días)" valor={stats.ejecuciones7d} accent="bg-violet-50 text-violet-700" />
          <StatCard icon={AlertTriangle} label="Con error" valor={stats.conError} accent="bg-amber-50 text-amber-700" />
        </div>
      )}

      {/* Reglas */}
      <div className="overflow-x-auto rounded-xl border border-stroke-soft shadow-sm">
        {cargando ? (
          <div className="space-y-2 p-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-12 animate-pulse rounded-lg bg-surface-alt" />
            ))}
          </div>
        ) : reglas.length === 0 ? (
          <div className="flex flex-col items-center gap-2 bg-surface py-16 text-ink-muted">
            <Workflow size={30} />
            <p className="text-sm font-medium">No hay automatizaciones</p>
            <p className="text-xs">
              Crea una: «cuando se apruebe un préstamo, avísale al colaborador».
            </p>
          </div>
        ) : (
          <table className="min-w-full">
            <thead className="bg-surface-alt text-ink-secondary">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">Automatización</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Disparador</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">Acciones</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Última ejecución</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Estado</th>
                <th className="px-4 py-3 text-center text-sm font-semibold"> </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stroke-soft bg-surface">
              {reglas.map((r) => (
                <tr
                  key={r.automationRuleId}
                  onClick={() => navigate(`/manager/automatizaciones/${r.automationRuleId}`)}
                  className="cursor-pointer transition hover:bg-canvas"
                >
                  <td className="px-4 py-3 text-sm">
                    <p className="font-medium text-ink">{r.name}</p>
                    {r.description && (
                      <p className="max-w-md truncate text-xs text-ink-muted">{r.description}</p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-ink-secondary">{r.triggerName}</td>
                  <td className="px-4 py-3 text-center text-sm text-ink-secondary">{r.actionCount}</td>
                  <td className="px-4 py-3 text-sm text-ink-secondary">
                    {r.lastRunAt ? (
                      <span className="inline-flex items-center gap-1.5">
                        {formatFechaHora(r.lastRunAt)}
                        {r.lastRunStatus && (
                          <span
                            className={`rounded-full border px-1.5 text-[11px] font-semibold ${
                              RUN_STATUS_STYLE[r.lastRunStatus] ?? RUN_STATUS_STYLE.Omitida
                            }`}
                          >
                            {r.lastRunStatus}
                          </span>
                        )}
                      </span>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                        r.enabled
                          ? 'border-green-200 bg-green-50 text-green-700'
                          : 'border-stroke bg-surface-alt text-ink-secondary'
                      }`}
                    >
                      {r.enabled ? 'Activa' : 'Inactiva'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <RowActionButton
                        icon={Power}
                        label={r.enabled ? 'Desactivar' : 'Activar'}
                        tono={r.enabled ? 'default' : 'brand'}
                        onClick={() => toggle(r)}
                      />
                      <RowActionButton
                        icon={XCircle}
                        label="Eliminar"
                        tono="danger"
                        onClick={() => eliminar(r)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Integraciones */}
      <div className="mt-8">
        <SectionTitleLite>Integraciones</SectionTitleLite>
        <div className="mt-3 grid grid-cols-1 gap-4 xl:grid-cols-2">
          <Canal
            icon={Webhook}
            titulo="Webhooks salientes"
            descripcion="Avisan a otros sistemas cuando pasa algo aquí."
            activo={activosWh.length > 0}
            resumen={
              webhooks.length === 0
                ? 'Ninguno configurado.'
                : `${activosWh.length} activo${activosWh.length === 1 ? '' : 's'} de ${webhooks.length}`
            }
            detalle={
              ultimoWh
                ? `Último envío: ${formatFechaHora(ultimoWh.createdAt)} · ${ultimoWh.success ? 'correcto' : 'falló'}`
                : 'Todavía no se ha enviado nada.'
            }
            a="/settings"
            cta="Configurar webhooks"
          />
          <Canal
            icon={Plug}
            titulo="Servidor MCP"
            descripcion="Permite que un asistente externo consulte el sistema."
            activo={Boolean(mcp?.enabled)}
            resumen={
              mcp?.enabled
                ? `${mcp.tools?.length ?? 0} herramientas en ${mcp.endpoint}`
                : 'Apagado: el endpoint responde 404.'
            }
            a="/settings"
            cta="Configurar MCP"
          />
          <Canal
            icon={Sparkles}
            titulo="Tareas con IA"
            descripcion="Resúmenes de expedientes, análisis de ausentismo y de planillas."
            activo={ia.listo}
            resumen={ia.listo ? `Modelo por defecto: ${modeloPara(USO.RESUMEN_EXPEDIENTE)}` : ia.motivo}
            a="/settings"
            cta="Configurar IA"
          />
          <Canal
            icon={Clock}
            titulo="Alertas programadas"
            descripcion="Certificaciones por vencer, planillas sin pagar y solicitudes atrasadas."
            activo={false}
            resumen="Se calculan al abrir la campana de notificaciones."
            a="/manager"
            cta="Ver notificaciones"
          />
        </div>
      </div>
    </>
  );
};

const SectionTitleLite = ({ children }) => (
  <h2 className="text-sm font-bold uppercase tracking-wide text-ink-muted">{children}</h2>
);

export default AutomationsPage;
