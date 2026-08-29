import {
  CONFIG_POR_DEFECTO,
  buscarProveedor,
} from '../data/modelosIa';

/**
 * Cliente de los modelos de IA.
 *
 * Llama al proveedor **desde el navegador**, con la configuración de
 * Ajustes → Inteligencia artificial.
 *
 * ⚠️ Eso implica que la clave viaja en el cliente. Es aceptable para probar
 * y para un despliegue interno, pero **en producción la llamada debería
 * pasar por la API**: basta con apuntar el endpoint a un proxy propio y
 * dejar la clave del lado del servidor. El código está preparado para eso —
 * si el endpoint configurado no es el del proveedor, no se manda ninguna
 * clave desde aquí.
 */

const CLAVE_CONFIG = 'rh:ia-config';
const CLAVE_SECRETO = 'rh:ia-clave';

const leerJson = (clave, respaldo) => {
  try {
    const guardado = localStorage.getItem(clave);
    return guardado ? JSON.parse(guardado) : respaldo;
  } catch {
    return respaldo;
  }
};

/** Configuración vigente, con los valores por defecto rellenados. */
export const configIa = () => ({
  ...CONFIG_POR_DEFECTO,
  ...leerJson(CLAVE_CONFIG, {}),
});

const claveIa = () => {
  try {
    return localStorage.getItem(CLAVE_SECRETO) ?? '';
  } catch {
    return '';
  }
};

/** Modelo que corresponde a una tarea, con respaldo al modelo por defecto. */
export const modeloPara = (uso) => {
  const config = configIa();
  return config.modelosPorUso?.[uso] || config.modeloPorDefecto;
};

/**
 * ¿Se puede usar la IA ahora mismo?
 *
 * @returns {{listo: boolean, motivo?: string}}
 */
export const estadoIa = () => {
  const config = configIa();

  if (!config.habilitado) {
    return {
      listo: false,
      motivo: 'Las funciones con IA están apagadas en Configuración.',
    };
  }

  if (!config.modeloPorDefecto) {
    return { listo: false, motivo: 'Falta elegir un modelo en Configuración.' };
  }

  const proveedor = buscarProveedor(config.proveedor);
  const propio = config.endpoint && !config.endpoint.startsWith(proveedor.endpoint);

  if (!propio && !claveIa()) {
    return {
      listo: false,
      motivo:
        'Falta la clave de API. Guárdala en Configuración o apunta el endpoint a un proxy propio.',
    };
  }

  return { listo: true };
};

/* ------------------------------------------------------------------
   Traducción al formato de cada proveedor.

   Los tres hablan JSON pero con formas distintas; se normaliza aquí para
   que las pantallas solo pidan "texto a partir de este prompt".
   ------------------------------------------------------------------ */

const PETICION = {
  anthropic: ({ base, modelo, sistema, prompt, maxTokens, clave }) => ({
    url: `${base}/messages`,
    headers: {
      'content-type': 'application/json',
      ...(clave
        ? {
            'x-api-key': clave,
            'anthropic-version': '2023-06-01',
            // Sin esto el navegador recibe un CORS del propio proveedor.
            'anthropic-dangerous-direct-browser-access': 'true',
          }
        : {}),
    },
    body: {
      model: modelo,
      max_tokens: maxTokens,
      system: sistema,
      messages: [{ role: 'user', content: prompt }],
    },
    leer: (datos) =>
      (datos?.content ?? [])
        .filter((b) => b.type === 'text')
        .map((b) => b.text)
        .join('\n')
        .trim(),
  }),

  openai: ({ base, modelo, sistema, prompt, maxTokens, clave }) => ({
    url: `${base}/chat/completions`,
    headers: {
      'content-type': 'application/json',
      ...(clave ? { authorization: `Bearer ${clave}` } : {}),
    },
    body: {
      model: modelo,
      max_tokens: maxTokens,
      messages: [
        { role: 'system', content: sistema },
        { role: 'user', content: prompt },
      ],
    },
    leer: (datos) => datos?.choices?.[0]?.message?.content?.trim() ?? '',
  }),
};

/* Azure habla el formato de OpenAI, solo cambia la ruta y la cabecera. */
PETICION['azure-openai'] = ({ base, modelo, sistema, prompt, maxTokens, clave }) => ({
  url: `${base}/openai/deployments/${modelo}/chat/completions?api-version=2024-06-01`,
  headers: {
    'content-type': 'application/json',
    ...(clave ? { 'api-key': clave } : {}),
  },
  body: {
    max_tokens: maxTokens,
    messages: [
      { role: 'system', content: sistema },
      { role: 'user', content: prompt },
    ],
  },
  leer: (datos) => datos?.choices?.[0]?.message?.content?.trim() ?? '',
});

/**
 * Pide un texto al modelo configurado para una tarea.
 *
 * @param {object} opciones
 * @param {string} opciones.uso        Id de `USO`.
 * @param {string} opciones.sistema    Instrucción de rol.
 * @param {string} opciones.prompt     Los datos y la petición concreta.
 * @param {number} [opciones.maxTokens]
 * @param {AbortSignal} [opciones.signal]
 * @returns {Promise<string>}
 */
export const pedirTexto = async ({
  uso,
  sistema,
  prompt,
  maxTokens = 1200,
  signal,
}) => {
  const estado = estadoIa();
  if (!estado.listo) throw new Error(estado.motivo);

  const config = configIa();
  const proveedor = buscarProveedor(config.proveedor);
  const base = (config.endpoint || proveedor.endpoint).replace(/\/$/, '');

  /* Con un endpoint propio no se manda la clave: se asume que el proxy la
     pone del lado del servidor, que es donde debe estar. */
  const usaProveedor = base.startsWith(proveedor.endpoint.replace(/\/$/, ''));
  const clave = usaProveedor ? claveIa() : '';

  const armar = PETICION[config.proveedor];
  if (!armar) throw new Error('Proveedor no soportado.');

  const { url, headers, body, leer } = armar({
    base,
    modelo: modeloPara(uso),
    sistema,
    prompt,
    maxTokens,
    clave,
  });

  const respuesta = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
    signal,
  });

  if (!respuesta.ok) {
    const detalle = await respuesta.text().catch(() => '');
    throw new Error(
      `El proveedor respondió ${respuesta.status}. ${detalle.slice(0, 200)}`
    );
  }

  const texto = leer(await respuesta.json());

  if (!texto) throw new Error('El modelo devolvió una respuesta vacía.');

  return texto;
};

export default pedirTexto;
