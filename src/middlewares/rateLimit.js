const rateLimit = require("express-rate-limit");
exports.authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 50, 
  message:
    "Too many login attempts from this IP, please try again after 15 minutes.",
  headers: true,
});
