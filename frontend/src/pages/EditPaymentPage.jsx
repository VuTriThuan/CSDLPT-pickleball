import { useEffect, useState } from "react";

import axios from "axios";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

function EditPaymentPage() {
  const { id } = useParams();

  const navigate = useNavigate();

  // state
  const [amount, setAmount] = useState("");

  const [paymentMethod, setPaymentMethod] =
    useState("tien_mat");

  // trạng thái
  const [status, setStatus] =
    useState("thanh_cong");

  const [successMessage, setSuccessMessage] =
    useState("");

  const [errorMessage, setErrorMessage] =
    useState("");

  // load payment detail
  useEffect(() => {
    fetchPayment();
  }, []);

  const fetchPayment = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3005/api/thanh-toan"
      );

      const payment = res.data.data.find(
        (item) => item._id === id
      );

      if (!payment) {
        setErrorMessage(
          "Không tìm thấy thanh toán"
        );

        return;
      }

      setAmount(payment.SoTien);

      setPaymentMethod(payment.PhuongThuc);

      setStatus(payment.TrangThai);
    } catch (error) {
      console.log(error);
    }
  };

  // update payment
  const handleUpdate = async () => {
    setSuccessMessage("");

    setErrorMessage("");

    // validate
    if (!amount || Number(amount) <= 0) {
      setErrorMessage(
        "Số tiền phải lớn hơn 0"
      );

      return;
    }

    try {
      await axios.put(
        `http://localhost:3005/api/thanh-toan/${id}`,
        {
          SoTien: Number(amount),

          PhuongThuc: paymentMethod,

          TrangThai: status,
        }
      );

      setSuccessMessage(
        "✅ Cập nhật thành công"
      );

      // quay lại payment list
      setTimeout(() => {
        navigate("/admin/payments");
      }, 1000);
    } catch (error) {
      console.log(error);

      setErrorMessage(
        "Có lỗi xảy ra"
      );
    }
  };

  return (
    <div
      style={{
        padding: "30px",
        backgroundColor: "#f5f7fb",
        minHeight: "100vh",

        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          padding: "30px",
          borderRadius: "16px",
          boxShadow:
            "0 4px 12px rgba(0,0,0,0.1)",

          width: "500px",
        }}
      >
        <h1
          style={{
            marginBottom: "25px",
            color: "#222",
          }}
        >
          ✏️ Sửa thanh toán
        </h1>

        {/* số tiền */}
        <div style={{ marginBottom: "20px" }}>
          <label>Số tiền</label>

          <br />
          <br />

          <input
            type="number"
            value={amount}
            onChange={(e) =>
              setAmount(e.target.value)
            }
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              fontSize: "15px",
            }}
          />
        </div>

        {/* phương thức */}
        <div style={{ marginBottom: "20px" }}>
          <label>
            Phương thức thanh toán
          </label>

          <br />
          <br />

          <select
            value={paymentMethod}
            onChange={(e) =>
              setPaymentMethod(
                e.target.value
              )
            }
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "10px",
              border: "1px solid #dcdcdc",
              fontSize: "15px",
              backgroundColor: "white",
              cursor: "pointer",
            }}
          >
            <option value="tien_mat">
              Tiền mặt
            </option>

            <option value="chuyen_khoan">
              Chuyển khoản
            </option>

            <option value="the">
              Thẻ
            </option>
          </select>
        </div>

        {/* trạng thái */}
        <div style={{ marginBottom: "20px" }}>
          <label>Trạng thái</label>

          <br />
          <br />

          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value)
            }
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "10px",
              border: "1px solid #dcdcdc",
              fontSize: "15px",
              backgroundColor: "white",
              cursor: "pointer",
            }}
          >
            
            <option value="cho_xu_ly">
              Chờ xử lý
            </option>
            
            <option value="thanh_cong">
              Thành công
            </option>

            <option value="that_bai">
              Thất bại
            </option>


            <option value="hoan_tien">
              Hoàn tiền
            </option>
          </select>
        </div>

        {/* success */}
        {successMessage && (
          <p
            style={{
              color: "#27ae60",
              marginBottom: "15px",
              fontWeight: "bold",
            }}
          >
            {successMessage}
          </p>
        )}

        {/* error */}
        {errorMessage && (
          <p
            style={{
              color: "red",
              marginBottom: "15px",
              fontWeight: "bold",
            }}
          >
            {errorMessage}
          </p>
        )}

        {/* button */}
        <button
          onClick={handleUpdate}
          style={{
            width: "100%",
            padding: "14px",
            backgroundColor: "#3498db",
            color: "white",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "bold",
          }}
        >
          Cập nhật thanh toán
        </button>
      </div>
    </div>
  );
}

export default EditPaymentPage;