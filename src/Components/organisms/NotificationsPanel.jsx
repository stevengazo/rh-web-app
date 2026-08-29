import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  Bell,
  BellOff,
  CheckCheck,
  ClipboardCheck,
  Clock,
  ReceiptText,
  RefreshCw,
} from 'lucide-react';

import useNotifications from '../../hooks/useNotifications';
import { useAppContext } from '../../context/AppContext';

/* Presentación por tipo de aviso. */
const TIPOS = {
  aprobacion: {
    icon: ClipboardCheck,
    color: 'bg-brand-tint text-brand',
    label: 'Por aprobar',
  },
  vencimiento: {
    icon: AlertTriangle,
    color: 'bg-amber-50 text-amber-700',
    label: 'Vencimientos',
  },
  planilla: {
    icon: ReceiptText,
    color: 'bg-accent-tint text-accent-strong',
    label: 'Planilla',
  },
};

/* Franja lateral según urgencia: lo vencido salta a la vista. */
const BORDE = {
  alta: 'border-l-red-500',
  media: 'border-l-amber-400',
  baja: 'border-l-brand',
};

const FILTROS = [
  { id: 'todas', label: 'Todas' },
  { id: 'aprobacion', label: 'Por aprobar' },
  { id: 'vencimiento', label: 'Vencimientos' },
  { id: 'planilla', label: 'Planilla' },
];

/**
 * Campana de notificaciones del panel administrativo.
 *
 * Los avisos se derivan del estado real de los módulos (ver
 * `useNotifications`), así que no hace falta que nadie los genere: si algo
 * queda pendiente de aprobar o una certificación se acerca a su vencimiento,
 * aparece aquí solo.
 *
 * Al pulsar un aviso se navega al módulo correspondiente y se marca como
 * leído; lo leído se recuerda entre sesiones.
 */
