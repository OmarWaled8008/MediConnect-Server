const Facility = require("../models/facility");
const jwt = require("jsonwebtoken");

const createToken = (userId, role, active) => {
  return jwt.sign({ userId, role, active }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

// Create Facility
exports.createFacility = async (req, res) => {
  const {
    name,
    facilityType,
    locationAfterConvert,
    city,
    address,
    telephone,
    contactInfo,
    detailsLink,
    description,
    services,
    photos,
    imageUrl,
    detailAddress,
    detailPageUrl,
    specialties, // newly added
    hospital_info, // newly added
  } = req.body;

  try {
    const facility = new Facility({
      name,
      facilityType,
      locationAfterConvert,
      city,
      address,
      telephone,
      contactInfo,
      detailsLink,
      description,
      services,
      photos,
      imageUrl,
      detailAddress,
      detailPageUrl,
      specialties, // newly added
      hospital_info, // newly added
      active: false, // set default active status to false
    });

    await facility.save();

    res.status(201).json({
      message: "Facility created successfully, waiting for admin approval",
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Facility Login
exports.loginFacility = async (req, res) => {
  const { email, password } = req.body;

  try {
    const facility = await Facility.findOne({ email });

    if (!facility) {
      return res.status(404).json({ message: "Facility not found" });
    }

    if (!facility.active) {
      return res.status(403).json({ message: "Facility is not active" });
    }

    const isMatch = await facility.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = createToken(facility._id, facility.role, facility.active);

    res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get Facility Profile
exports.getFacilityProfile = async (req, res) => {
  try {
    const facility = await Facility.findById(req.user.userId).select(
      "-password"
    );
    if (!facility) {
      return res.status(404).json({ message: "Facility not found" });
    }

    res.status(200).json(facility);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update Facility Profile
exports.updateFacilityProfile = async (req, res) => {
  const updates = req.body;
  try {
    const updatedFacility = await Facility.findByIdAndUpdate(
      req.user.userId,
      updates,
      { new: true }
    ).select("-password");

    if (!updatedFacility) {
      return res.status(404).json({ message: "Facility not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      updatedFacility,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
