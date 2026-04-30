const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");

const revenueRoutes = require("./routes/revenueRoutes");
const thanhToanRoutes = require("./routes/thanhToanRoutes");
const lichHenRoutes = require("./routes/lichHenRoutes");

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  res.send("Hello World - API ready");
});

app.use("/api/revenue", revenueRoutes);

app.use("/api/lich-hen", lichHenRoutes);

app.use("/api/thanh-toan", thanhToanRoutes);

app.listen(3005, () => {
  console.log("Server chạy tại http://localhost:3005");
});