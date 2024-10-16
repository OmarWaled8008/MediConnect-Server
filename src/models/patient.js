const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");
const Schema = mongoose.Schema;

const patientSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      validate: [
        validator.isMobilePhone,
        "Please provide a valid phone number",
      ],
    },
    address: {
      type: String,
      required: true,
    },
    blood_type: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      required: true,
    },
    medical_history: {
      type: [String],
      default: [],
    },
    allergies: {
      type: [String],
      default: [],
    },
    current_medication: {
      type: [String],
      default: [],
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },
    birthdate: {
      type: Date,
      required: true,
    },
    role: {
      type: String,
      enum: ["patient"],
      default: "patient",
    },
  },
  { timestamps: true }
);

patientSchema.statics.signup = async function (email, password, otherDetails) {
  validateSignupInput(email, password);
  await checkIfUserExists(this, email);
  const hashedPassword = await hashPassword(password);

  const patientData = {
    ...otherDetails,
    email,
    password: hashedPassword,
    role: "patient",
  };

  return this.create(patientData);
};

function validateSignupInput(email, password) {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }
  if (!validator.isEmail(email)) {
    throw new Error("Email is invalid");
  }
  if (!validator.isStrongPassword(password)) {
    throw new Error("Password is not strong enough");
  }
}

async function checkIfUserExists(context, email) {
  const exists = await context.findOne({ email });
  if (exists) {
    throw new Error("User already exists");
  }
}

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

patientSchema.statics.login = async function (email, password) {
  validateLoginInput(email, password);
  const user = await findUserByEmail(this, email);
  await verifyPassword(password, user.password);
  console.log(user._id);
  return { _id: user._id, role: user.role };
};

function validateLoginInput(email, password) {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }
  if (!validator.isEmail(email)) {
    throw new Error("Email is invalid");
  }
}

async function findUserByEmail(context, email) {
  const user = await context.findOne({ email });
  if (!user) {
    throw new Error("User does not exist");
  }
  return user;
}

async function verifyPassword(inputPassword, storedPassword) {
  const isMatch = await bcrypt.compare(inputPassword, storedPassword);
  if (!isMatch) {
    throw new Error("Email OR Password is incorrect");
  }
}
const Patient = mongoose.model("Patient", patientSchema);
module.exports = Patient;
