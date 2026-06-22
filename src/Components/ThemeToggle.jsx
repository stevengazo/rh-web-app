import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

const getInitialTheme = () => {
  try {
    const stored = localStorage.getItem('theme');
    if (stored === 'dark' || stored === 'light') return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  } catch {
    return 'light';
  }
};

const applyTheme = (theme) => {
  const root = document.documentElement;
  root.classList.toggle('dark', theme === 'dark');
  root.style.colorScheme = theme;
};

/**
 * Alterna el tema claro/oscuro de todo el sistema.
 * Persiste la preferencia en localStorage y aplica la clase `dark` a <html>.
 *
 * @param {('light'|'dark')} [variant] Estilo del botón según el fondo donde vive
 *        ('dark' = barras oscuras, 'light' = superficies claras).
 */
const ThemeToggle = ({ variant = 'light', className = '' }) => {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    applyTheme(theme);
    try {
      localStorage.setItem('theme', theme);
    } catch {
      /* ignore */
    }
  }, [theme]);

  const isDark = theme === 'dark';

  const styles =
    variant === 'dark'
      ? 'text-gray-300 hover:bg-white/10 hover:text-white'
      : 'text-ink-muted hover:bg-canvas hover:text-ink';

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      aria-label="Cambiar tema"
      className={`grid h-9 w-9 shrink-0 place-items-center rounded-md transition-colors
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-1
        ${styles} ${className}`}
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
};

export default ThemeToggle;
