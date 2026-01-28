import apiClient from './apiClient';

/**
 * CourseApi
 *
 * Módulo de acceso a la API para la gestión de cursos.
 *
 * Permite:
 *  - Listar cursos
 *  - Obtener un curso por ID
 *  - Obtener cursos por usuario
 *  - Crear cursos
 *  - Actualizar cursos
 *  - Eliminar cursos
 *
 * Endpoints base:
 *  /api/Courses
 */
const courseApi = {
  /**
   * getAllCourses
   *
   * Obtiene todos los cursos registrados.
   *
   * Endpoint:
   *  GET /api/Courses
   *
   * @returns {Promise<import("axios").AxiosResponse>}
   */
  getAllCourses: () => {
    return apiClient.get('/courses');
  },

  /**
   * getCourseById
   * =======
   * Obtiene un curso específico por su ID.
   *
   * Endpoint:
   *  GET /api/Courses/{id}
   *
   * @param {number|string} id - Identificador del curso
   * @returns {Promise<import("axios").AxiosResponse>}
   */
  getCourseById: (id) => {
    return apiClient.get(`/courses/${id}`);
  },

  /**
   * getCoursesByUser
   * =====================================================
   * Obtiene todos los cursos asociados a un usuario.
   *
   * Endpoint:
   *  GET /api/Courses/user/{userId}
   *
   * @param {string} userId - Identificador del usuario
   * @returns {Promise<import("axios").AxiosResponse>}
   */
  getCoursesByUser: (userId) => {
    return apiClient.get(`/Courses/user/${userId}`);
  },

  /**
   * createCourse
   * =====================================================
   * Crea un nuevo curso.
   *
   * Endpoint:
   *  POST /api/Courses
   *
   * @param {Object} course - Datos del curso
   * @returns {Promise<import("axios").AxiosResponse>}
   */
  createCourse: (course) => {
    return apiClient.post('/courses', course);
  },

  /**
   * updateCourse
   * =====================================================
   * Actualiza un curso existente.
   *
   * Endpoint:
   *  PUT /api/Courses/{id}
   *
   * @param {number|string} id - Identificador del curso
   * @param {Object} course - Datos actualizados
   * @returns {Promise<import("axios").AxiosResponse>}
   */
  updateCourse: (id, course) => {
    return apiClient.put(`/courses/${id}`, course);
  },

  /**

   * deleteCourse
   * =====================================================
   * Elimina un curso por su ID.
   *
   * Endpoint:
   *  DELETE /api/Courses/{id}
   *
   * @param {number|string} id - Identificador del curso
   * @returns {Promise<import("axios").AxiosResponse>}
   */
  deleteCourse: (id) => {
    return apiClient.delete(`/courses/${id}`);
  },
};

export default courseApi;
