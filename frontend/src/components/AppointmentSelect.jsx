function AppointmentSelect({
  appointments,
  onChange,
}) {
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
        -- Chọn lịch hẹn --
      </option>

      {appointments.map((item) => (
        <option
          key={item.MaLichHen}
          value={item.MaLichHen}
        >
          {item.MaLichHen}
          {" | "}
          {item.GioBatDau}
          {" - "}
          {item.GioKetThuc}
        </option>
      ))}
    </select>
  );
}

export default AppointmentSelect;