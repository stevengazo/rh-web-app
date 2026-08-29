/**
 * Paletas del sistema.
 *
 * Todo el diseño se apoya en los tokens de `src/index.css`, así que cambiar
 * de paleta es reescribir un puñado de variables CSS sobre `<html>`: las ~90
 * pantallas se adaptan solas, sin tocar un solo componente.
 *
 * `claro` y `oscuro` no son temas: son el modo, que se sigue alternando con
 * la clase `.dark`. Un tema define su color de marca una sola vez y, aparte,
 * los neutrales de cada modo.
 *
 * ⚠️ **La marca no cambia entre modos, y es a propósito.** Los botones
 * primarios son `bg-brand text-white` y los distintivos son `bg-brand-tint
 * text-brand-700`; si la marca se aclarara en oscuro, el texto blanco dejaría
 * de leerse, y si el tinte se oscureciera, el texto oscuro del distintivo
 * también. Es el mismo criterio que ya seguía el tema original, donde el azul
 * y sus tintes son idénticos en claro y en oscuro.
 */

export const TEMA_POR_DEFECTO = 'fluent';

/** Genera la rampa de marca sin repetir diez variables por tema. */
const rampa = (tonos) =>
  Object.fromEntries(
    ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'].map(
      (t, i) => [`--color-brand-${t}`, tonos[i]]
    )
  );

