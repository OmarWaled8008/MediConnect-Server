const fs = require("fs");
const mongoose = require("mongoose");
const path = require("path");
const Facility = require("../models/facility"); // Import the Facility model

const dotenv = require("dotenv");
dotenv.config();
// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI);
const doctorsData = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../../data/doctors.json"), "utf-8")
);
const hospitalsData = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../../data/hospitals.json"), "utf-8")
);
const medicalCentersData = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "../../data/medicalcenter.json"),
    "utf-8"
  )
);

// Common fields for default values
const commonFields = {
  facilityType: "facility",
  name: "N/A",
  locationAfterConvert: "N/A",
  city: "N/A",
  address: "N/A",
  telephone: "N/A",
  email: "",
  password: "N/A",
  services: "N/A",
  description: "N/A",
  contactInfo: "N/A",
  detailsLink: "N/A",
  photos: "N/A",
  imageUrl: "N/A",
  detailAddress: "N/A",
  detailPageUrl: "N/A",
  hospital_info: "N/A",
  active: false,
  role: "facility",
};

let nullCounter = 1;

// Helper function to unify keys based on the mapping
const unifyKeys = (entry, mapping) => {
  let unifiedEntry = {};
  Object.keys(entry).forEach((key) => {
    const newKey = mapping[key] || key;
    unifiedEntry[newKey] = entry[key];
  });
  return unifiedEntry;
};

// Define key mappings for each dataset
const doctorMapping = {
  hospital_name: "name",
  specialties: "services",
  address: "address",
  city_area: "city",
};

const hospitalMapping = {
  "Hospital Name": "name",
  "Street Address": "address",
  "City/Area": "city",
  Telephone: "telephone",
  Email: "email",
  Description: "description",
  "Contact Info": "contactInfo",
  Photos: "photos",
  "Details Link": "detailPageUrl",
  hospital_info: "hospital_info",
};

const medicalCenterMapping = {
  Name: "name",
  Services: "services",
  Location: "address",
  "City/Area": "city",
  "Detail Address": "detailAddress",
  Telephone: "telephone",
  "Image URL": "imageUrl",
  "Detail Page URL": "detailPageUrl",
};

// Function to unify the data and fill in missing fields
const unifyData = (data, facilityType, mapping) => {
  return data.map((entry) => {
    let unifiedEntry = {
      ...commonFields,
      ...unifyKeys(entry, mapping),
      facilityType,
    };

    // Fill in any missing fields with defaults
    Object.keys(unifiedEntry).forEach((field) => {
      if (!unifiedEntry[field]) {
        unifiedEntry[field] = commonFields[field] || `N/A`;
      }
    });

    // Generate a unique email if not present
    if (!unifiedEntry.email || unifiedEntry.email === "N/A") {
      unifiedEntry.email = `facility${nullCounter++}@example.com`;
    }

    unifiedEntry.active = false;
    unifiedEntry.role = "facility";

    return unifiedEntry;
  });
};

// Unify the data for each type of facility
const unifiedDoctors = unifyData(doctorsData, "doctor", doctorMapping);
const unifiedHospitals = unifyData(hospitalsData, "hospital", hospitalMapping);
const unifiedMedicalCenters = unifyData(
  medicalCentersData,
  "medical_center",
  medicalCenterMapping
);

// Function to insert data into MongoDB
const insertData = async (unifiedData) => {
  try {
    await Facility.insertMany(unifiedData);
    console.log("Data successfully inserted into MongoDB.");
  } catch (error) {
    console.error("Error inserting data into MongoDB: ", error);
  }
};

// Insert the unified data for each facility type into MongoDB
insertData(unifiedDoctors);
insertData(unifiedHospitals);
insertData(unifiedMedicalCenters);
