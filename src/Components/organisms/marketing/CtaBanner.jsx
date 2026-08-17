import { ArrowRight } from 'lucide-react';
import CtaButton from '../../molecules/marketing/CtaButton';

/**
 * Banner de cierre con degradado de marca. Se repite al final de cada
 * página pública para mantener una única llamada a la acción clara.
 */
const CtaBanner = ({
  titulo = '¿Listo para dejar el Excel de la planilla?',
  subtitulo = 'Agenda una demostración de 30 minutos y te mostramos el sistema con un caso parecido al de tu empresa.',
  ctaPrimario = { to: '/contacto', label: 'Solicitar demo' },
  ctaSecundario = { to: '/precios', label: 'Ver precios' },
}) => {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-xl bg-linear-to-r from-brand to-accent px-6 py-14 text-center shadow-xl sm:px-12">
        {/* Halos decorativos */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-20 -right-10 h-64 w-64 rounded-full bg-white/10 blur-2xl"
        />

        <div className="relative mx-auto max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-white text-balance sm:text-4xl">
            {titulo}
          </h2>

          <p className="mt-4 text-base leading-relaxed text-white/85 text-pretty">
            {subtitulo}
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <CtaButton to={ctaPrimario.to} variant="onDark" size="lg">
              {ctaPrimario.label}
              <ArrowRight size={18} />
            </CtaButton>

            {ctaSecundario && (
              <CtaButton
                to={ctaSecundario.to}
                variant="onDarkOutline"
                size="lg"
              >
                {ctaSecundario.label}
              </CtaButton>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaBanner;
