const express = require("express");
const {
  createBlogPost,
  editOwnBlogPost,
  deleteOwnBlogPost,
  getAllBlogPosts,
  getBlogPost,
  addCommentToBlogPost,
  addReactionToBlogPost,
} = require("../controllers/blogControllers");

const {
  verifyToken,
  isPatient,
  isFacilityUser,
} = require("../middlewares/authMiddleware");

const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

const router = express.Router();


router.post("/add", verifyToken, upload.single("image"), createBlogPost);

router.put("/:blogId", verifyToken, upload.single("image"), editOwnBlogPost);

router.delete("/:blogId", verifyToken, deleteOwnBlogPost);

router.get("/all", getAllBlogPosts);

router.get("/:blogId", getBlogPost);

router.post("/:blogId/comments", verifyToken, addCommentToBlogPost);

router.post("/:blogId/reactions", verifyToken, addReactionToBlogPost);

module.exports = router;
