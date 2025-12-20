const mongoose = require("mongoose");
require("dotenv").config();

let _dbStatus = "disconnected";

const connectDB = async () => {
  const MONGO_URI = process.env.MONGO_URI;

  if (!MONGO_URI) {
    console.error("❌ MONGO_URI not found in .env file");
    process.exit(1);
  }

  mongoose.set("strictQuery", true);

  try {
    const conn = await mongoose.connect(MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    _dbStatus = "MongoDB Connected";
  } catch (err) {
    console.error("❌ MongoDB connection failed!", err.message);
    _dbStatus = "error";
    process.exit(1);
  }

  mongoose.connection.on("connected", () => (_dbStatus = "MongoDB Connected"));
  mongoose.connection.on("error", () => (_dbStatus = "error"));
  mongoose.connection.on("disconnected", () => (_dbStatus = "disconnected"));

  process.on("SIGINT", async () => {
    await mongoose.connection.close();
    console.log("🟣 Mongoose connection closed on app termination");
    process.exit(0);
  });
};

// Export a getter function
const getDBStatus = () => _dbStatus;

module.exports = { connectDB, getDBStatus };
