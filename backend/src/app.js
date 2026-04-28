require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/database");
const datSanRoutes = require("./routes/datSan");
const { authenticateDemoUser } = require("./middleware/auth");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(authenticateDemoUser);

// Connect DB
connectDB();

// Routes
app.use("/api/san", datSanRoutes);

// Health check
app.get("/health", (req, res) => res.json({ status: "ok", time: new Date() }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

module.exports = app;
