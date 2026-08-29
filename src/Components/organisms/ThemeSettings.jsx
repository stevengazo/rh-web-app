import { Check, Moon, Sun } from 'lucide-react';

import useTheme from '../../hooks/useTheme';
import { TEMAS } from '../../data/temas';

/** Vista en miniatura de cómo queda una pantalla con ese tema. */
const Miniatura = ({ tema, modo }) => {
  const [marca, acento, fondoClaro] = tema.muestra;

  const fondo = modo === 'dark' ? '#1b1b1b' : fondoClaro;
  const superficie = modo === 'dark' ? '#292929' : '#ffffff';
  const linea = modo === 'dark' ? '#3d3d3d' : '#e0e0e0';

  /* Se pintan con estilos en línea y no con tokens a propósito: la miniatura
     tiene que mostrar *otro* tema, no el que está activo. */
  return (
    <div
      className="flex h-24 w-full gap-1.5 overflow-hidden rounded-lg border p-1.5"
      style={{ background: fondo, borderColor: linea }}
    >
      {/* Barra lateral */}
      <div
        className="w-1/4 rounded"
        style={{ background: `linear-gradient(160deg, ${marca}, ${acento})` }}
      />

      <div className="flex flex-1 flex-col gap-1.5">
        <div
          className="flex items-center gap-1 rounded px-1.5 py-1"
          style={{ background: superficie, border: `1px solid ${linea}` }}
        >
          <span
            className="h-1.5 w-8 rounded-full"
            style={{ background: marca }}
          />
          <span
            className="h-1.5 w-4 rounded-full"
            style={{ background: acento }}
          />
        </div>

        <div
          className="flex-1 rounded p-1.5"
          style={{ background: superficie, border: `1px solid ${linea}` }}
        >
          <div className="space-y-1">
            {[80, 60, 70].map((ancho, i) => (
              <span
                key={i}
                className="block h-1 rounded-full"
                style={{
                  width: `${ancho}%`,
                  background: modo === 'dark' ? '#3d3d3d' : '#e5e5e5',
                }}
              />
            ))}
          </div>

          <span
            className="mt-1.5 block h-3 w-10 rounded"
            style={{ background: marca }}
          />
        </div>
      </div>
    </div>
  );
};

/**
 * Selector de paleta y de modo claro/oscuro.
 *
 * El cambio se aplica al instante sobre toda la aplicación: el sistema está
 * construido con tokens, así que la paleta se reescribe sobre `<html>` y las
 * pantallas se adaptan solas.
 */
const ThemeSettings = () => {
  const { tema, modo, setTema, setModo } = useTheme();

  return (
    <div className="space-y-6">
      {/* Modo */}
      <section>
        <h3 className="text-sm font-semibold text-ink">Modo</h3>
        <p className="mt-0.5 text-sm text-ink-muted">
          Se guarda en este navegador. También está el botón del encabezado.
        </p>

        <div className="mt-3 inline-flex rounded-lg border border-stroke-soft bg-surface p-1">
          {[
            { id: 'light', label: 'Claro', icon: Sun },
            { id: 'dark', label: 'Oscuro', icon: Moon },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setModo(id)}
              aria-pressed={modo === id}
              className={`inline-flex items-center gap-2 rounded px-4 py-1.5 text-sm font-semibold transition-colors
                ${
                  modo === id
                    ? 'bg-brand-tint text-brand-700'
                    : 'text-ink-muted hover:text-ink'
                }`}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>
      </section>

      {/* Paleta */}
      <section>
        <h3 className="text-sm font-semibold text-ink">Paleta</h3>
        <p className="mt-0.5 text-sm text-ink-muted">
          Cambia los colores de todo el sistema. Se aplica al momento.
        </p>

        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {TEMAS.map((t) => {
            const activo = t.id === tema;

            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTema(t.id)}
                aria-pressed={activo}
                className={`rounded-xl border p-3 text-left transition-all
                  hover:-translate-y-0.5 hover:shadow-md
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand
                  ${
                    activo
                      ? 'border-brand ring-1 ring-brand'
                      : 'border-stroke-soft'
                  }`}
              >
                <Miniatura tema={t} modo={modo} />

                <div className="mt-3 flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-ink">
                      {t.nombre}
                    </p>
                    <p className="mt-0.5 text-xs leading-snug text-ink-muted">
                      {t.descripcion}
                    </p>
                  </div>

                  {activo && (
                    <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand text-white">
                      <Check size={12} />
                    </span>
                  )}
                </div>

                <div className="mt-2 flex gap-1">
                  {t.muestra.map((color) => (
                    <span
                      key={color}
                      className="h-4 flex-1 rounded"
                      style={{ background: color }}
                    />
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <p className="rounded-lg bg-surface-alt p-3 text-xs text-ink-muted">
        La preferencia se guarda en este navegador, no en el servidor: cada
        persona elige la suya y no afecta a los demás.
      </p>
    </div>
  );
};

export default ThemeSettings;
