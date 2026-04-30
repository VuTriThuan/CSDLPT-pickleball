const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const thanhToanRoutes = require("./routes/ThanhToanRoute");
const lichHenRoutes = require("./routes/LichHenRoute");

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  res.send("Hello World - API ready");
});

app.use("/api/thanh-toan", thanhToanRoutes);
app.use("/api/lich-hen", lichHenRoutes);

app.listen(3005, () => {
  console.log("Server chạy tại http://localhost:3005");
});
