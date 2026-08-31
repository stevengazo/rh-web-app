import apiClient from './apiClient';

/**
 * Configuración del correo de salida (SMTP). Fila única en el servidor.
 * La contraseña nunca se devuelve; al guardar, `password: null` la deja como
 * estaba, `""` la borra y un texto la reemplaza.
 */
const emailSettingsApi = {
  get: () => apiClient.get('/EmailSettings'),
  update: (dto) => apiClient.put('/EmailSettings', dto),

  /** Envía un correo de prueba con la configuración vigente. */
  test: (to) => apiClient.post('/EmailSettings/test', { to }),
};

export default emailSettingsApi;
