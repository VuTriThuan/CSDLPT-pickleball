import { useState, useEffect } from "react";
import { getChiNhanhList } from "../services/branchService";
function BranchSelect({
  value,
  onChange,
  mode = "select",
  includeAll = false,
}) {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const data = await getChiNhanhList();
        setBranches(data);
      } catch (error) {
        console.error("Lỗi khi tải danh sách chi nhánh:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBranches();
  }, []);
  if (loading) {
    return (
      <select
        disabled
        style={{
          width: "100%",
          padding: "12px 16px",
          borderRadius: "14px",
          border: "1px solid #d1d5db",
          fontSize: "15px",
          outline: "none",
          backgroundColor: "#f8fafc",
          color: "#334155",
          boxShadow: "inset 0 1px 2px rgba(15, 23, 42, 0.08)",
        }}
      >
        <option>Đang tải...</option>
      </select>
    );
  }
  if (mode === "select") {
    const defaultLabel = includeAll
      ? "Tất cả chi nhánh"
      : "-- Chọn chi nhánh --";
    return (
      <select
        value={value}
        onChange={onChange}
        style={{
          width: "100%",
          minHeight: "46px",
          padding: "12px 16px",
          borderRadius: "14px",
          border: "1px solid #f1f5ff",
          fontSize: "15px",
          outline: "none",
          backgroundColor: "#f1f5ff",
          color: "#0f172a",
          cursor: "pointer",
          boxShadow: "0 4px 14px rgba(15, 23, 42, 0.06)",
          transition: "border-color 0.2s ease, box-shadow 0.2s ease",
          appearance: "none",
          WebkitAppearance: "none",
          MozAppearance: "none",
        }}
        onFocus={(e) => {
          e.target.style.borderColor = "#2563eb";
          e.target.style.boxShadow = "0 0 0 4px rgba(59, 130, 246, 0.14)";
        }}
        onBlur={(e) => {
          e.target.style.borderColor = "#cbd5e1";
          e.target.style.boxShadow = "0 4px 14px rgba(15, 23, 42, 0.06)";
        }}
      >
        <option value="">{defaultLabel}</option>
        {branches.map((branch) => (
          <option key={branch.MaChiNhanh} value={branch.MaChiNhanh}>
            {branch.TenChiNhanh}
          </option>
        ))}
      </select>
    );
  }
  return (
    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
      {" "}
      {branches.map((branch) => (
        <button
          key={branch.MaChiNhanh}
          onClick={() => onChange({ target: { value: branch.MaChiNhanh } })}
          style={{
            padding: "10px 20px",
            borderRadius: "10px",
            border:
              value === branch.MaChiNhanh
                ? "2px solid #007bff"
                : "1px solid #dcdcdc",
            backgroundColor: value === branch.MaChiNhanh ? "#e7f3ff" : "white",
            color: value === branch.MaChiNhanh ? "#007bff" : "black",
            cursor: "pointer",
            fontSize: "15px",
            outline: "none",
          }}
        >
          {" "}
          {branch.TenChiNhanh}{" "}
        </button>
      ))}{" "}
    </div>
  );
}
export default BranchSelect;
