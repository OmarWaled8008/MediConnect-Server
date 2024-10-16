const { body, validationResult } = require("express-validator");

exports.validateSignup = [
  body("email").isEmail().withMessage("Please enter a valid email address"),
  body("password")
    .isStrongPassword()
    .withMessage(
      "Password must contain at least 8 characters, 1 uppercase, 1 lowercase, 1 number, and 1 symbol"
    ),
  body("name").not().isEmpty().withMessage("Name is required"),
  body("phone")
    .isMobilePhone()
    .withMessage("Please enter a valid phone number"),
  body("address").not().isEmpty().withMessage("Address is required"),
  body("blood_type")
    .isIn(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"])
    .withMessage("Please provide a valid blood type"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

exports.validateLogin = [
  body("email").isEmail().withMessage("Please enter a valid email address"),
  body("password").not().isEmpty().withMessage("Password is required"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
