const express = require("express");
const {
  getDoctors,
  getHospitals,
  getMedicalCenters,
  getFacilitiesByType,
  getFacilityById,
} = require("../controllers/dataControllers");

const router = express.Router();

router.get("/doctors", getDoctors);
router.get("/hospitals", getHospitals);
router.get("/medical-centers", getMedicalCenters);
router.get("/facilities/:type", getFacilitiesByType);
router.get("/facility/:id", getFacilityById);

module.exports = router;
