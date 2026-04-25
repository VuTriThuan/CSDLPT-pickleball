const express = require("express");
const connectDB = require("./config/db");

const app = express();
app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(3005, () => {
  console.log("Server chạy tại http://localhost:3005");
});
