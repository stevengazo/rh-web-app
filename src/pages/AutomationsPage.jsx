import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Plug,
  RefreshCw,
  Sparkles,
  Webhook,
  Workflow,
  XCircle,
} from 'lucide-react';

import PageTitle from '../Components/PageTitle';
import Divider from '../Components/Divider';
import SecondaryButton from '../Components/SecondaryButton';

import webhooksApi from '../api/webhooksApi';
import mcpApi from '../api/mcpApi';
import { estadoIa, modeloPara } from '../api/iaClient';
import { USO } from '../data/modelosIa';
import { mensajeDeError } from '../utils/apiError';

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

/** Tarjeta de un canal de automatización. */
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
              ${
                activo
                  ? 'border-green-200 bg-green-50 text-green-700'
                  : 'border-stroke bg-surface-alt text-ink-muted'
              }`}
          >
            {activo ? <CheckCircle2 size={11} /> : <XCircle size={11} />}
            {activo ? 'Activo' : 'Inactivo'}
          </span>
        </div>

        <p className="mt-1 text-sm text-ink-muted">{descripcion}</p>

        {resumen && (
          <p className="mt-2 text-sm font-medium text-ink">{resumen}</p>
        )}

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

/**
 * Automatizaciones.
 *
 * Es la vista de conjunto de todo lo que el sistema hace solo o deja hacer
 * desde fuera: avisos a otros sistemas, acceso de asistentes, tareas con IA y
 * alertas programadas. La configuración de cada cosa sigue en Ajustes; aquí se
 * ve el estado y se llega de un clic.
 */
const AutomationsPage = () => {
  const [webhooks, setWebhooks] = useState([]);
  const [mcp, setMcp] = useState(null);
  const [cargando, setCargando] = useState(true);

  const cargar = useCallback(async () => {
    setCargando(true);

    try {
      const [whRes, mcpRes] = await Promise.all([
        webhooksApi.getAll().catch(() => null),
        mcpApi.getConfig().catch(() => null),
      ]);

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

  const activos = webhooks.filter((w) => w.active);
  const conFallos = webhooks.filter((w) => (w.failedCount ?? 0) > 0);
  const ultimo = activos
    .map((w) => w.lastDelivery)
    .filter(Boolean)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];

  const ia = estadoIa();

  if (cargando) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 animate-pulse rounded-xl bg-surface-alt" />
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <PageTitle className="mb-0">Automatizaciones</PageTitle>
          <p className="text-sm text-ink-muted">
            Lo que el sistema hace solo y lo que deja hacer desde fuera.
          </p>
        </div>

        <SecondaryButton onClick={cargar}>
          <RefreshCw size={15} />
          Actualizar
        </SecondaryButton>
      </div>

      <Divider />

      {conFallos.length > 0 && (
        <div className="mb-5 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <AlertTriangle size={18} className="mt-0.5 shrink-0 text-amber-700" />
          <p className="text-sm text-amber-900">
            <span className="font-semibold">
              {conFallos.length} webhook{conFallos.length === 1 ? '' : 's'} con
              envíos fallidos.
            </span>{' '}
            Revisa la bitácora: puede que el receptor haya cambiado de dirección
            o esté rechazando la firma.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Canal
          icon={Webhook}
          titulo="Webhooks salientes"
          descripcion="Avisan a otros sistemas cuando pasa algo aquí: una planilla aprobada, una certificación por vencer."
          activo={activos.length > 0}
          resumen={
            webhooks.length === 0
              ? 'Ninguno configurado.'
              : `${activos.length} activo${activos.length === 1 ? '' : 's'} de ${webhooks.length}`
          }
          detalle={
            ultimo
              ? `Último envío: ${formatFechaHora(ultimo.createdAt)} · ${ultimo.success ? 'correcto' : 'falló'}`
              : 'Todavía no se ha enviado nada.'
          }
          a="/settings"
          cta="Configurar webhooks"
        />

        <Canal
          icon={Plug}
          titulo="Servidor MCP"
          descripcion="Permite que un asistente externo consulte el sistema y registre solicitudes."
          activo={Boolean(mcp?.enabled)}
          resumen={
            mcp?.enabled
              ? `${mcp.tools?.length ?? 0} herramientas expuestas en ${mcp.endpoint}`
              : 'Apagado: el endpoint responde 404.'
          }
          detalle={
            mcp?.enabled
              ? mcp.hasToken
                ? 'Protegido con token Bearer.'
                : 'Sin token: cualquiera con la URL puede consultar.'
              : null
          }
          a="/settings"
          cta="Configurar MCP"
        />

        <Canal
          icon={Sparkles}
          titulo="Tareas con IA"
          descripcion="Resumen de expedientes, análisis de ausentismo y de planillas, redacción de acciones."
          activo={ia.listo}
          resumen={
            ia.listo
              ? `Modelo por defecto: ${modeloPara(USO.RESUMEN_EXPEDIENTE)}`
              : ia.motivo
          }
          a="/settings"
          cta="Configurar IA"
        />

        <Canal
          icon={Clock}
          titulo="Alertas programadas"
          descripcion="Certificaciones por vencer, planillas sin pagar y solicitudes que llevan días esperando."
          activo={false}
          resumen="Se calculan al abrir la campana de notificaciones."
          detalle="Todavía no hay una tarea en el servidor que las evalúe sola y avise por correo o webhook."
          a="/manager"
          cta="Ver notificaciones"
        />
      </div>

      <div className="mt-5 flex items-start gap-3 rounded-xl border border-stroke-soft bg-surface-alt p-4">
        <Workflow size={18} className="mt-0.5 shrink-0 text-ink-muted" />
        <p className="text-sm text-ink-secondary">
          <span className="font-semibold">Cómo encajan.</span> Un cambio en el
          sistema queda registrado en{' '}
          <Link to="/manager/auditoria" className="font-semibold text-brand hover:underline">
            auditoría
          </Link>{' '}
          y, si hay un webhook escuchando ese evento, se avisa hacia afuera. Un
          asistente conectado por MCP puede consultar y dejar solicitudes, que
          siempre nacen pendientes de aprobación humana.
        </p>
      </div>
    </>
  );
};

export default AutomationsPage;
