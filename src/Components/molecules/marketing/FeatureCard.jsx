import { Check } from 'lucide-react';

/**
 * Tarjeta de módulo/característica.
 *
 * @param {import('lucide-react').LucideIcon} icon
 * @param {string} titulo
 * @param {string} descripcion
 * @param {string[]} [detalles] Viñetas opcionales (vista ampliada).
 */
const FeatureCard = ({ icon: Icon, titulo, descripcion, detalles }) => {
  return (
    <article
      className="group relative h-full overflow-hidden rounded-xl border border-stroke-soft
                 bg-surface p-6 shadow-sm transition-all duration-200
                 hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-lg"
    >
      {/* Franja de acento que aparece al pasar el mouse */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-0.5 scale-x-0 bg-linear-to-r from-brand to-accent
                   transition-transform duration-300 group-hover:scale-x-100"
      />

      <div
        className="mb-4 grid h-11 w-11 place-items-center rounded-lg
                   bg-linear-to-br from-brand to-accent text-white shadow-sm"
      >
        {Icon && <Icon size={22} strokeWidth={1.8} />}
      </div>

      <h3 className="text-base font-semibold text-ink">{titulo}</h3>

      <p className="mt-2 text-sm leading-relaxed text-ink-muted">
        {descripcion}
      </p>

      {detalles?.length > 0 && (
        <ul className="mt-4 space-y-2 border-t border-stroke-soft pt-4">
          {detalles.map((detalle) => (
            <li
              key={detalle}
              className="flex items-start gap-2 text-sm text-ink-secondary"
            >
              <Check
                size={16}
                className="mt-0.5 shrink-0 text-brand"
                strokeWidth={2.5}
              />
              <span>{detalle}</span>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
};

export default FeatureCard;
