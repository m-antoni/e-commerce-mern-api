const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  const MONGO_URI = process.env.MONGO_URI;

  if (!MONGO_URI) {
    console.error("❌ MONGO_URI not found in .env file");
    process.exit(1);
  }

  mongoose.set("strictQuery", true);

  try {
    const conn = await mongoose.connect(MONGO_URI, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📂 Database: ${conn.connection.name}`);
    console.log(`🧩 State: ${mongoose.connection.readyState}`); // 1 = connected
  } catch (err) {
    console.error("❌ MongoDB connection failed!");
    console.error(`Error message: ${err.message}`);
    if (err.reason) console.error(`Reason: ${err.reason}`);
    process.exit(1);
  }

  // Optional: track live connection events
  mongoose.connection.on("connected", () => {
    console.log("🟢 Mongoose connected to DB");
  });

  mongoose.connection.on("error", (err) => {
    console.error(`🔴 Mongoose connection error: ${err.message}`);
  });

  mongoose.connection.on("disconnected", () => {
    console.warn("🟠 Mongoose disconnected");
  });

  process.on("SIGINT", async () => {
    await mongoose.connection.close();
    console.log("🟣 Mongoose connection closed on app termination");
    process.exit(0);
  });
};

module.exports = connectDB;
