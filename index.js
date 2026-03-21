require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const xss = require("xss-clean");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");
const { connectDB, getDBStatus } = require("./config/db");
const os = require("os");
const statusCodeColor = require("./helpers/statusCodeColor");
const getMilliSeconds = require("./helpers/getMilliSeconds");
const getMemory = require("./helpers/getMemory");
const app = express();

// ====================================
// Connect to MongoDB
// ====================================
connectDB();

// ====================================
// Security & Middleware
// ====================================
// Secure HTTP headers
app.use(helmet());

// Parse request body
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Sanitize inputs to prevent XSS & NoSQL injection
app.use(xss());
app.use(mongoSanitize());

// ====================================
// CORS (Important for production deployment)
// ====================================
const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  `${process.env.APP_URL}`,
  /\.vercel\.app$/, // allow Vercel domains
  /\.onrender\.com$/, // allow Render domains
  /\.run\.app$/, // allow Cloud Run domains
];

// CORS options
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow curl / Postman

    const isAllowed = allowedOrigins.some((pattern) =>
      pattern instanceof RegExp ? pattern.test(origin) : pattern === origin
    );

    if (!isAllowed) {
      console.warn(`🚫 Blocked by CORS: ${origin}`);
      return callback(new Error("Not allowed by CORS"), false);
    }

    return callback(null, true);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "x-auth-token"],
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// ====================================
// Root Route
// ====================================
app.get("/", (req, res) => {
  const data = {
    app: "eshop - Simple E-commerce API (MERN Stack) + redux, tailwindcss and more.",
    description:
      "Backend API handles Authentication, products, shipping, transaction and more.",
    environment: process.env.NODE_ENV || "development",
    details: {
      node_version: process.version,
      platform: `${os.type()} ${os.platform()}`,
      hostname: os.hostname(),
      cpu: `${os.cpus().length} cores`,
      memory: {
        free: getMemory().free,
        total: getMemory().total,
      },
    },
    links: {
      github_api: "https://github.com/m-antoni/e-commerce-mern-api",
      github_react: "https://github.com/m-antoni/e-commerce-react",
      database: "https://mongodb.com",
      dockerhub:
        "https://hub.docker.com/repository/docker/michael0221/eshop-mern-backend",
      demo: "https://youtu.be/kP-tBwVRxI8",
    },
  };

  const html = `
    <html>
      <head>
        <title>API eshop</title>
        <style>
          body { font-family: Arial; background: #111; color: #eee; padding: 40px; }
          table { border-collapse: collapse; width: 60%; margin: 20px 0; }
          th, td { border: 1px solid #555; padding: 10px; text-align: left; }
          th { background: #222; }
          tr:nth-child(even) { background: #1a1a1a; }
          a { color: #4cc3ff; text-decoration: none; }
          a:hover { text-decoration: underline; color: #80dfff; }
        </style>
      </head>
      <body>
        <h2>🚀 E-Commerce API (MERN Stack)</h2>
        <p>Created by <b>Michael Antoni</b></p>
        <table>
          <tr><th>Title</th><th>Description</th></tr>
          <tr><td>App</td><td>${data.app}</td></tr>
          <tr><td>Description</td><td>${data.description}</td></tr>
          <tr><td>Environment</td><td>${data.environment}</td></tr>
          <tr><td>Node Version</td><td>${data.details.node_version}</td></tr>
          <tr><td>Platform</td><td>${data.details.platform}</td></tr>
          <tr><td>CPU</td><td>${data.details.cpu}</td></tr>
          <tr><td>Memory</td><td>Free = ${data.details.memory.free}  Total = ${data.details.memory.total}</td></tr>
          <tr><td>Database</td><td>MongoDB Atlas Cloud: <a href="${data.links.database}" target="_blank">${data.links.database}</a></tr>
          <tr><td>Github (Node)</td><td><a href="${data.links.github_api}" target="_blank">${data.links.github_api}</a></tr>
          <tr><td>Github (React)</td><td><a href="${data.links.github_react}" target="_blank">${data.links.github_react}</a></tr>
          <tr><td>Docker Hub (IMAGE)</td><td><a href="${data.links.dockerhub}" target="_blank">${data.links.dockerhub}</a></tr>
          <tr><td>Demo Video</td><td><a href="${data.links.demo}" target="_blank">${data.links.demo}</a></tr>
        </table>
      </body>
    </html>
  `;

  res.send(html);
});

// ====================================
// API Routes Terminal Logger
// ===================================
app.use((req, res, next) => {
  const now = new Date().toISOString();
  const startTime = Date.now();

  // do this after the response is finished
  res.on("finish", () => {
    const statusCode = statusCodeColor(res.statusCode);
    const countMilliSeconds = getMilliSeconds(startTime);

    // display custom logger in terminal
    console.log(
      `🛢️ ${now.yellow} ${req.method} ${req.originalUrl} ${statusCode} ${countMilliSeconds}ms`
    );
  });

  next();
});

// ======================================
// Health Check Endpoint for Cron Jobs
// ======================================
app.get("/api/health", async (req, res) => {
  // JSON Response public route
  res.status(200).json({
    statusCode: res.statusCode,
    status: "ok",
    db: getDBStatus(), // always gets current value
    timestamp: new Date(),
    uptime: process.uptime(),
    os: `${os.cpus().length} cores`,
    memory: process.memoryUsage(),
    message: "Server is healthy",
  });
});

// ====================================
// API Routes
// ====================================
app.use("/api/fakestore", require("./routes/fakestore.route"));
app.use("/api/auth", require("./routes/auth.route"));
app.use("/api/carts", require("./routes/cart.route"));
app.use("/api/shipping", require("./routes/shipping.route"));
app.use("/api/transaction", require("./routes/transaction.route"));

// ====================================
// Global Error Handler
// ====================================
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err.message);
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// ====================================
// Start Server
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
