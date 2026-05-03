const mongoose = require("mongoose");

const MONGO_URI = "mongodb://10.251.129.72:27017/pickDB";


const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
  }
};

module.exports = connectDB;
