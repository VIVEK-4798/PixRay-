const express = require("express");
const {
  createImage,
  getMyImages,
  deleteImage,
} = require("../controllers/imageController");
const { protect } = require("../middleware/authMiddleware");
const { upload } = require("../middleware/uploadMiddleware");

const router = express.Router();

// POST /api/images  (with file upload)
// GET  /api/images  (list my images)
router
  .route("/")
  .post(protect, upload.single("file"), createImage)
  .get(protect, getMyImages);

// DELETE /api/images/:id
router.route("/:id").delete(protect, deleteImage);

module.exports = router;
