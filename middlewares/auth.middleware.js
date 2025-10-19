const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  // ✅ Skip preflight requests
  if (req.method === "OPTIONS") {
    return res.sendStatus(204); // respond OK to browser preflight
  }

  const token = req.header("x-auth-token");

  if (!token) {
    return res.status(401).json({ message: "Unauthorized Access" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    req.authID = decoded._id;
    next();
  } catch (err) {
    console.error("JWT Verification Error:", err.message);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = { auth };
