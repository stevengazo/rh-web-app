import apiClient from './apiClient';

/**
 * Personalización de la interfaz por colaborador (tema, modo, acento, opacidad
 * del fondo). La imagen de fondo se sube aparte con `FileApi`
 * (`TableName = 'ProfileBackground'`).
 *
 * Devuelven la respuesta Axios completa (convención del repo).
 */
const userPreferencesApi = {
  /** Preferencias del colaborador; `data` es `null` si no tiene ninguna. */
  getForUser: (userId) => apiClient.get(`/UserPreferences/user/${userId}`),

  /**
   * Crea o actualiza (upsert) las preferencias del colaborador.
   * @param {{ themeId?, mode?, accentColor?, backgroundOpacity?, settingsJson? }} dto
   */
  saveForUser: (userId, dto) =>
    apiClient.put(`/UserPreferences/user/${userId}`, dto),
};

export default userPreferencesApi;
