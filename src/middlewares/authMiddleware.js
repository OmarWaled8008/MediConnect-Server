const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  const token =
    req.headers.authorization && req.headers.authorization.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Authentication token required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Token has expired. Please log in again." });
    } else if (error.name === "JsonWebTokenError") {
      return res
        .status(403)
        .json({ message: "Invalid token. Authentication failed." });
    } else {
      return res
        .status(403)
        .json({ message: "Failed to authenticate token. Try again later." });
    }
  }
};

exports.isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      message:
        "Admin access required. You do not have the necessary permissions.",
    });
  }
  next();
};

exports.isFacilityUser = (req, res, next) => {
  if (req.user.role !== "facility") {
    return res.status(403).json({
      message:
        "Facility access required. You do not have the necessary permissions.",
    });
  }
  next();
};

exports.isPatient = (req, res, next) => {
  if (req.user.role !== "patient") {
    return res.status(403).json({
      message:
        "Patient access required. You do not have the necessary permissions.",
    });
  }
  console.log("Role from Token: ", req.user.role);
  next();
};

exports.isAdminOrFacility = (req, res, next) => {
  if (req.user.role !== "admin" && req.user.role !== "facility") {
    return res.status(403).json({
      message:
        "Admin or Facility access required. You do not have the necessary permissions.",
    });
  }
  next();
};

exports.isAdminOrPatient = (req, res, next) => {
  if (req.user.role !== "admin" && req.user.role !== "patient") {
    return res.status(403).json({
      message:
        "Admin or Patient access required. You do not have the necessary permissions.",
    });
  }
  next();
};

exports.isActive = (req, res, next) => {
  if (!req.user.active) {
    return res.status(403).json({ message: "Your account is not active" });
  }
  next();
};
