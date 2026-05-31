import { useEffect, useState } from "react";
import {
  deleteKhachHang,
  getKhachHangList,
  updateKhachHang,
} from "../../services/adminService";
import { initialKhachHang } from "../../utils/constants";
import { cleanPayload } from "../../utils/helpers";

export default function KhachHangPanel({ auth, setToast }) {
  const [khachHangList, setKhachHangList] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(initialKhachHang);
  const [loading, setLoading] = useState(false);

  const loadKhachHang = async () => {
    setLoading(true);
    try {
      const res = await getKhachHangList(auth);
      setKhachHangList(res.data || []);
    } catch (err) {
      setToast({ type: "error", msg: err.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadKhachHang();
  }, [auth.role, auth.branchId]);

  const setEdit = (key, value) =>
    setEditForm((current) => ({ ...current, [key]: value }));

  const startEdit = (khachHang) => {
    setEditingId(khachHang.MaKhachHang);
    setEditForm({
      MaKhachHang: khachHang.MaKhachHang,
      HoTen: khachHang.HoTen || "",
      SoDienThoai: khachHang.SoDienThoai || "",
      Email: khachHang.Email || "",
    });
  };

  const saveEdit = async (maKhachHang) => {
    setLoading(true);
    try {
      const res = await updateKhachHang(
        maKhachHang,
        cleanPayload({
          HoTen: editForm.HoTen,
          SoDienThoai: editForm.SoDienThoai,
          Email: editForm.Email,
        }),
        auth,
      );
      setKhachHangList((current) =>
        current.map((item) =>
          item.MaKhachHang === maKhachHang ? res.data : item,
        ),
      );
      setEditingId(null);
      setToast({ type: "ok", msg: "Đã sửa khách hàng" });
    } catch (err) {
      setToast({ type: "error", msg: err.message });
    } finally {
      setLoading(false);
    }
  };

  const removeKhachHang = async (maKhachHang) => {
    if (!window.confirm(`Xóa khách hàng ${maKhachHang}?`)) return;
    setLoading(true);
    try {
      await deleteKhachHang(maKhachHang, auth);
      setKhachHangList((current) =>
        current.filter((item) => item.MaKhachHang !== maKhachHang),
      );
      setToast({ type: "ok", msg: "Đã xóa khách hàng" });
    } catch (err) {
      setToast({ type: "error", msg: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-panel">
      <div className="admin-toolbar">
        <div>
          <h2 className="admin-title">Quản lý khách hàng</h2>
          <p className="admin-subtitle">Danh sách khách hàng từ API quản trị</p>
        </div>
      </div>

      <div className="table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Họ tên</th>
              <th>Số điện thoại</th>
              <th>Email</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {khachHangList.map((item) => {
              const isEditing = editingId === item.MaKhachHang;
              return (
                <tr key={item.MaKhachHang}>
                  <td className="admin-table__id">{item.MaKhachHang}</td>
                  <td>
                    {isEditing ? (
                      <input
                        className="table-input"
                        value={editForm.HoTen}
                        onChange={(e) => setEdit("HoTen", e.target.value)}
                      />
                    ) : (
                      item.HoTen
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <input
                        className="table-input"
                        value={editForm.SoDienThoai}
                        onChange={(e) => setEdit("SoDienThoai", e.target.value)}
                      />
                    ) : (
                      item.SoDienThoai
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <input
                        className="table-input"
                        type="email"
                        value={editForm.Email}
                        onChange={(e) => setEdit("Email", e.target.value)}
                      />
                    ) : (
                      item.Email || "-"
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <div className="table-actions">
                        <button
                          className="btn-text btn-text--primary"
                          onClick={() => saveEdit(item.MaKhachHang)}
                          disabled={loading}
                        >
                          Lưu
                        </button>
                        <button
                          className="btn-text"
                          onClick={() => setEditingId(null)}
                          disabled={loading}
                        >
                          Hủy
                        </button>
                      </div>
                    ) : (
                      <div className="table-actions">
                        <button
                          className="btn-text btn-text--primary"
                          onClick={() => startEdit(item)}
                        >
                          Sửa
                        </button>
                        <button
                          className="btn-text btn-text--danger"
                          onClick={() => removeKhachHang(item.MaKhachHang)}
                          disabled={loading}
                        >
                          Xóa
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}

            {!khachHangList.length && (
              <tr>
                <td colSpan="5" className="table-empty">
                  {loading ? "Đang tải dữ liệu..." : "Chưa có khách hàng nào"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
