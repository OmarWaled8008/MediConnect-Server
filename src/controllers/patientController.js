const Patient = require("../models/patient");
const jwt = require("jsonwebtoken");

// JWT token generator
const createToken = (userId, role) => {
  return jwt.sign({ userId, role }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

exports.signup = async (req, res) => {
  const {
    email,
    password,
    name,
    phone,
    address,
    blood_type,
    medical_history,
    allergies,
    current_medication,
    gender,
    birthdate,
  } = req.body;

  try {
    const patientData = {
      name,
      phone,
      address,
      blood_type,
      medical_history,
      allergies,
      current_medication,
      email,
      password,
      gender,
      birthdate,
      role: "patient",
    };

    const patient = await Patient.signup(email, password, patientData);

    await patient.save();

    const token = createToken(patient._id, patient.role);

    res.status(201).json({
      message: "Patient registered successfully.",
      token,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const patient = await Patient.login(email, password);

    const token = createToken(patient._id, patient.role); // Ensure the token uses _id
    console.log(patient); // Check if patient._id exists before creating the token

    res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  const updates = req.body;
  try {
    const updatedPatient = await Patient.findByIdAndUpdate(
      req.user.userId,
      updates,
      {
        new: true,
      }
    );

    if (!updatedPatient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      updatedPatient,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getProfile = async (req, res) => {
  console.log(req.user);
  try {
    const patient = await Patient.findById(req.user.userId).select("-password");

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.status(200).json({
      message: "Profile data retrieved successfully",
      patient,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
