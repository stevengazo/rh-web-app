import axios from 'axios';

class ApiClient {
  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_URL,
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
          console.error('No autorizado - token inválido o expirado');
          // Aquí luego podemos hacer logout automático
        }
        return Promise.reject(error);
      }
    );
  }

  // Métodos genéricos
  async get(url, config = {}) {
    try {
      const response = await this.client.get(url, config);
      return response;
    } catch (error) {
      console.error('GET error:', error.response?.data || error.message);
      throw error;
    }
  }

  async post(url, data, config = {}) {
    try {
      const response = await this.client.post(url, data, config);
      return response;
    } catch (error) {
      console.error('POST error:', error.response?.data || error.message);
      throw error;
    }
  }

  async put(url, data, config = {}) {
    try {
      const response = await this.client.put(url, data, config);
      return response;
    } catch (error) {
      console.error('PUT error:', error.response?.data || error.message);
      throw error;
    }
  }

  async delete(url, config = {}) {
    try {
      const response = await this.client.delete(url, config);
      return response;
    } catch (error) {
      console.error('DELETE error:', error.response?.data || error.message);
      throw error;
    }
  }
}

// Singleton
export default new ApiClient();
