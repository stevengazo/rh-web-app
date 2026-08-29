/**
 * Botón de acción dentro de una fila de tabla.
 *
 * Unifica el tamaño, el color y el foco de los iconos de "ver", "editar" y
 * "eliminar", que hasta ahora cada tabla resolvía a su manera.
 *
 * @param {import('lucide-react').LucideIcon} icon
 * @param {string} label            Se usa como tooltip y etiqueta accesible.
 * @param {() => void} onClick
 * @param {('default'|'brand'|'danger')} [tono]
 */
const RowActionButton = ({
  icon: Icon,
  label,
  onClick,
  tono = 'default',
  disabled = false,
}) => {
  const tonos = {
    default: 'text-ink-muted hover:bg-canvas hover:text-ink',
    brand: 'text-ink-muted hover:bg-brand-tint hover:text-brand',
    danger: 'text-ink-muted hover:bg-red-50 hover:text-red-600',
  };

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation(); // no dispara el clic de la fila
        onClick?.();
      }}
      disabled={disabled}
      title={label}
      aria-label={label}
      className={`grid h-8 w-8 place-items-center rounded-md transition-colors
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand
                  disabled:cursor-not-allowed disabled:opacity-40 ${tonos[tono]}`}
    >
      <Icon size={16} />
    </button>
  );
};

export default RowActionButton;
