import apiClient from "./apiClient";

/**
 * =====================================================
 * CertificationApi
 * =====================================================
 * Módulo de acceso a la API para la gestión de certificaciones.
 *
 * Permite:
 *  - Listar certificaciones
 *  - Obtener una certificación por ID
 *  - Obtener certificaciones por usuario
 *  - Crear certificaciones
 *  - Actualizar certificaciones
 *  - Eliminar certificaciones
 *
 * Endpoints base:
 *  /api/Certifications
 */
const certificationApi = {
  /**
   * =====================================================
   * getAllCertifications
   * =====================================================
   * Obtiene todas las certificaciones registradas.
   *
   * Endpoint:
   *  GET /api/Certifications
   *
   * @returns {Promise<import("axios").AxiosResponse>}
   */
  getAllCertifications: () => {
    return apiClient.get("/certifications");
  },

  /**
   * =====================================================
   * getCertificationById
   * =====================================================
   * Obtiene una certificación específica por su ID.
   *
   * Endpoint:
   *  GET /api/Certifications/{id}
   *
   * @param {number|string} id - Identificador de la certificación
   * @returns {Promise<import("axios").AxiosResponse>}
   */
  getCertificationById: (id) => {
    return apiClient.get(`/certifications/${id}`);
  },

  /**
   * =====================================================
   * getCertificationsByUser
   * =====================================================
   * Obtiene todas las certificaciones asociadas a un usuario.
   *
   * Endpoint:
   *  GET /api/Certifications/user/{userId}
   *
   * @param {string} userId - Identificador del usuario
   * @returns {Promise<import("axios").AxiosResponse>}
   */
  getCertificationsByUser: (userId) => {
    return apiClient.get(`/certifications/user/${userId}`);
  },

  /**
   * =====================================================
   * createCertification
   * =====================================================
   * Crea una nueva certificación.
   *
   * Endpoint:
   *  POST /api/Certifications
   *
   * @param {Object} certification - Datos de la certificación
   * @returns {Promise<import("axios").AxiosResponse>}
   */
  createCertification: (certification) => {
    return apiClient.post("/certifications", certification);
  },

  /**
   * =====================================================
   * updateCertification
   * =====================================================
   * Actualiza una certificación existente.
   *
   * Endpoint:
   *  PUT /api/Certifications/{id}
   *
   * @param {number|string} id - Identificador de la certificación
   * @param {Object} certification - Datos actualizados
   * @returns {Promise<import("axios").AxiosResponse>}
   */
  updateCertification: (id, certification) => {
    return apiClient.put(`/certifications/${id}`, certification);
  },

  /**
   * =====================================================
   * deleteCertification
   * =====================================================
   * Elimina una certificación por su ID.
   *
   * Endpoint:
   *  DELETE /api/Certifications/{id}
   *
   * @param {number|string} id - Identificador de la certificación
   * @returns {Promise<import("axios").AxiosResponse>}
   */
  deleteCertification: (id) => {
    return apiClient.delete(`/certifications/${id}`);
  },
};

export default certificationApi;
