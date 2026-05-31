import { TRANG_THAI_COLOR, TRANG_THAI_LABEL } from "../services/utils";

export default function Badge({ status }) {
  const color = TRANG_THAI_COLOR[status] ?? "#94a3b8";
  return (
    <span
      style={{
        background: color + "22",
        color,
        border: `1px solid ${color}44`,
        padding: "2px 10px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 600,
        whiteSpace: "nowrap",
      }}
    >
      {TRANG_THAI_LABEL[status] || status}
    </span>
  );
}
