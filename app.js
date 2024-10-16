const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

// routes
const adminRoutes = require("./src/routes/adminRoutes");
const appointmentRoutes = require("./src/routes/appointmentRoutes");
const blogRoutes = require("./src/routes/blogRoutes");
const dataRoutes = require("./src/routes/dataRoutes");
const facilityRoutes = require("./src/routes/facilityRoutes");
const patientRoutes = require("./src/routes/patientRoutes");

//app
const app = express();

// middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
 
// define routes
app.use("/api/data", dataRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/facilities", facilityRoutes);
app.use("/api/patients", patientRoutes);

// default route
app.get("/", (req, res) => {
  res.send("Welcome to the MediCinnect");
});
// 404 route
app.use((req, res, next) => {
  res.status(404).send({ message: "Route not found" });
});

module.exports = app;
