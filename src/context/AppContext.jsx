import { createContext, useContext, useState } from "react";

//  Building the AppContext
const AppContext = createContext();

// Create The provider component

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated,
        setIsAuthenticated,
        token,
        setToken,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// 3. Custom hook (MUY recomendado)
export const useAppContext = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("useAppContext debe usarse dentro de AppProvider")
  }
  return context
}