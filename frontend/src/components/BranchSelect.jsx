function BranchSelect({ onChange }) {
  return (
    <select
      onChange={onChange}
      style={{
        width: "100%",
        padding: "12px",
        borderRadius: "10px",
        border: "1px solid #dcdcdc",
        fontSize: "15px",
        outline: "none",
        backgroundColor: "white",
        cursor: "pointer",
      }}
    >
      <option value="">
        -- Chọn chi nhánh --
      </option>

      <option value="HOAN_KIEM">
        Hoàn Kiếm
      </option>

      <option value="CAU_GIAY">
        Cầu Giấy
      </option>

      <option value="BA_DINH">
        Ba Đình
      </option>

      <option value="NAM_TU_LIEM">
        Nam Từ Liêm
      </option>

      <option value="BAC_TU_LIEM">
        Bắc Từ Liêm
      </option>

      <option value="THANH_XUAN">
        Thanh Xuân
      </option>

      <option value="LONG_BIEN">
        Long Biên
      </option>
    </select>
  );
}

export default BranchSelect;