const Appointment = require("../models/appointment");

exports.bookAppointment = async (req, res) => {
  const {
    facilityId,
    date,
    time,
    reason,
    department,
    name,
    phone,
    medicalRecord,
  } = req.body;

  try {
    // Check if the time slot is already booked for the given facility and time
    const existingAppointment = await Appointment.findOne({
      facility: facilityId,
      date: date,
      time: time,
    });

    if (existingAppointment) {
      return res.status(400).json({
        message: "Time slot already booked. Please choose another time.",
      });
    }

    const appointment = new Appointment({
      patient: req.user.userId,
      facility: facilityId,
      date,
      time,
      reason,
      department,
      name,
      phone,
      medicalRecord,
    });

    await appointment.save();
    res
      .status(201)
      .json({ message: "Appointment booked successfully", appointment });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// This function finds an appointment by ID and validates if the user has permission to modify or cancel it
const findAndValidateAppointment = async (appointmentId, userId, userType) => {
  const appointment = await Appointment.findById(appointmentId);

  if (!appointment) {
    throw new Error("Appointment not found");
  }

  const isAuthorized =
    userType === "patient"
      ? appointment.patient.toString() === userId
      : appointment.facility.toString() === userId;

  if (!isAuthorized) {
    throw new Error(
      `You do not have permission to ${
        userType === "patient" ? "cancel" : "modify"
      } this appointment`
    );
  }

  return appointment;
};

// This function updates an appointment with the given updates
const updateAppointment = async (appointmentId, userId, userType, updates) => {
  const appointment = await findAndValidateAppointment(
    appointmentId,
    userId,
    userType
  );

  // Apply updates if they exist
  if (updates.status) {
    appointment.status = updates.status;
  }
  if (updates.date) {
    appointment.date = updates.date;
  }
  if (updates.time) {
    appointment.time = updates.time;
  }

  await appointment.save();
  return appointment;
};

exports.getPatientAppointments = async (req, res) => {
  try {
    console.log(req.user.userId);
    const appointments = await Appointment.find({
      patient: req.user.userId,
    }).populate("facility");

    if (appointments.length === 0) {
      return res.status(404).json({ message: "No appointments found" });
    }

    res.status(200).json(appointments);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.cancelAppointment = async (req, res) => {
  const { appointmentId } = req.params;

  try {
    const appointment = await updateAppointment(
      appointmentId,
      req.user.userId,
      "patient",
      { status: "canceled" }
    );
    res.status(200).json({ message: "Appointment canceled", appointment });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAppointmentDetails = async (req, res) => {
  const { appointmentId } = req.params;
  try {
    const appointment = await Appointment.findById(appointmentId).populate(
      "facility patient"
    );

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json(appointment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getFacilityAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      facility: req.user.userId,
    }).populate("patient");
    res.status(200).json(appointments);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateAppointmentStatus = async (req, res) => {
  const { appointmentId, status } = req.body;

  try {
    const appointment = await updateAppointment(
      appointmentId,
      req.user.userId,
      "facility",
      { status }
    );
    res
      .status(200)
      .json({ message: "Appointment status updated", appointment });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.modifyAppointment = async (req, res) => {
  const { appointmentId, date, time } = req.body;

  try {
    const appointment = await updateAppointment(
      appointmentId,
      req.user.userId,
      "facility",
      { date, time }
    );
    res
      .status(200)
      .json({ message: "Appointment modified successfully", appointment });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
