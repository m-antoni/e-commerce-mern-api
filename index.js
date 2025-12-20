require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const xss = require("xss-clean");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");
const connectDB = require("./config/db");
const os = require("os");
const statusCodeColor = require("./helpers/statusCodeColor");
const getMilliSeconds = require("./helpers/getMilliSeconds");
const getMemory = require("./helpers/getMemory");
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
const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  /\.vercel\.app$/, // ✅ allow any Vercel subdomain
  /\.onrender\.com$/, // ✅ (optional) allow your Render domain too
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl, etc.)
      if (!origin) return callback(null, true);

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
  })
);

// Must be before routes
app.options("*", cors());

// ====================================
// 🧭 Root Route
// ====================================

app.get("/", (req, res) => {
  const data = {
    app: "eshop - Simple E-commerce API (MERN Stack) + redux, tailwindcss and more.",
    description: "Backend API handles Authentication, products, shipping, transaction and more.",
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
      linkedin: "https://www.linkedin.com/in/m-antoni",
      github: "https://github.com/m-antoni/e-commerce-mern-api",
      frontend: "https://m-antoni-eshop-mern.vercel.app",
    },
    hosted: {
      database: "https://mongodb.com",
      backend_api:"https://render.com",
      frontend_ui:"https://vercel.com",
      demo:"https://youtu.be/kP-tBwVRxI8"
    }
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
          <tr><td>Database</td><td>MongoDB Atlas Cloud: <a href="${data.hosted.database}" target="_blank">${data.hosted.database}</a></tr>
          <tr><td>Backend API</td><td>Hosted on: <a href="${data.hosted.backend_api}" target="_blank">${data.hosted.backend_api}</a></tr>
          <tr><td>Frontend UI</td><td>Hosted on: <a href="${data.hosted.frontend_ui}" target="_blank">${data.hosted.frontend_ui}</a></tr>
          <tr><td>Linked In</td><td><a href="${data.links.linkedin}" target="_blank">${data.links.linkedin}</a></tr>
          <tr><td>Github</td><td><a href="${data.links.github}" target="_blank">${data.links.github}</a></tr>
          <tr><td>Visit Here</td><td><a href="${data.links.frontend}" target="_blank">${data.links.frontend}</a></tr>
          <tr><td>Demo Video</td><td><a href="${data.hosted.demo}" target="_blank">${data.hosted.demo}</a></tr>
        </table>
      </body>
    </html>
  `;

  res.send(html);
});

// ====================================
// 🤖 API Routes Terminal Logger
// ===================================
app.use((req, res, next) => {
  const now = new Date().toISOString();
  const startTime = Date.now();

  // do this after the response is finished
  res.on('finish',() => {
    const statusCode = statusCodeColor(res.statusCode)
    const countMilliSeconds = getMilliSeconds(startTime)

    // display custom logger in terminal
    console.log(`🛢️ ${now.yellow} ${req.method} ${req.originalUrl} ${statusCode} ${countMilliSeconds}ms`);
  });

  next();
});


// ======================================
// ⚡ Health Check Endpoint for Cron Jobs
// ======================================
app.get("/api/health", async (req, res) => {
  let dbStatus = "unknown";

  try {
    // Check MongoDB connection
    if (mongoose.connection.readyState === 1) {
      dbStatus = "connected";
    } else if (mongoose.connection.readyState === 2) {
      dbStatus = "connecting";
    } else {
      dbStatus = "disconnected";
    }
  } catch (err) {
    dbStatus = "error";
  }

  res.status(200).json({
    status: "ok",          // overall status
    api_url: process.env.APP_URL,
    host: "render.com",
    timestamp: new Date(), // current server time
    os:`${os.cpus().length} cores`,
    uptime: process.uptime(), // server uptime in seconds
    memory: {
      rss: process.memoryUsage().rss,       // resident set size
      heapTotal: process.memoryUsage().heapTotal,
      heapUsed: process.memoryUsage().heapUsed,
    },
    db: dbStatus,
    message: "Server is healthy",
  });
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
