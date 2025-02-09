const rateLimit = require("express-rate-limit");

// Use environment variables for flexibility
const RATE_LIMIT_WINDOW_MS = process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX = process.env.RATE_LIMIT_MAX || 100; // 100 requests per window

const limiter = rateLimit({
  windowMs: RATE_LIMIT_WINDOW_MS, // Use environment variable or default
  max: RATE_LIMIT_MAX, // Use environment variable or default
  message: {
    status: 429,
    message: "Rate limit exceeded. Try again later.",
  },
  headers: true, // Send rate limit info in headers
  // Optional: Use a custom key generator (e.g., user ID instead of IP)
  keyGenerator: (req) => {
    return req.user ? req.user.id : req.ip; // Use user ID if authenticated, otherwise fallback to IP
  },
  // Optional: Custom handler for rate limit exceeded
  handler: (req, res) => {
    res.status(429).json({
      status: 429,
      message: "Too many requests. Please try again later.",
    });
  },
});

module.exports = limiter;