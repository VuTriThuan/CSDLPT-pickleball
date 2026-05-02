const mongoose = require("mongoose");

const MONGO_URI = "mongodb://127.0.0.1:27017/pickleball_db";

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
  }
};

module.exports = connectDB;
