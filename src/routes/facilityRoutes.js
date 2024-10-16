const express = require("express");
const {
  loginFacility,
  getFacilityProfile,
  updateFacilityProfile,
} = require("../controllers/facilityControllers");
const {
  verifyToken,
  isFacilityUser,
  isActive,
} = require("../middlewares/authMiddleware");
const { validateLogin } = require("../middlewares/validateMiddleware");

const router = express.Router();

router.post("/login", validateLogin, loginFacility);
 
router.get(
  "/profile", 
  verifyToken,
  isFacilityUser,
  isActive,
  getFacilityProfile
);

router.put(
  "/profile",
  verifyToken,
  isFacilityUser,
  isActive,
  updateFacilityProfile
);

module.exports = router;
