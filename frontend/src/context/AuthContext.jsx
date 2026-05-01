import { createContext, useContext, useState, useEffect } from "react";
import { getMe, postDangXuat } from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMe()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const dangNhapThanhCong = (userData) => setUser(userData);

  const dangXuat = async () => {
    await postDangXuat();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, dangNhapThanhCong, dangXuat }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
