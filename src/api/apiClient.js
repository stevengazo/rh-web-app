import axios from "axios"

class ApiClient {
  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_URL,
      headers: {
        "Content-Type": "application/json",
      },
    })

    // Interceptor REQUEST (agrega JWT)
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("token")

        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }

        return config
      },
      (error) => Promise.reject(error)
    )

    // Interceptor RESPONSE (manejo de errores)
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          console.error("No autorizado - token inválido o expirado")
          // Aquí luego podemos hacer logout automático
        }
        return Promise.reject(error)
      }
    )
  }

  // Métodos genéricos
  get(url, config = {}) {
    return this.client.get(url, config)
  }

  post(url, data, config = {}) {
    return this.client.post(url, data, config)
  }

  put(url, data, config = {}) {
    return this.client.put(url, data, config)
  }

  delete(url, config = {}) {
    return this.client.delete(url, config)
  }
}

// Singleton
export default new ApiClient()
