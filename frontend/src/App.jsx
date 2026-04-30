import {
  Routes,
  Route,
  Link,
} from "react-router-dom";

// pages
import RevenuePage from "./pages/RevenuePage";

import PaymentListPage from "./pages/PaymentListPage";

import AddPaymentPage from "./pages/AddPaymentPage";

// tạm thời chưa làm
import EditPaymentPage from "./pages/EditPaymentPage";

function App() {
  return (
    <div>
      {/* navbar */}
      <nav
        style={{
          padding: "20px",
          backgroundColor: "#2c3e50",

          display: "flex",

          gap: "20px",
        }}
      >
        {/* dashboard */}
        <Link
          to="/admin/dashboard"
          style={{
            color: "white",

            textDecoration: "none",

            fontWeight: "bold",
          }}
        >
          📊 Dashboard
        </Link>

        {/* payment list */}
        <Link
          to="/admin/payments"
          style={{
            color: "white",

            textDecoration: "none",

            fontWeight: "bold",
          }}
        >
          💳 Thanh toán
        </Link>

        {/* add payment */}
        <Link
          to="/admin/payments/add"
          style={{
            color: "white",

            textDecoration: "none",

            fontWeight: "bold",
          }}
        >
          ➕ Thêm thanh toán
        </Link>
      </nav>

      {/* routes */}
      <Routes>

        <Route
          path="/"
          element={<RevenuePage />}
        />

        {/* dashboard */}
        <Route
          path="/admin/dashboard"
          element={<RevenuePage />}
        />

        {/* payment list */}
        <Route
          path="/admin/payments"
          element={<PaymentListPage />}
        />

        {/* add payment */}
        <Route
          path="/admin/payments/add"
          element={<AddPaymentPage />}
        />

        {/* edit payment */}
        <Route
          path="/admin/payments/edit/:id"
          element={<EditPaymentPage />}
        />
       
      </Routes>
    </div>
  );
}

export default App;