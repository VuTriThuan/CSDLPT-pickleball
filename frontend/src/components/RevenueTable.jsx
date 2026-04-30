function RevenueTable({ revenues }) {
  return (
    <div
      style={{
        backgroundColor: "#fff",
        borderRadius: "16px",
        padding: "20px",
        boxShadow:
          "0 4px 12px rgba(0,0,0,0.1)",
      }}
    >
      <h2
        style={{
          marginBottom: "20px",
          color: "#333",
        }}
      >
        Doanh thu từng chi nhánh
      </h2>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr
            style={{
              backgroundColor: "#2c3e50",
              color: "white",
            }}
          >
            <th
              style={{
                padding: "15px",
                textAlign: "left",
              }}
            >
              Chi nhánh
            </th>

            <th
              style={{
                padding: "15px",
                textAlign: "left",
              }}
            >
              Doanh thu
            </th>
          </tr>
        </thead>

        <tbody>
          {revenues.map((item, index) => (
            <tr
              key={item._id}
              style={{
                backgroundColor:
                  index % 2 === 0
                    ? "#f9f9f9"
                    : "#fff",
              }}
            >
              <td
                style={{
                  padding: "15px",
                  borderBottom:
                    "1px solid #ddd",
                }}
              >
                {item._id}
              </td>

              <td
                style={{
                  padding: "15px",
                  borderBottom:
                    "1px solid #ddd",
                  color: "#27ae60",
                  fontWeight: "bold",
                }}
              >
                {item.TongDoanhThu.toLocaleString()}{" "}
                VNĐ
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RevenueTable;