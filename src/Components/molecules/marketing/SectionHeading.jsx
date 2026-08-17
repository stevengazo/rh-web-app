/**
 * Encabezado de sección del sitio público: antetítulo, título y bajada.
 *
 * @param {string} [eyebrow]  Antetítulo corto (se muestra en color de marca).
 * @param {string} title      Título de la sección.
 * @param {string} [subtitle] Párrafo descriptivo.
 * @param {boolean} [centered]
 */
const SectionHeading = ({
  eyebrow,
  title,
  subtitle,
  centered = true,
  className = '',
}) => {
  return (
    <div
      className={`max-w-2xl ${centered ? 'mx-auto text-center' : ''} ${className}`}
    >
      {eyebrow && (
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-brand">
          {eyebrow}
        </p>
      )}

      <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-ink text-balance">
        {title}
      </h2>

      {subtitle && (
        <p className="mt-4 text-base sm:text-lg leading-relaxed text-ink-muted text-pretty">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionHeading;
