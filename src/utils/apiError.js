/**
 * Extrae el mensaje de error que devuelve la API.
 *
 * El backend responde 409 con una frase lista para mostrar cuando se viola una
 * restricción de la base de datos ("Ya existe un departamento con ese nombre",
 * "No se puede eliminar: hay registros asociados…"). Este helper la recupera y,
 * si no viene nada aprovechable, cae al texto por defecto.
 *
 * @param {unknown} error        Error de Axios.
 * @param {string} porDefecto    Mensaje a usar si la API no envió uno.
 * @returns {string}
 */
export const mensajeDeError = (error, porDefecto) => {
  const data = error?.response?.data;

  if (typeof data === 'string' && data.trim()) return data;

  // ASP.NET puede envolverlo en un ProblemDetails
  if (data && typeof data === 'object') {
    if (typeof data.detail === 'string' && data.detail.trim()) return data.detail;
    if (typeof data.title === 'string' && data.title.trim()) return data.title;
  }

  return porDefecto;
};

export default mensajeDeError;
