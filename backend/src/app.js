require("dotenv").config();
const express = require("express");
const cors = require("cors");
const session = require("express-session");

const connectDB = require("./config/database");
const datSanRoutes = require("./routes/datSan");
const sanRoutes = require("./routes/san");
const chiNhanhRoutes = require("./routes/chiNhanh");
const { authenticateDemoUser } = require("./middleware/auth");
const authRoutes = require("./routes/auth");
const { attachUser } = require("./middleware/auth");
const app = express();
const khachHangRoutes = require("./routes/khachHang.js");
const revenueRoutes = require("./routes/revenue");
const lichHenRoutes = require("./routes/lichHen");

/**
 * =============================
 * 1. CORS (phải đặt trước routes)
 * =============================
 */
app.use(
  cors({
    origin: "http://localhost:5174", // frontend
    credentials: true,
  }),
);

/**
 * =============================
 * 2. Body parser
 * =============================
 */
app.use(express.json());

/**
 * =============================
 * 3. Session (QUAN TRỌNG)
 * =============================
 */
app.use(
  session({
    name: "connect.sid", // tên cookie
    secret: process.env.SESSION_SECRET || "my-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // dev = false (production cần https)
      httpOnly: true,
      sameSite: "lax",
    },
  }),
);

app.use(authenticateDemoUser);

/**
 * =============================
 * 4. Connect MongoDB
 * =============================
 */
connectDB();

/**
 * =============================
 * 5. Routes
 * =============================
 */
app.use(attachUser);
app.use("/api/auth", authRoutes);
app.use("/api/san", datSanRoutes);
app.use("/api/chi-nhanh", chiNhanhRoutes);
app.use("/api/san", sanRoutes);
app.use("/api/san", khachHangRoutes);
app.use("/api/revenue", revenueRoutes);
app.use("/api/lich-hen", lichHenRoutes);

/**
 * =============================
 * 6. Health check
 * =============================
 */
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    session: req.session ? "enabled" : "disabled",
    time: new Date(),
  });
});

/**
 * =============================
 * 7. Global error handler (optional nhưng nên có)
 * =============================
 */
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.stack);
  res.status(500).json({ success: false, message: "Internal Server Error" });
});

/**
 * =============================
 * 8. Start server
 * =============================
 */

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`),
);

module.exports = app;
