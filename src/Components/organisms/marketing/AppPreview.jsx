import {
  Briefcase,
  CalendarDays,
  FileText,
  LayoutDashboard,
  Users,
} from 'lucide-react';

/**
 * Maqueta estática del sistema para el hero.
 *
 * Se dibuja con divs y tokens (no es una captura de pantalla) para que
 * acompañe el modo claro/oscuro y no dependa de imágenes externas.
 * Es decorativa: se oculta a lectores de pantalla.
 */
const items = [
  { icon: LayoutDashboard, label: 'Dashboard', activo: true },
  { icon: Users, label: 'Empleados' },
  { icon: FileText, label: 'Planilla' },
  { icon: Briefcase, label: 'Acciones' },
  { icon: CalendarDays, label: 'Ausencias' },
];

const tarjetas = [
  { label: 'Colaboradores', valor: '148' },
  { label: 'Planilla del mes', valor: '₡38.2M' },
  { label: 'Ausencias', valor: '6' },
];

/** Alturas de las barras del gráfico simulado (en %). */
const barras = [42, 58, 47, 71, 63, 88, 76, 95];

const filas = [
  { nombre: 'Ana Rodríguez', puesto: 'Contabilidad', estado: 'Procesada' },
  { nombre: 'Luis Vargas', puesto: 'Operaciones', estado: 'Procesada' },
  { nombre: 'María Jiménez', puesto: 'Ventas', estado: 'Pendiente' },
];

const AppPreview = () => {
  return (
    <div
      aria-hidden="true"
      className="overflow-hidden rounded-xl border border-stroke-soft bg-surface shadow-2xl"
    >
      {/* Barra de ventana */}
      <div className="flex items-center gap-2 border-b border-stroke-soft bg-surface-alt px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
        <div className="ml-3 h-5 flex-1 rounded-md bg-canvas" />
      </div>

      <div className="flex">
        {/* Barra lateral */}
        <aside className="hidden w-40 shrink-0 flex-col gap-1 bg-linear-to-b from-nav to-violet-950 p-3 sm:flex">
          <p className="mb-2 px-2 text-[11px] font-semibold text-white/80">
            RH Manager
          </p>

          {items.map(({ icon: Icon, label, activo }) => (
            <div
              key={label}
              className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-[11px] font-medium
                ${
                  activo
                    ? 'bg-linear-to-r from-brand to-accent text-white'
                    : 'text-gray-400'
                }`}
            >
              <Icon size={13} />
              {label}
            </div>
          ))}
        </aside>

        {/* Contenido */}
        <div className="flex-1 space-y-3 bg-canvas p-4">
          {/* Tarjetas de indicadores */}
          <div className="grid grid-cols-3 gap-2.5">
            {tarjetas.map((t) => (
              <div
                key={t.label}
                className="rounded-lg border border-stroke-soft bg-surface p-2.5"
              >
                <p className="text-[10px] text-ink-muted">{t.label}</p>
                <p className="mt-0.5 text-base font-bold text-ink">{t.valor}</p>
              </div>
            ))}
          </div>

          {/* Gráfico simulado */}
          <div className="rounded-lg border border-stroke-soft bg-surface p-3">
            <p className="mb-2 text-[10px] font-semibold text-ink-secondary">
              Costo de planilla por mes
            </p>

            <div className="flex h-20 items-end gap-1.5">
              {barras.map((altura, i) => (
                <div
                  key={i}
                  style={{ height: `${altura}%` }}
                  className="flex-1 rounded-t-sm bg-linear-to-t from-brand to-accent opacity-90"
                />
              ))}
            </div>
          </div>

          {/* Tabla simulada */}
          <div className="overflow-hidden rounded-lg border border-stroke-soft bg-surface">
            <div className="bg-surface-alt px-3 py-1.5 text-[10px] font-semibold text-ink-secondary shadow-[inset_0_-2px_0_0_rgba(124,58,237,0.45)]">
              Planilla · Agosto
            </div>

            {filas.map((fila) => (
              <div
                key={fila.nombre}
                className="flex items-center justify-between border-t border-stroke-soft px-3 py-2"
              >
                <div className="flex items-center gap-2">
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-brand-tint text-[9px] font-bold text-brand-700">
                    {fila.nombre.charAt(0)}
                  </span>
                  <div>
                    <p className="text-[10px] font-medium text-ink">
                      {fila.nombre}
                    </p>
                    <p className="text-[9px] text-ink-muted">{fila.puesto}</p>
                  </div>
                </div>

                <span
                  className={`rounded-full px-2 py-0.5 text-[9px] font-semibold
                    ${
                      fila.estado === 'Procesada'
                        ? 'bg-green-50 text-green-700'
                        : 'bg-amber-50 text-amber-800'
                    }`}
                >
                  {fila.estado}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppPreview;
