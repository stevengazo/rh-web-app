import axios from 'axios';

class ApiClient {
  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_URL || '/api',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Interceptor REQUEST (agrega JWT)
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Interceptor RESPONSE (manejo de errores)
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Aquí luego podemos hacer logout automático
        }
        return Promise.reject(error);
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
