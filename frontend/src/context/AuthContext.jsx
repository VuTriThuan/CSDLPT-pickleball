import { createContext, useContext, useState, useEffect } from "react";
import { getMe, postDangXuat } from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // { maKhachHang, hoTen, email, role }
  const [loading, setLoading] = useState(true); // kiểm tra session lúc load trang

  // Khi app khởi động: hỏi backend session còn không
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
