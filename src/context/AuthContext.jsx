import { createContext, useContext, useState, useCallback } from 'react';
const Ctx = createContext(null);
const KEY = 'fastor_auth';
const load = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY));
  } catch {
    return null;
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(load);
  const login = useCallback((u) => {
    localStorage.setItem(KEY, JSON.stringify(u));
    setUser(u);
  }, []);
  const logout = useCallback(() => {
    localStorage.removeItem(KEY);
    setUser(null);
  }, []);
  return (
    <Ctx.Provider
      value={{
        user,
        token: user && user.token,
        isAuthenticated: !!(user && user.token),
        login,
        logout,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}
export const useAuth = () => useContext(Ctx);
