import { createContext, useContext, useState, useEffect } from 'react';

/**
 * =====================================================
 * AppContext
 * =====================================================
 */
const AppContext = createContext();

/**
 * =====================================================
 * Helper: Extraer roles del JWT (si fuera necesario)
 * =====================================================
 */
const getRolesFromToken = (token) => {
  try {
    if (!token) return [];

    const payload = JSON.parse(atob(token.split('.')[1]));

    // Puede venir como:
    // - roles
    // - role
    // - http://schemas.microsoft.com/ws/2008/06/identity/claims/role
    const roleClaim =
      payload.roles ||
      payload.role ||
      payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

    if (!roleClaim) return [];

    return Array.isArray(roleClaim) ? roleClaim : [roleClaim];
  } catch {
    return [];
  }
};

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

  const [roles, setRoles] = useState(() => {
    if (user?.roles) return user.roles;
    return getRolesFromToken(token);
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
      setRoles(getRolesFromToken(token));
    } else {
      localStorage.removeItem('token');
      setRoles([]);
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      if (user.roles) {
        setRoles(user.roles);
      }
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  /**
   * =====================================================
   * login
   * =====================================================
   */
  const login = async (token, user) => {
    try {
      setToken(token);
      setUser(user);
      setRoles(user?.roles || getRolesFromToken(token));
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
    setRoles([]);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  /**
   * =====================================================
   * Helpers de autorización
   * =====================================================
   */

  const hasRole = (role) => roles.includes(role);

  const hasAnyRole = (allowedRoles) =>
    allowedRoles.some((r) => roles.includes(r));

  return (
    <AppContext.Provider
      value={{
        user,
        token,
        roles,
        isAuthenticated,
        login,
        logout,
        setUser,
        hasRole,
        hasAnyRole,
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
