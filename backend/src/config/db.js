const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/pickleball");
    console.log("MongoDB connected");
  } catch (err) {
    console.error("DB error:", err.message);
  }
};

module.exports = connectDB;
