import { createContext, useContext, useState, useEffect } from 'react';

/**
 * =====================================================
 * AppContext
 * =====================================================
 */
const AppContext = createContext();

/**
 * =====================================================
 * AppProvider
 * =====================================================
 */
export const AppProvider = ({ children }) => {
  /**
   * Inicialización segura desde localStorage
   */
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(
    () => !!localStorage.getItem('token')
  );

  /**
   * =====================================================
   * Sincroniza cambios con localStorage
   * =====================================================
   */
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  /**
   * =====================================================
   * login
   * =====================================================
   * @param {string} token
   * @param {Object} user
   */
  const login = async (token, user) => {
    try {
      setToken(token);
      setUser(user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error durante el login:', error);
    }
  };

  /**
   * =====================================================
   * logout
   * =====================================================
   */
  const logout = () => {
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        token,
        setToken,
        isAuthenticated,
        setIsAuthenticated,
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
 */
export const useAppContext = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('useAppContext debe usarse dentro de AppProvider');
  }

  return context;
};
