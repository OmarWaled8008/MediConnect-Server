const multer = require("multer");
const path = require("path");

// File type validation
const fileFilter = (_req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    return cb(
      new Error("Only images (jpeg, jpg, png, gif) are allowed"),
      false
    );
  }
};

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.join(__dirname, "../uploads/")); // Use path.join for cross-platform compatibility
  },
  filename: (_req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5MB file size limit
});

// Middleware to handle upload errors
upload.single("image"),
  (err, _req, res, next) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  };

module.exports = upload;