const NotificationsPanel = () => {
  const navigate = useNavigate();
  const { user } = useAppContext();

  const [abierto, setAbierto] = useState(false);
  const [filtro, setFiltro] = useState('todas');
  const contenedorRef = useRef(null);

  const {
    notificaciones,
    sinLeer,
    cargando,
    leidas,
    marcarLeida,
    marcarTodasLeidas,
    recargar,
  } = useNotifications({ usuario: user?.userName ?? user?.email ?? '' });

  /* Cerrar al hacer clic fuera o con Escape: es un menú, no un modal. */
  useEffect(() => {
    if (!abierto) return undefined;

    const fuera = (e) => {
      if (!contenedorRef.current?.contains(e.target)) setAbierto(false);
    };

    const escape = (e) => {
      if (e.key === 'Escape') setAbierto(false);
    };

    document.addEventListener('mousedown', fuera);
    document.addEventListener('keydown', escape);

    return () => {
      document.removeEventListener('mousedown', fuera);
      document.removeEventListener('keydown', escape);
    };
  }, [abierto]);

  const visibles = useMemo(
    () =>
      filtro === 'todas'
        ? notificaciones
        : notificaciones.filter((n) => n.tipo === filtro),
    [notificaciones, filtro]
  );

  const cuentas = useMemo(() => {
    const porTipo = { todas: notificaciones.length };
    notificaciones.forEach((n) => {
      porTipo[n.tipo] = (porTipo[n.tipo] ?? 0) + 1;
    });
    return porTipo;
  }, [notificaciones]);

  const abrir = (n) => {
    marcarLeida(n.id);
    setAbierto(false);
    if (n.ruta) navigate(n.ruta);
  };

  const pendientes = sinLeer.length;

  return (
    <div ref={contenedorRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setAbierto((v) => !v)}
        aria-label={
          pendientes > 0
            ? `Notificaciones, ${pendientes} sin leer`
            : 'Notificaciones'
        }
        aria-expanded={abierto}
        title="Notificaciones"
        className={`relative grid h-9 w-9 place-items-center rounded-md transition-colors
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand
          ${
            abierto
              ? 'bg-brand-tint text-brand'
              : 'text-ink-muted hover:bg-canvas hover:text-ink'
          }`}
      >
        <Bell size={18} />

        {pendientes > 0 && (
          <span
            className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center
                       rounded-full bg-red-500 px-1 text-[10px] font-bold text-white"
          >
            {pendientes > 9 ? '9+' : pendientes}
          </span>
        )}
      </button>

      <AnimatePresence>
        {abierto && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            role="dialog"
            aria-label="Notificaciones"
            className="absolute right-0 z-50 mt-2 flex max-h-[32rem] w-[22rem] flex-col
                       overflow-hidden rounded-xl border border-stroke bg-surface shadow-lg
                       sm:w-96"
          >
            {/* Cabecera */}
            <div className="flex items-center justify-between gap-2 border-b border-stroke-soft px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-ink">Notificaciones</p>
                <p className="text-xs text-ink-muted">
                  {pendientes > 0
                    ? `${pendientes} sin leer de ${notificaciones.length}`
                    : `${notificaciones.length} en total`}
                </p>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={recargar}
                  title="Actualizar"
                  aria-label="Actualizar notificaciones"
                  className="grid h-8 w-8 place-items-center rounded-md text-ink-muted
                             transition-colors hover:bg-canvas hover:text-ink"
                >
                  <RefreshCw size={15} className={cargando ? 'animate-spin' : undefined} />
                </button>

                {pendientes > 0 && (
                  <button
                    type="button"
                    onClick={marcarTodasLeidas}
                    title="Marcar todas como leídas"
                    aria-label="Marcar todas como leídas"
                    className="grid h-8 w-8 place-items-center rounded-md text-ink-muted
                               transition-colors hover:bg-brand-tint hover:text-brand"
                  >
                    <CheckCheck size={16} />
                  </button>
                )}
              </div>
            </div>

            {/* Filtros: solo los tipos que hoy tienen avisos */}
            {notificaciones.length > 0 && (
              <div className="flex flex-wrap gap-1.5 border-b border-stroke-soft px-4 py-2.5">
                {FILTROS.filter(
                  (f) => f.id === 'todas' || cuentas[f.id] > 0
                ).map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFiltro(f.id)}
                    className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors
                      ${
                        filtro === f.id
                          ? 'border-brand bg-brand-tint text-brand-700'
                          : 'border-stroke-soft bg-surface text-ink-muted hover:border-brand hover:text-brand'
                      }`}
                  >
                    {f.label}
                    <span className="ml-1 opacity-70">{cuentas[f.id] ?? 0}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Listado */}
            <div className="min-h-0 flex-1 overflow-y-auto">
              {cargando && notificaciones.length === 0 ? (
                <div className="space-y-2 p-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-14 animate-pulse rounded-lg bg-surface-alt" />
                  ))}
                </div>
              ) : visibles.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 px-4 py-12 text-ink-muted">
                  <BellOff size={26} />
                  <p className="text-sm font-medium">
                    {notificaciones.length === 0
                      ? 'Todo al día'
                      : 'Nada de este tipo'}
                  </p>
                  <p className="text-center text-xs">
                    {notificaciones.length === 0
                      ? 'No hay nada pendiente de aprobar ni por vencer.'
                      : 'Prueba con otro filtro.'}
                  </p>
                </div>
              ) : (
                <ul className="divide-y divide-stroke-soft">
                  {visibles.map((n) => {
                    const { icon: Icon, color } = TIPOS[n.tipo] ?? TIPOS.aprobacion;
                    const noLeida = !leidas.has(n.id);

                    return (
                      <li key={n.id}>
                        <button
                          type="button"
                          onClick={() => abrir(n)}
                          className={`flex w-full items-start gap-3 border-l-4 px-4 py-3 text-left
                                      transition-colors hover:bg-canvas
                                      focus-visible:outline-none focus-visible:bg-canvas
                                      ${BORDE[n.urgencia] ?? BORDE.baja}
                                      ${noLeida ? 'bg-brand-subtle' : ''}`}
                        >
                          <span
                            className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg ${color}`}
                          >
                            <Icon size={15} />
                          </span>

                          <span className="min-w-0 flex-1">
                            <span className="flex items-start gap-2">
                              <span
                                className={`line-clamp-2 flex-1 text-sm ${
                                  noLeida
                                    ? 'font-semibold text-ink'
                                    : 'font-medium text-ink-secondary'
                                }`}
                              >
                                {n.titulo}
                              </span>

                              {noLeida && (
                                <span
                                  aria-hidden="true"
                                  className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand"
                                />
                              )}
                            </span>

                            <span className="mt-0.5 block truncate text-xs text-ink-muted">
                              {n.detalle}
                            </span>
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {/* Pie */}
            <p className="flex items-center gap-1.5 border-t border-stroke-soft bg-surface-alt px-4 py-2 text-[11px] text-ink-muted">
              <Clock size={12} />
              Se actualizan solas cada 5 minutos.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationsPanel;
