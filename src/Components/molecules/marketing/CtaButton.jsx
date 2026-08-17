import { Link } from 'react-router-dom';

/**
 * Botón de llamada a la acción del sitio público.
 *
 * Los botones Fluent del sistema interno miden 32 px de alto, una escala
 * pensada para formularios densos. El marketing necesita objetivos más
 * grandes, así que este componente define su propia escala en lugar de
 * sobrescribir clases de `PrimaryButton` (evita choques de utilidades).
 *
 * @param {('primary'|'secondary'|'onDark'|'ghost')} [variant]
 * @param {('md'|'lg')} [size]
 * @param {string} [to]    Ruta interna (react-router).
 * @param {string} [href]  Enlace externo.
 */
const CtaButton = ({
  children,
  variant = 'primary',
  size = 'md',
  to,
  href,
  className = '',
  ...props
}) => {
  const base = `inline-flex items-center justify-center gap-2 rounded-lg font-semibold
    transition-all duration-150 whitespace-nowrap
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2`;

  const sizes = {
    md: 'h-10 px-5 text-sm',
    lg: 'h-12 px-7 text-base',
  };

  const variants = {
    primary: `bg-linear-to-r from-brand to-accent text-white shadow-md
              hover:shadow-lg hover:brightness-110 active:brightness-95`,
    secondary: `bg-surface text-ink border border-stroke shadow-sm
                hover:bg-surface-alt hover:border-brand hover:text-brand`,
    onDark: `bg-white text-brand-700 shadow-md hover:bg-brand-50
             focus-visible:ring-offset-transparent`,
    onDarkOutline: `border border-white/40 bg-white/10 text-white backdrop-blur-sm
                    hover:bg-white/20 focus-visible:ring-white focus-visible:ring-offset-transparent`,
    ghost: `text-ink-secondary border border-transparent
            hover:bg-brand-tint hover:text-brand-700`,
  };

  const classes = `${base} ${sizes[size]} ${variants[variant]} ${className}`;

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    );
  }

  return (
    <button type="button" className={classes} {...props}>
      {children}
    </button>
  );
};

export default CtaButton;
