/**
 * Proveedores y modelos de IA que el sistema puede usar.
 *
 * El catálogo vive en el frontend para que agregar un modelo sea editar esta
 * lista. Lo que se guarda de la configuración es el identificador del modelo,
 * así que un modelo retirado sigue mostrándose como "no reconocido" en vez de
 * romper la pantalla.
 */

export const PROVEEDORES = [
  {
    id: 'anthropic',
    nombre: 'Anthropic',
    descripcion: 'Familia Claude.',
    endpoint: 'https://api.anthropic.com/v1',
    formatoClave: 'sk-ant-…',
    docs: 'https://docs.anthropic.com',
    modelos: [
      {
        id: 'claude-opus-5',
        nombre: 'Claude Opus 5',
        nota: 'El más capaz. Para análisis y redacción exigentes.',
        recomendado: true,
      },
      {
        id: 'claude-sonnet-5',
        nombre: 'Claude Sonnet 5',
        nota: 'Equilibrio entre capacidad y costo. Buen valor por defecto.',
      },
      {
        id: 'claude-fable-5',
        nombre: 'Claude Fable 5',
        nota: 'Orientado a redacción de textos largos.',
      },
      {
        id: 'claude-haiku-4-5-20251001',
        nombre: 'Claude Haiku 4.5',
        nota: 'El más rápido y barato. Para clasificar y resumir en volumen.',
      },
    ],
  },
  {
    id: 'openai',
    nombre: 'OpenAI',
    descripcion: 'Familia GPT.',
    endpoint: 'https://api.openai.com/v1',
    formatoClave: 'sk-…',
    docs: 'https://platform.openai.com/docs',
    modelos: [
      { id: 'gpt-4.1', nombre: 'GPT-4.1', nota: 'Propósito general.' },
      { id: 'gpt-4.1-mini', nombre: 'GPT-4.1 mini', nota: 'Rápido y económico.' },
    ],
  },
  {
    id: 'azure-openai',
    nombre: 'Azure OpenAI',
    descripcion: 'Los modelos de OpenAI dentro del tenant de la empresa.',
    endpoint: 'https://<recurso>.openai.azure.com',
    formatoClave: 'clave del recurso',
    docs: 'https://learn.microsoft.com/azure/ai-services/openai/',
    // El nombre del despliegue lo define cada organización.
    modelos: [],
    despliegueLibre: true,
  },
];

/**
 * Tareas del sistema en las que se puede usar un modelo.
 *
 * Se declaran aparte del proveedor porque cada una puede apuntar a un modelo
 * distinto: no tiene sentido gastar el modelo más caro en clasificar
 * documentos.
 */
export const USOS = [
  {
    id: 'resumenExpediente',
    nombre: 'Resumen del expediente',
    descripcion:
      'Redacta un resumen del historial del colaborador para la ficha.',
    sugerido: 'calidad',
  },
  {
    id: 'clasificarDocumentos',
    nombre: 'Clasificación de documentos',
    descripcion:
      'Propone la categoría de un documento al subirlo al expediente.',
    sugerido: 'rapido',
  },
  {
    id: 'redaccionAcciones',
    nombre: 'Redacción de acciones de personal',
    descripcion: 'Sugiere el texto de la descripción a partir de unas notas.',
    sugerido: 'calidad',
  },
  {
    id: 'analisisAusentismo',
    nombre: 'Análisis de ausentismo',
    descripcion:
      'Interpreta las estadísticas de ausencias y señala lo que destaca.',
    sugerido: 'calidad',
  },
  {
    id: 'analisisPlanilla',
    nombre: 'Análisis de planilla',
    descripcion:
      'Revisa el periodo antes de aprobarlo: montos fuera de lo normal, ' +
      'variaciones contra el periodo anterior y datos que faltan.',
    sugerido: 'calidad',
  },
];

/** Ids de tarea, para no escribirlos a mano en cada pantalla. */
export const USO = {
  RESUMEN_EXPEDIENTE: 'resumenExpediente',
  CLASIFICAR_DOCUMENTOS: 'clasificarDocumentos',
  REDACCION_ACCIONES: 'redaccionAcciones',
  ANALISIS_AUSENTISMO: 'analisisAusentismo',
  ANALISIS_PLANILLA: 'analisisPlanilla',
};

export const CONFIG_POR_DEFECTO = {
  habilitado: false,
  proveedor: 'anthropic',
  endpoint: '',
  /** Modelo que usa cualquier tarea que no tenga uno propio. */
  modeloPorDefecto: 'claude-sonnet-5',
  /** `{ [usoId]: modeloId }`; lo que falte cae al modelo por defecto. */
  modelosPorUso: {},
  /** La clave nunca se guarda en el navegador salvo que se pida a propósito. */
  guardarClaveLocal: false,
};

export const buscarProveedor = (id) =>
  PROVEEDORES.find((p) => p.id === id) ?? PROVEEDORES[0];

export const buscarModelo = (proveedorId, modeloId) =>
  buscarProveedor(proveedorId).modelos.find((m) => m.id === modeloId) ?? null;

export default PROVEEDORES;
