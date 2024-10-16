const express = require("express");
const adminController = require("../controllers/adminControllers");
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");

const router = express.Router();
 
router.post("/register", adminController.registerAdmin);
router.post("/login", adminController.loginAdmin);
router.get(
  "/facilities",
  verifyToken,
  isAdmin,
  adminController.getAllFacilities
);
router.put(
  "/facilities/:facilityId",
  verifyToken, 
  isAdmin,
  adminController.updateFacilityAndStatus
);
router.delete(
  "/facilities/:facilityId",
  verifyToken,
  isAdmin,
  adminController.deleteFacility
);
router.get("/patients", verifyToken, isAdmin, adminController.getAllPatients);
router.delete(
  "/patients/:patientId",
  verifyToken,
  isAdmin,
  adminController.deletePatient
);
router.get(
  "/appointments",
  verifyToken,
  isAdmin,
  adminController.getAllAppointments
);
router.put(
  "/appointments/:appointmentId",
  verifyToken,
  isAdmin,
  adminController.updateAppointmentStatus
);
router.get("/blogs", verifyToken, isAdmin, adminController.getAllBlogs);
router.delete(
  "/blogs/:blogId",
  verifyToken,
  isAdmin,
  adminController.deleteBlog
);

module.exports = router;
