import { useState } from "react";

import axios from "axios";

import BranchSelect from "../components/BranchSelect";

import AppointmentSelect from "../components/AppointmentSelect";

function AddPaymentPage() {
  // branch đang chọn
  const [branch, setBranch] = useState("");

  // danh sách lịch hẹn
  const [appointments, setAppointments] =
    useState([]);

  // lịch hẹn được chọn
  const [selectedAppointment, setSelectedAppointment] =
    useState("");

  // số tiền
  const [amount, setAmount] = useState("");

  // phương thức thanh toán
  const [paymentMethod, setPaymentMethod] =
    useState("tien_mat");

  // thông báo thành công
  const [successMessage, setSuccessMessage] =
    useState("");

  // thông báo lỗi
  const [errorMessage, setErrorMessage] =
    useState("");

  // load lịch hẹn theo chi nhánh
  const fetchAppointments = async (branchId) => {
    try {
      const res = await axios.get(
        `http://localhost:3005/api/lich-hen/pending/${branchId}`
      );

      setAppointments(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  // chọn chi nhánh
  const handleBranchChange = async (e) => {
    const branchId = e.target.value;

    setBranch(branchId);

    await fetchAppointments(branchId);
  };

  // thanh toán
  const handleSubmit = async () => {
    // reset message
    setSuccessMessage("");

    setErrorMessage("");

    // validate
    if (!branch) {
      setErrorMessage(
        "Vui lòng chọn chi nhánh"
      );

      return;
    }

    if (!selectedAppointment) {
      setErrorMessage(
        "Vui lòng chọn lịch hẹn"
      );

      return;
    }

    if (!amount || Number(amount) <= 0) {
      setErrorMessage(
        "Số tiền phải lớn hơn 0"
      );

      return;
    }

    try {
      await axios.post(
        "http://localhost:3005/api/thanh-toan",
        {
          MaThanhToan: `TT${Date.now()}`,

          SoTien: Number(amount),

          // mặc định thành công
          TrangThai: "thanh_cong",

          // phương thức được chọn
          PhuongThuc: paymentMethod,

          MaLichHen: selectedAppointment,
        }
      );

      // hiện thông báo
      setSuccessMessage(
        "✅ Thanh toán thành công"
      );

      // reload lịch hẹn
      const res = await axios.get(
        `http://localhost:3005/api/lich-hen/pending/${branch}`
      );

      setAppointments(res.data.data);

      // reset form
      setSelectedAppointment("");

      setAmount("");

      setPaymentMethod("tien_mat");

      // reload trang sau 1s
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.log(error);

      setErrorMessage(
        "Có lỗi xảy ra khi thanh toán"
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
          💳 Thêm thanh toán
        </h1>

        {/* chọn chi nhánh */}
        <div style={{ marginBottom: "20px" }}>
          <label>Chọn chi nhánh</label>

          <br />
          <br />

          <BranchSelect
            onChange={handleBranchChange}
          />
        </div>

        {/* chọn lịch hẹn */}
        <div style={{ marginBottom: "20px" }}>
          <label>Chọn lịch hẹn</label>

          <br />
          <br />

          <AppointmentSelect
            appointments={appointments}
            onChange={(e) =>
              setSelectedAppointment(
                e.target.value
              )
            }
          />
        </div>

        {/* nhập tiền */}
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

        {/* phương thức thanh toán */}
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

        {/* thông báo */}
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
          onClick={handleSubmit}
          style={{
            width: "100%",
            padding: "14px",
            backgroundColor: "#27ae60",
            color: "white",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "bold",
          }}
        >
          Thanh toán
        </button>
      </div>
    </div>
  );
}

export default AddPaymentPage;