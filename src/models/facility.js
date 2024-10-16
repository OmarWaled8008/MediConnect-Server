const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

const facilitySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  facilityType: {
    type: String,
    enum: ["doctor", "hospital", "medical_center"],
    required: true,
  },
  locationAfterConvert: { type: String, default: "N/A" },
  city: { type: String, default: "N/A" },
  address: { type: String, default: "N/A" },
  telephone: { type: String, default: "N/A" },
  contactInfo: { type: String, default: "N/A" },
  detailsLink: { type: String, default: "N/A" },
  description: { type: String, default: "N/A" },
  services: { type: String, default: "N/A" }, // for specialties
  photos: { type: String, default: "N/A" },
  imageUrl: { type: String, default: "N/A" },
  detailAddress: { type: String, default: "N/A" },
  detailPageUrl: { type: String, default: "N/A" },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    default: "defaultpassword", // Default password if not provided
  },
  active: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  role: {
    type: String,
    enum: ["facility"],
    default: "facility",
  },
  specialties: {
    type: String, // from doctors.json
    default: "N/A",
  },
  hospital_info: {
    type: String, // from hospitals.json
    default: "N/A",
  },
});

// Pre-save hook to hash the password
facilitySchema.pre("save", async function (next) {
  // Hash the password if it has been modified or if it's newly created
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare passwords
facilitySchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Static method for facility login
facilitySchema.statics.login = async function (email, password) {
  const facility = await this.findOne({ email });
  if (!facility) {
    throw new Error("Facility not found");
  }
  const isMatch = await bcrypt.compare(password, facility.password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }
  if (!facility.active) {
    throw new Error("Facility is not active yet");
  }
  return facility;
};

const Facility = mongoose.model("Facility", facilitySchema);
module.exports = Facility;
