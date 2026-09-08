import axios from 'axios';

/**
 * La sesión ya no vive en `localStorage`: el login la deja en una cookie
 * httpOnly (ver `AuthenticationController`), que JavaScript no puede leer ni
 * adjuntar a mano — por eso `withCredentials: true` en vez del interceptor
 * que antes armaba el header `Authorization`. Es justo lo que mitiga el robo
 * de sesión por XSS que tenía el esquema anterior.
 */
class ApiClient {
  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_URL || '/api',
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    /** Se resuelve una sola vez aunque varias peticiones choquen con un 401 a la vez. */
    this.refrescando = null;
    /** Quien haya montado la sesión (`AppContext`) se entera de que ya no hay forma de renovarla. */
    this.onSessionExpired = null;

    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const { config, response } = error;

        const esAuthEndpoint = config?.url?.includes('/Authentication/');
        if (response?.status !== 401 || esAuthEndpoint || config?._reintentado) {
          return Promise.reject(error);
        }

        config._reintentado = true;

        try {
          this.refrescando ??= this.client
            .post('/Authentication/refresh')
            .finally(() => {
              this.refrescando = null;
            });

          await this.refrescando;
          return this.client(config);
        } catch (errorDeRefresh) {
          this.onSessionExpired?.();
          return Promise.reject(errorDeRefresh);
        }
      }
    );
  }

  // Métodos genéricos
  async get(url, config = {}) {
    const response = await this.client.get(url, config);
    return response;
  }

  async post(url, data, config = {}) {
    const response = await this.client.post(url, data, config);
    return response;
  }

  async put(url, data, config = {}) {
    const response = await this.client.put(url, data, config);
    return response;
  }

  async delete(url, config = {}) {
    const response = await this.client.delete(url, config);
    return response;
  }
}

// Singleton
export default new ApiClient();
