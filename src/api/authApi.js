import apiClient from "./apiClient";

/**
 * Realiza una solicitud de autenticación (login).
 *
 * @function loginRequest
 * @param {Object} credentials - Credenciales del usuario.
 * @param {string} credentials.email - Correo electrónico del usuario.
 * @param {string} credentials.password - Contraseña del usuario.
 *
 * @returns {Promise} Promesa con la respuesta del servidor.
 * - En caso de éxito devuelve los datos del usuario y/o token de autenticación.
 * - En caso de error devuelve el error correspondiente.
 */
const loginRequest = (credentials) => {
    return apiClient.post("/Authentication/login", credentials);
};

/**
 * Realiza una solicitud de registro de usuario.
 *
 * @function registerRequest
 * @param {Object} registerUser - Datos del nuevo usuario.
 * @param {string} registerUser.name - Nombre completo del usuario.
 * @param {string} registerUser.email - Correo electrónico del usuario.
 * @param {string} registerUser.password - Contraseña del usuario.
 *
 * @returns {Promise} Promesa con la respuesta del servidor.
 * - En caso de éxito devuelve el usuario creado.
 * - En caso de error devuelve el detalle del error.
 */
const registerRequest = (registerUser) => {
    return apiClient.post("/Authentication/register", registerUser);
};

export {
    loginRequest,
    registerRequest
};
