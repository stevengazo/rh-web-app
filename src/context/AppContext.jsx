import { createContext, useContext, useState } from "react";

/**
 * =====================================================
 * AppContext
 * =====================================================
 * Contexto global de la aplicación.
 * Se utiliza para manejar:
 *  - Autenticación del usuario
 *  - Token JWT
 *  - Estado de sesión
 */
const AppContext = createContext();

/**
 * =====================================================
 * AppProvider
 * =====================================================
 * Componente Provider que envuelve la aplicación
 * y expone el estado global a todos los componentes hijos.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Componentes hijos
 */
export const AppProvider = ({ children }) => {
  /**
   * Usuario autenticado
   * @type {[Object|null, Function]}
   */
  const [user, setUser] = useState(null);

  /**
   * Indica si el usuario está autenticado
   * @type {[boolean, Function]}
   */
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  /**
   * Token JWT del usuario
   * @type {[string|null, Function]}
   */
  const [token, setToken] = useState(null);

  /**
   * =====================================================
   * login
   * =====================================================
   * Guarda el token JWT, actualiza el estado de autenticación
   * y persiste el token en localStorage.
   *
   * @param {string} token - Token JWT retornado por la API
   */
  const login = async (token) => {
    try {
      setToken(token);
      setIsAuthenticated(true);
      localStorage.setItem("token", token);
    } catch (error) {
      console.error("Error durante el login:", error);
    }
  };

  /**
   * =====================================================
   * logout
   * =====================================================
   * Limpia la sesión del usuario, elimina el token
   * y restablece el estado global.
   */
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setToken(null);
    localStorage.removeItem("token");
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated,
        setIsAuthenticated,
        token,
        setToken,
        login,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

/**
 * =====================================================
 * useAppContext
 * =====================================================
 * Hook personalizado para consumir el AppContext.
 * Debe usarse exclusivamente dentro de AppProvider.
 *
 * @returns {Object} Contexto global de la aplicación
 * @throws {Error} Si se usa fuera del AppProvider
 */
export const useAppContext = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useAppContext debe usarse dentro de AppProvider");
  }

  return context;
};
