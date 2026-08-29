import { PRODUCTO } from '../data/marketing';

/**
 * Marca del sistema.
 *
 * El isotipo son tres siluetas —una organización— dentro de un cuadro
 * redondeado con el degradado de marca. Se dibuja en SVG y no como imagen
 * para que herede los colores del tema activo: cambiar de paleta en Ajustes
 * cambia también el logo, sin exportar un archivo por tema.
 *
 * El nombre lo toma de `PRODUCTO`, para que cambiarlo sea editar un solo
 * archivo y no rastrear dónde quedó escrito a mano.
 *
 * @param {('completo'|'iso')} [variante] `iso` es solo el símbolo, para el
 *        menú plegado y para los sitios donde no cabe el nombre.
 * @param {number} [size] Lado del símbolo en píxeles.
 * @param {('claro'|'oscuro')} [sobre] Fondo sobre el que se dibuja el texto.
 */
const Logo = ({
  variante = 'completo',
  size = 32,
  sobre = 'oscuro',
  className = '',
}) => {
  /* El id del degradado tiene que ser único: si hay dos logos en la página
     con el mismo id, el segundo reutiliza el degradado del primero. */
  const gradId = `logo-grad-${variante}-${size}-${sobre}`;

  const simbolo = (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      role="img"
      aria-label="Logotipo del sistema de recursos humanos"
      className="shrink-0"
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="32" y2="32">
          <stop offset="0%" stopColor="var(--color-brand)" />
          <stop offset="100%" stopColor="var(--color-accent)" />
        </linearGradient>
      </defs>

      <rect width="32" height="32" rx="9" fill={`url(#${gradId})`} />

      {/* Figura central, un poco más grande: es la jefatura */}
      <circle cx="16" cy="12" r="3.6" fill="white" />
      <path
        d="M9.6 23.2c0-3.2 2.9-5.2 6.4-5.2s6.4 2 6.4 5.2v.6a.6.6 0 0 1-.6.6H10.2a.6.6 0 0 1-.6-.6v-.6Z"
        fill="white"
      />

      {/* Las dos laterales, atenuadas: el equipo */}
      <circle cx="7.4" cy="14.4" r="2.5" fill="white" fillOpacity="0.65" />
      <path
        d="M2.8 22.6c0-2.3 2-3.8 4.6-3.8.5 0 1 .06 1.5.18-1.2 1.1-1.9 2.5-1.9 4.2v.6H3.4a.6.6 0 0 1-.6-.6v-.6Z"
        fill="white"
        fillOpacity="0.65"
      />

      <circle cx="24.6" cy="14.4" r="2.5" fill="white" fillOpacity="0.65" />
      <path
        d="M29.2 22.6c0-2.3-2-3.8-4.6-3.8-.5 0-1 .06-1.5.18 1.2 1.1 1.9 2.5 1.9 4.2v.6h3.6a.6.6 0 0 0 .6-.6v-.6Z"
        fill="white"
        fillOpacity="0.65"
      />
    </svg>
  );

  if (variante === 'iso') {
    return <span className={className}>{simbolo}</span>;
  }

  const colorNombre = sobre === 'oscuro' ? 'text-white' : 'text-ink';
  const colorBajada = sobre === 'oscuro' ? 'text-white/55' : 'text-ink-muted';

  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      {simbolo}

      <span className="min-w-0 leading-none">
        <span
          className={`block truncate text-[15px] font-semibold tracking-tight ${colorNombre}`}
        >
          {PRODUCTO.nombre}
        </span>
        <span
          className={`mt-0.5 block truncate text-[10px] font-medium uppercase tracking-[0.14em] ${colorBajada}`}
        >
          Recursos Humanos
        </span>
      </span>
    </span>
  );
};

export default Logo;
