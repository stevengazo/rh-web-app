/**
 * Paso numerado del flujo de implementación.
 *
 * @param {number} numero
 * @param {import('lucide-react').LucideIcon} icon
 * @param {string} titulo
 * @param {string} descripcion
 * @param {string} [duracion] Etiqueta de tiempo (ej. "Día 1").
 * @param {boolean} [ultimo]  Oculta la línea conectora.
 */
const StepCard = ({
  numero,
  icon: Icon,
  titulo,
  descripcion,
  duracion,
  ultimo = false,
}) => {
  return (
    <div className="relative flex gap-5">
      {/* Columna del indicador + conector vertical */}
      <div className="flex flex-col items-center">
        <div
          className="grid h-12 w-12 shrink-0 place-items-center rounded-full
                     bg-linear-to-br from-brand to-accent text-white shadow-md"
        >
          {Icon ? <Icon size={22} strokeWidth={1.8} /> : numero}
        </div>

        {!ultimo && (
          <span
            aria-hidden="true"
            className="mt-2 w-px grow bg-linear-to-b from-accent/40 to-transparent"
          />
        )}
      </div>

      {/* Contenido */}
      <div className={ultimo ? 'pb-0' : 'pb-10'}>
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-widest text-brand">
            Paso {numero}
          </span>

          {duracion && (
            <span className="rounded-full bg-accent-tint px-2.5 py-0.5 text-xs font-semibold text-accent-strong">
              {duracion}
            </span>
          )}
        </div>

        <h3 className="mt-1 text-lg font-semibold text-ink">{titulo}</h3>

        <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-muted">
          {descripcion}
        </p>
      </div>
    </div>
  );
};

export default StepCard;
