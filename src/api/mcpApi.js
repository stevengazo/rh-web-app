import apiClient from './apiClient';

/**
 * Servidor MCP que este sistema expone.
 *
 * El catálogo de herramientas lo define el backend, que es quien las
 * implementa: el frontend solo elige cuáles quedan habilitadas.
 */
const mcpApi = {
  /** Todas las herramientas que el servidor sabe ejecutar. */
  getTools: () => apiClient.get('/Mcp/tools'),

  getConfig: () => apiClient.get('/Mcp/config'),

  /**
   * @param {object} config
   * @param {string|null} [config.token] `null` deja el token como estaba;
   *        cadena vacía lo borra.
   */
  updateConfig: (config) => apiClient.put('/Mcp/config', config),
};

export default mcpApi;
