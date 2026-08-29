import apiClient from '../api/apiClient';

/**
 * Convierte la ruta de un archivo devuelta por la API en una URL utilizable.
 *
 * La API guarda las rutas como `/files/<archivo>` y al responder las vuelve
 * absolutas usando el encabezado `Host` de la petición. Detrás de un proxy eso
 * es frágil (llegó a devolver `http://localhost/...`, sin el puerto), así que
 * aquí se descarta el host que venga y se reconstruye contra el origen que
 * corresponde:
 *
 *  - `npm run dev`: la API vive en otro puerto (`VITE_API_URL`); se usa ese origen.
 *  - Contenedor: la base es `/api`, mismo origen que la web, y Nginx enruta
 *    `/files/` hacia la API; basta la ruta relativa.
 *
 * @param {string} [ruta]
 * @returns {string|null}
 */
export const urlDeArchivo = (ruta) => {
  if (!ruta) return null;

  // Se conserva solo la ruta; el host que declare la API se ignora.
  let camino = ruta;
  if (/^https?:\/\//i.test(ruta)) {
    try {
      camino = new URL(ruta).pathname;
    } catch {
      return ruta;
    }
  }
  if (!camino.startsWith('/')) camino = `/${camino}`;

  const base = apiClient.client?.defaults?.baseURL ?? '/api';

  // Base relativa (`/api`) → mismo origen que la página
  if (!/^https?:\/\//i.test(base)) return camino;

  try {
    return `${new URL(base).origin}${camino}`;
  } catch {
    return camino;
  }
};

export default urlDeArchivo;
