import { Moon, Sun } from 'lucide-react';

import useTheme from '../hooks/useTheme';

/**
 * Alterna entre modo claro y oscuro.
 *
 * El estado ya no vive aquí: lo lleva `useTheme`, que también gobierna la
 * paleta. Antes este componente era el único dueño del modo, así que el
 * selector de temas de Ajustes no se enteraba de sus cambios (ni al revés).
 *
 * @param {('light'|'dark')} [variant] Estilo del botón según el fondo donde
 *        vive ('dark' = barras oscuras, 'light' = superficies claras).
 */
const ThemeToggle = ({ variant = 'light', className = '' }) => {
  const { modo, alternarModo } = useTheme();

  const isDark = modo === 'dark';

  const styles =
    variant === 'dark'
      ? 'text-gray-300 hover:bg-white/10 hover:text-white'
      : 'text-ink-muted hover:bg-canvas hover:text-ink';

  return (
    <button
      type="button"
      onClick={alternarModo}
      aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      title={isDark ? 'Modo claro' : 'Modo oscuro'}
      className={`grid h-9 w-9 shrink-0 place-items-center rounded-md transition-colors
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand
                  ${styles} ${className}`}
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
};

export default ThemeToggle;
