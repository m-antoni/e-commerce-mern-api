require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const xss = require("xss-clean");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");
const connectDB = require("./config/db");
const os = require("os");
const app = express();

// ====================================
// 🧩 Connect to MongoDB
// ====================================
connectDB();

// ====================================
// 🛡️ Security & Middleware
// ====================================

// Secure HTTP headers
app.use(helmet());

// Parse request body
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Sanitize inputs to prevent XSS & NoSQL injection
app.use(xss());
app.use(mongoSanitize());

// ===== CORS (universal) =====
const allowedOrigins = ["http://localhost:3000", "http://127.0.0.1:3000"];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-auth-token"],
    preflightContinue: false,
    optionsSuccessStatus: 204, // for legacy browsers
  })
);

// ✅ This must be BEFORE any routes or auth
app.options("*", cors());

// ====================================
// 🧭 Root Route
// ====================================

app.get("/", (req, res) => {
  const data = {
    app: "E-Commerce API (MERN Stack)",
    created_by: "Michael Antoni",
    details: {
      node: process.version,
      platform: `${os.type()}, ${os.platform()}`,
      cpu: os.cpus().length,
      memory: Math.round(os.totalmem() / 1024 / 1024),
    },
  };
  res.json(data);
});

// ====================================
// 📦 API Routes
// ====================================

app.use("/api/fakestore", require("./routes/fakestore.route"));
app.use("/api/auth", require("./routes/auth.route"));
app.use("/api/carts", require("./routes/cart.route"));
app.use("/api/shipping", require("./routes/shipping.route"));
app.use("/api/transaction", require("./routes/transaction.route"));

// ====================================
// ⚠️ Global Error Handler
// ====================================

app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err.message);
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// ====================================
// 🚀 Start Server
// ====================================

const PORT = process.env.PORT || 5000;
const appURL = `${process.env.APP_URL}:${PORT}`;

app.listen(PORT, () => {
  console.log("===================================");
  console.log(`🚀 Server is running successfully!`);
  console.log(`🌐 API URL: ${appURL}`);
  console.log(`📦 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`👨‍💻 Created by: Michael B. Antoni`);
  console.log("===================================");
});
