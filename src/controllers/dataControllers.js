const Facility = require("../models/facility");

exports.getDoctors = async (req, res) => {
  try {
    const doctors = await Facility.find({ facilityType: "doctor" });
    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch doctors", error });
  }
};

exports.getHospitals = async (req, res) => {
  try {
    const hospitals = await Facility.find({ facilityType: "hospital" });
    res.status(200).json(hospitals);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch hospitals", error });
  }
};

exports.getMedicalCenters = async (req, res) => {
  try {
    const medicalCenters = await Facility.find({
      facilityType: "medical_center",
    });
    res.status(200).json(medicalCenters);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch medical centers", error });
  }
};

exports.getFacilitiesByType = async (req, res) => {
  const { type } = req.params;
  try {
    const facilities = await Facility.find({ facilityType: type });
    if (!facilities || facilities.length === 0) {
      return res.status(404).json({ message: "No facilities found" });
    }
    res.status(200).json(facilities);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch facilities", error });
  }
};

exports.getFacilityById = async (req, res) => {
  const { id } = req.params;

  try {
    const facility = await Facility.findById(id);

    if (!facility) {
      return res.status(404).json({ message: "Facility not found" });
    }

    res.status(200).json(facility);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch facility", error });
  }
};
