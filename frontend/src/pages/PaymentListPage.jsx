import { useEffect, useState } from "react";

import axios from "axios";

import { Link } from "react-router-dom";

function PaymentListPage() {
  const [payments, setPayments] =
    useState([]);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    const res = await axios.get(
      "http://localhost:3005/api/thanh-toan"
    );

    setPayments(res.data.data);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Bạn có chắc muốn xóa?"
    );

    if (!confirmDelete) return;

    await axios.delete(
      `http://localhost:3005/api/thanh-toan/${id}`
    );

    fetchPayments();
  };

  return (
    <div style={{ padding: "30px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <h1>Danh sách thanh toán</h1>

        <Link to="/admin/payments/add">
          <button>
            ➕ Thêm thanh toán
          </button>
        </Link>
      </div>

      <table
        border="1"
        cellPadding="10"
        width="100%"
      >
        <thead>
          <tr>
            <th>Mã</th>
            <th>Số tiền</th>
            <th>Phương thức</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>

        <tbody>
          {payments.map((item) => (
            <tr key={item._id}>
              <td>{item.MaThanhToan}</td>

              <td>
                {item.SoTien.toLocaleString()}
              </td>

              <td>{item.PhuongThuc}</td>

              <td>{item.TrangThai}</td>

              <td>
                <Link
                  to={`/admin/payments/edit/${item._id}`}
                >
                  <button>Sửa</button>
                </Link>

                <button
                  onClick={() =>
                    handleDelete(item._id)
                  }
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PaymentListPage;