export const TEMAS = [
  {
    id: 'fluent',
    nombre: 'Fluent',
    descripcion: 'El azul corporativo original, con acento violeta.',
    muestra: ['#0f6cbd', '#7c3aed', '#f5f5f5'],
    /* Sin overrides: es exactamente lo que declara `index.css`. */
    marca: {},
    claro: {},
    oscuro: {},
  },

  {
    id: 'teal',
    nombre: 'Teal cálido',
    descripcion: 'Verde azulado con acento ámbar y neutrales cálidos.',
    muestra: ['#0f766e', '#d97706', '#faf9f7'],
    marca: {
      ...rampa([
        '#f0fdfa', '#ccfbf1', '#99f6e4', '#5eead4', '#2dd4bf',
        '#14b8a6', '#0d9488', '#0f766e', '#115e59', '#134e4a',
      ]),
      '--color-brand': '#0f766e',
      '--color-brand-hover': '#115e59',
      '--color-brand-pressed': '#134e4a',
      '--color-brand-selected': '#134e4a',
      '--color-brand-tint': '#f0fdfa',
      '--color-accent': '#b45309',
      '--color-accent-strong': '#92400e',
      '--color-accent-tint': '#fffbeb',
    },
    claro: {
      '--color-brand-subtle': '#f4fbf9',
      '--color-canvas': '#faf9f7',
      '--color-surface-alt': '#f5f4f1',
      '--color-nav': '#14322f',
    },
    oscuro: {
      '--color-brand-subtle': '#1a2c2a',
      '--color-canvas': '#1a1917',
      '--color-surface': '#252321',
      '--color-surface-alt': '#302d2a',
      '--color-stroke': '#54504b',
      '--color-stroke-soft': '#3f3b37',
      '--color-nav': '#131211',
    },
  },

  {
    id: 'indigo',
    nombre: 'Índigo',
    descripcion: 'Azul profundo con acento rosa y neutrales fríos.',
    muestra: ['#4f46e5', '#db2777', '#f8fafc'],
    marca: {
      ...rampa([
        '#eef2ff', '#e0e7ff', '#c7d2fe', '#a5b4fc', '#818cf8',
        '#6366f1', '#4f46e5', '#4338ca', '#3730a3', '#312e81',
      ]),
      '--color-brand': '#4f46e5',
      '--color-brand-hover': '#4338ca',
      '--color-brand-pressed': '#3730a3',
      '--color-brand-selected': '#312e81',
      '--color-brand-tint': '#eef2ff',
      '--color-accent': '#db2777',
      '--color-accent-strong': '#be185d',
      '--color-accent-tint': '#fdf2f8',
    },
    claro: {
      '--color-brand-subtle': '#f3f5fe',
      '--color-canvas': '#f8fafc',
      '--color-surface-alt': '#f1f5f9',
      '--color-stroke': '#cbd5e1',
      '--color-stroke-soft': '#e2e8f0',
      '--color-nav': '#1e1b4b',
    },
    oscuro: {
      '--color-brand-subtle': '#1e253c',
      '--color-canvas': '#0f172a',
      '--color-surface': '#1e293b',
      '--color-surface-alt': '#273449',
      '--color-stroke': '#475569',
      '--color-stroke-soft': '#334155',
      '--color-ink': '#f1f5f9',
      '--color-ink-secondary': '#cbd5e1',
      '--color-ink-muted': '#94a3b8',
      '--color-nav': '#0b1120',
    },
  },

  {
    id: 'grafito',
    nombre: 'Grafito',
    descripcion: 'Casi monocromo: el color se reserva para montos y estados.',
    muestra: ['#3f3f46', '#047857', '#fafafa'],
    marca: {
      ...rampa([
        '#fafafa', '#f4f4f5', '#e4e4e7', '#d4d4d8', '#a1a1aa',
        '#71717a', '#52525b', '#3f3f46', '#27272a', '#18181b',
      ]),
      /* Gris oscuro y no negro puro: el botón primario tiene que despegarse
         del fondo también en modo oscuro, donde el canvas es casi negro. */
      '--color-brand': '#3f3f46',
      '--color-brand-hover': '#52525b',
      '--color-brand-pressed': '#27272a',
      '--color-brand-selected': '#18181b',
      '--color-brand-tint': '#f4f4f5',
      '--color-accent': '#047857',
      '--color-accent-strong': '#065f46',
      '--color-accent-tint': '#ecfdf5',
    },
    claro: {
      '--color-brand-subtle': '#f7f7f8',
      '--color-canvas': '#fafafa',
      '--color-surface-alt': '#f4f4f5',
      '--color-nav': '#18181b',
    },
    oscuro: {
      '--color-brand-subtle': '#242427',
      '--color-canvas': '#09090b',
      '--color-surface': '#18181b',
      '--color-surface-alt': '#232326',
      '--color-stroke': '#3f3f46',
      '--color-stroke-soft': '#27272a',
      '--color-nav': '#050506',
    },
  },

  {
    id: 'borgona',
    nombre: 'Borgoña',
    descripcion: 'Vino profundo con acento dorado. Sobrio y con carácter.',
    muestra: ['#9f1239', '#b45309', '#faf7f7'],
    marca: {
      ...rampa([
        '#fff1f2', '#ffe4e6', '#fecdd3', '#fda4af', '#fb7185',
        '#f43f5e', '#be123c', '#9f1239', '#881337', '#4c0519',
      ]),
      '--color-brand': '#9f1239',
      '--color-brand-hover': '#881337',
      '--color-brand-pressed': '#4c0519',
      '--color-brand-selected': '#4c0519',
      '--color-brand-tint': '#fff1f2',
      '--color-accent': '#b45309',
      '--color-accent-strong': '#92400e',
      '--color-accent-tint': '#fffbeb',
    },
    claro: {
      '--color-brand-subtle': '#fdf5f6',
      '--color-canvas': '#faf7f7',
      '--color-surface-alt': '#f5f0f1',
      '--color-nav': '#3b0a1c',
    },
    oscuro: {
      '--color-brand-subtle': '#2b1a1f',
      '--color-canvas': '#1a1618',
      '--color-surface': '#262022',
      '--color-surface-alt': '#312a2c',
      '--color-stroke': '#524749',
      '--color-stroke-soft': '#3d3436',
      '--color-nav': '#130f10',
    },
  },

  {
    id: 'bosque',
    nombre: 'Bosque',
    descripcion: 'Verde natural con acento terracota. Descansa la vista.',
    muestra: ['#15803d', '#c2410c', '#f7faf7'],
    marca: {
      ...rampa([
        '#f0fdf4', '#dcfce7', '#bbf7d0', '#86efac', '#4ade80',
        '#22c55e', '#16a34a', '#15803d', '#166534', '#14532d',
      ]),
      '--color-brand': '#15803d',
      '--color-brand-hover': '#166534',
      '--color-brand-pressed': '#14532d',
      '--color-brand-selected': '#14532d',
      '--color-brand-tint': '#f0fdf4',
      '--color-accent': '#c2410c',
      '--color-accent-strong': '#9a3412',
      '--color-accent-tint': '#fff7ed',
    },
    claro: {
      '--color-brand-subtle': '#f5faf6',
      '--color-canvas': '#f7faf7',
      '--color-surface-alt': '#f1f5f1',
      '--color-nav': '#12301d',
    },
    oscuro: {
      '--color-brand-subtle': '#1a2a1f',
      '--color-canvas': '#161a17',
      '--color-surface': '#212521',
      '--color-surface-alt': '#2b302c',
      '--color-stroke': '#4a524c',
      '--color-stroke-soft': '#373d38',
      '--color-nav': '#101210',
    },
  },

  {
    id: 'ocaso',
    nombre: 'Ocaso',
    descripcion: 'Naranja quemado con acento púrpura. La más cálida.',
    muestra: ['#c2410c', '#7e22ce', '#fdf9f6'],
    marca: {
      ...rampa([
        '#fff7ed', '#ffedd5', '#fed7aa', '#fdba74', '#fb923c',
        '#f97316', '#ea580c', '#c2410c', '#9a3412', '#7c2d12',
      ]),
      '--color-brand': '#c2410c',
      '--color-brand-hover': '#9a3412',
      '--color-brand-pressed': '#7c2d12',
      '--color-brand-selected': '#7c2d12',
      '--color-brand-tint': '#fff7ed',
      '--color-accent': '#7e22ce',
      '--color-accent-strong': '#6b21a8',
      '--color-accent-tint': '#faf5ff',
    },
    claro: {
      '--color-brand-subtle': '#fdf7f2',
      '--color-canvas': '#fdf9f6',
      '--color-surface-alt': '#f7f2ed',
      '--color-nav': '#3a1d0d',
    },
    oscuro: {
      '--color-brand-subtle': '#2d211a',
      '--color-canvas': '#1a1715',
      '--color-surface': '#26221f',
      '--color-surface-alt': '#312c28',
      '--color-stroke': '#524a44',
      '--color-stroke-soft': '#3d3733',
      '--color-nav': '#131110',
    },
  },

  {
    id: 'oceano',
    nombre: 'Océano',
    descripcion: 'Azul marino con acento cian. Serena y muy legible.',
    muestra: ['#1e40af', '#0891b2', '#f6f8fb'],
    marca: {
      ...rampa([
        '#eff6ff', '#dbeafe', '#bfdbfe', '#93c5fd', '#60a5fa',
        '#3b82f6', '#2563eb', '#1d4ed8', '#1e40af', '#1e3a8a',
      ]),
      '--color-brand': '#1e40af',
      '--color-brand-hover': '#1e3a8a',
      '--color-brand-pressed': '#172554',
      '--color-brand-selected': '#172554',
      '--color-brand-tint': '#eff6ff',
      '--color-accent': '#0891b2',
      '--color-accent-strong': '#0e7490',
      '--color-accent-tint': '#ecfeff',
    },
    claro: {
      '--color-brand-subtle': '#f4f7fd',
      '--color-canvas': '#f6f8fb',
      '--color-surface-alt': '#eff3f8',
      '--color-nav': '#101d3d',
    },
    oscuro: {
      '--color-brand-subtle': '#1a2135',
      '--color-canvas': '#12151c',
      '--color-surface': '#1c2028',
      '--color-surface-alt': '#262b35',
      '--color-stroke': '#454c59',
      '--color-stroke-soft': '#333944',
      '--color-nav': '#0c0e13',
    },
  },
];

/** Busca un tema por id, con respaldo al de por defecto. */
export const buscarTema = (id) =>
  TEMAS.find((t) => t.id === id) ??
  TEMAS.find((t) => t.id === TEMA_POR_DEFECTO);

/**
 * Variables que hay que escribir sobre `<html>` para un tema y un modo.
 *
 * El tema base no declara nada: sus overrides se limpian y vuelve a mandar
 * lo que dice `index.css`.
 */
export const variablesDe = (temaId, modo) => {
  const tema = buscarTema(temaId);
  return { ...tema.marca, ...(modo === 'dark' ? tema.oscuro : tema.claro) };
};

/** Todas las variables que un tema puede tocar; se usan para limpiar. */
export const VARIABLES_DE_TEMA = [
  ...new Set(
    TEMAS.flatMap((t) => [
      ...Object.keys(t.marca),
      ...Object.keys(t.claro),
      ...Object.keys(t.oscuro),
    ])
  ),
];

export default TEMAS;
