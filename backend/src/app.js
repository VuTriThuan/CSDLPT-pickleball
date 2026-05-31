require("dotenv").config();
const express = require("express");
const cors = require("cors");
const session = require("express-session");

const connectDB = require("./config/database");
const datSanRoutes = require("./routes/datSan");
const sanRoutes = require("./routes/san");
const chiNhanhRoutes = require("./routes/chiNhanh");
const { attachUser } = require("./middleware/auth");
const authRoutes = require("./routes/auth");
const app = express();
const khachHangRoutes = require("./routes/khachHang.js");
const revenueRoutes = require("./routes/revenue");
const lichHenRoutes = require("./routes/lichHen");
const thanhToanRoutes = require("./routes/thanhToan");
const nhanVienRoutes = require("./routes/nhanVien");

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5173"],
    credentials: true,
  }),
);

app.use(express.json());

app.use(
  session({
    name: "connect.sid",
    secret: process.env.SESSION_SECRET || "my-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
      sameSite: "lax",
    },
  }),
);
// app.use(authenticateDemoUser);
connectDB();

app.use(attachUser);
app.use("/api/auth", authRoutes);
app.use("/api/san", datSanRoutes);
app.use("/api/chi-nhanh", chiNhanhRoutes);
app.use("/api/san", sanRoutes);
app.use("/api/san", khachHangRoutes);
app.use("/api/revenue", revenueRoutes);
app.use("/api/lich-hen", lichHenRoutes);
app.use("/api/thanh-toan", thanhToanRoutes);
app.use("/api/nhan-vien", nhanVienRoutes);

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    session: req.session ? "enabled" : "disabled",
    time: new Date(),
  });
});

app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(500).json({ success: false, message: "Internal Server Error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`),
);

module.exports = app;
