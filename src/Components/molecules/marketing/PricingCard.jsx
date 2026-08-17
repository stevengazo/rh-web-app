import { Check } from 'lucide-react';
import CtaButton from './CtaButton';

/**
 * Tarjeta de plan comercial.
 *
 * @param {object} plan       Entrada de `PLANES` en src/data/marketing.js.
 * @param {boolean} [anual]   Muestra el precio anual en lugar del mensual.
 */
const PricingCard = ({ plan, anual = false }) => {
  const {
    nombre,
    resumen,
    precioMensual,
    precioAnual,
    precioTexto,
    unidad,
    minimo,
    incluye = [],
    destacado = false,
    etiqueta,
    cta = 'Solicitar demo',
  } = plan;

  const precio = anual ? precioAnual : precioMensual;
  const tienePrecio = typeof precio === 'number';

  return (
    <article
      className={`relative flex h-full flex-col rounded-xl border p-6 sm:p-7 transition-shadow
        ${
          destacado
            ? 'border-brand bg-surface shadow-xl lg:scale-[1.03]'
            : 'border-stroke-soft bg-surface shadow-sm hover:shadow-md'
        }`}
    >
      {/* Franja superior de acento en el plan destacado */}
      {destacado && (
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-1 rounded-t-xl bg-linear-to-r from-brand to-accent"
        />
      )}

      {etiqueta && (
        <span
          className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full
                     bg-linear-to-r from-brand to-accent px-3 py-1
                     text-xs font-bold uppercase tracking-wide text-white shadow-md"
        >
          {etiqueta}
        </span>
      )}

      <header className="mb-6">
        <h3 className="text-lg font-bold text-ink">{nombre}</h3>
        <p className="mt-1.5 min-h-10 text-sm leading-relaxed text-ink-muted">
          {resumen}
        </p>
      </header>

      {/* Precio */}
      <div className="mb-6 border-b border-stroke-soft pb-6">
        {tienePrecio ? (
          <>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold tracking-tight text-ink">
                ₡{precio.toLocaleString('es-CR')}
              </span>
            </div>
            <p className="mt-1 text-sm text-ink-muted">{unidad}</p>
            {anual && precioMensual > precioAnual && (
              <p className="mt-1 text-xs font-semibold text-accent-strong">
                Ahorras ₡{(precioMensual - precioAnual).toLocaleString('es-CR')}{' '}
                por colaborador al mes
              </p>
            )}
          </>
        ) : (
          <>
            <span className="text-4xl font-bold tracking-tight text-ink">
              {precioTexto}
            </span>
            <p className="mt-1 text-sm text-ink-muted">{unidad}</p>
          </>
        )}

        {minimo && <p className="mt-2 text-xs text-ink-muted">{minimo}</p>}
      </div>

      {/* Incluye */}
      <ul className="mb-8 grow space-y-3">
        {incluye.map((item) => (
          <li key={item} className="flex items-start gap-2.5 text-sm text-ink-secondary">
            <Check
              size={16}
              strokeWidth={2.5}
              className="mt-0.5 shrink-0 text-brand"
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <CtaButton
        to="/contacto"
        variant={destacado ? 'primary' : 'secondary'}
        size="md"
        className="w-full"
      >
        {cta}
      </CtaButton>
    </article>
  );
};

export default PricingCard;
