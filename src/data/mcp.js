/**
 * Model Context Protocol (MCP).
 *
 * Dos caras, y conviene no confundirlas:
 *
 * - **Servidores** que este sistema *consume*: le dan al asistente acceso a
 *   herramientas de fuera (un calendario, un repositorio de documentos).
 * - **El servidor que este sistema *expone*:** deja que un asistente externo
 *   —Claude Desktop, un agente propio— consulte el sistema de RR.HH. Aquí se
 *   elige qué herramientas quedan disponibles y con qué permisos.
 */

export const TRANSPORTES = [
  {
    id: 'stdio',
    nombre: 'stdio',
    descripcion: 'Proceso local. El cliente lanza el servidor como subproceso.',
  },
  {
    id: 'http',
    nombre: 'HTTP (streamable)',
    descripcion: 'Servidor remoto por HTTP. Es el que se usa entre máquinas.',
  },
  {
    id: 'sse',
    nombre: 'SSE',
    descripcion: 'Transporte HTTP antiguo; solo para clientes que no soportan streamable.',
  },
];

/*
 * El catálogo de herramientas y la configuración del servidor **los define la
 * API** (`GET /api/Mcp/tools` y `/api/Mcp/config`): es quien las implementa.
 * Tenerlos también aquí solo garantizaba que un día dejaran de coincidir.
 *
 * Lo que queda son los transportes de los servidores que este sistema
 * *consume*, que sí es configuración del cliente.
 */

export const servidorNuevo = () => ({
  id: crypto.randomUUID(),
  nombre: '',
  transporte: 'http',
  url: '',
  comando: '',
  autenticacion: 'ninguna',
  token: '',
  activo: true,
});


/**
 * Fragmento de `claude_desktop_config.json` para conectarse a este sistema.
 *
 * @param {object} config Respuesta de `GET /api/Mcp/config`.
 * @param {string} base   Origen desde el que se sirve la API.
 */
export const ejemploConexion = (config, base) => {
  const url = `${base.replace(/\/$/, '')}${config.endpoint ?? '/mcp'}`;

  return JSON.stringify(
    {
      mcpServers: {
        [config.serverName || 'rh-sistema']: {
          type: 'http',
          url,
          ...(config.hasToken
            ? { headers: { Authorization: 'Bearer <token>' } }
            : {}),
        },
      },
    },
    null,
    2
  );
};
