const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const appointmentSchema = new Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  medicalRecord: { type: String, required: true },
  reason: {
    type: String,
    enum: ["routine", "consultation", "emergency"],
    required: true,
  },
  department: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  patient: { type: Schema.Types.ObjectId, ref: "Patient", required: true },
  facility: { type: Schema.Types.ObjectId, ref: "Facility", required: true },
  status: {
    type: String,
    enum: ["pending", "confirmed", "canceled"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
});

const Appointment = mongoose.model("Appointment", appointmentSchema);
module.exports = Appointment;
