const express = require("express");
const {
  bookAppointment,
  getPatientAppointments,
  cancelAppointment,
  getFacilityAppointments,
  updateAppointmentStatus,
  modifyAppointment,
  getAppointmentDetails,
} = require("../controllers/appointmentControllers");
const {
  verifyToken,
  isPatient,
  isFacilityUser,
} = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/book", verifyToken, isPatient, bookAppointment);
router.get(
  "/patient-appointments",
  verifyToken,
  isPatient,
  getPatientAppointments
);
router.delete(
  "/cancel/:appointmentId",
  verifyToken,
  cancelAppointment
);
router.get(
  "/facility-appointments",
  verifyToken,
  isFacilityUser,
  getFacilityAppointments
);
router.put(
  "/status",
  verifyToken,
  updateAppointmentStatus
);
router.put(
  "/modify",
  verifyToken,
  modifyAppointment
);
router.get("/:appointmentId", verifyToken, getAppointmentDetails);

module.exports = router;
