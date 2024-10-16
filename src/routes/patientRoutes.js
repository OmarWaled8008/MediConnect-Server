const express = require("express");
const {
  signup,
  login,
  getProfile,
  updateProfile,
} = require("../controllers/patientController");
const { verifyToken, isPatient } = require("../middlewares/authMiddleware");
const {
  validateSignup,
  validateLogin,
} = require("../middlewares/validateMiddleware");

const router = express.Router();

router.post("/signup", validateSignup, signup);
router.post("/login", validateLogin, login);
router.get("/profile", verifyToken, isPatient, getProfile);
router.put("/profile", verifyToken, isPatient, updateProfile);

module.exports = router;
