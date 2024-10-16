const Facility = require("../models/facility");
const Patient = require("../models/patient");
const Appointment = require("../models/appointment");
const Blog = require("../models/blog");
const Admin = require("../models/admin");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.registerAdmin = async (req, res) => {
  try {
    const { name, email, password, secret } = req.body;

    if (secret !== process.env.ADMIN_CREATION_SECRET) {
      return res
        .status(403)
        .json({ message: "Invalid secret key. Unauthorized access." });
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res
        .status(400)
        .json({ message: "Admin with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({ name, email, hashedPassword });
    await newAdmin.save();

    const token = jwt.sign(
      { id: newAdmin._id, role: newAdmin.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({ message: "Admin registered successfully", token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.login(email, password);

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAllFacilities = async (req, res) => {
  try {
    const facilities = await Facility.find();
    res.status(200).json(facilities);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to retrieve facilities", error: error.message });
  }
};

exports.updateFacilityAndStatus = async (req, res) => {
  const { facilityId } = req.params;
  const updates = req.body;

  try {
    const facility = await Facility.findById(facilityId);

    if (!facility) {
      return res.status(404).json({ message: "Facility not found" });
    }

    if (typeof updates.isActive !== "undefined") {
      facility.isActive = updates.isActive;
    }

    Object.assign(facility, updates);

    await facility.save();

    res.status(200).json({
      message: "Facility status and details updated successfully",
      facility,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating facility status and details",
      error: error.message,
    });
  }
};

// Helper function for deletion
const deleteEntity = async (Model, entityId, entityName, res) => {
  try {
    const entity = await Model.findByIdAndDelete(entityId);
    if (!entity) {
      return res.status(404).json({ message: `${entityName} not found` });
    }
    res.status(200).json({ message: `${entityName} deleted successfully` });
  } catch (error) {
    res.status(500).json({ message: `Error deleting ${entityName}`, error });
  }
};

exports.deleteFacility = async (req, res) => {
  const { facilityId } = req.params;
  await deleteEntity(Facility, facilityId, "Facility", res);
};

exports.getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find();
    res.status(200).json(patients);
  } catch (error) {
    res.status(500).json({ message: "Error fetching patients", error });
  }
};

exports.deletePatient = async (req, res) => {
  const { patientId } = req.params;
  await deleteEntity(Patient, patientId, "Patient", res);
};

exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find().populate("patient facility");
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching appointments", error });
  }
};

exports.updateAppointmentStatus = async (req, res) => {
  const { appointmentId } = req.params;
  const { status } = req.body;

  try {
    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    appointment.status = status;
    await appointment.save();

    res.status(200).json({
      message: "Appointment status updated successfully",
      appointment,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating appointment", error });
  }
};

exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().populate("author", "name");
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching blogs", error });
  }
};

exports.deleteBlog = async (req, res) => {
  const { blogId } = req.params;
  await deleteEntity(Blog, blogId, "Blog", res);
};
