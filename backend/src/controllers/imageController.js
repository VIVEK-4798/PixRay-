const Image = require("../models/Image");
const path = require("path");

const createImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const url = `/${req.file.path.replace(/\\/g, "/")}`; // serve via static

    const image = await Image.create({
      user: req.user._id,
      filename: req.file.filename,
      originalName: req.file.originalname,
      url,
      prompt: req.body.prompt || "",
    });

    res.status(201).json(image);
  } catch (err) {
    res.status(500).json({ message: err.message || "Server error" });
  }
};

const getMyImages = async (req, res) => {
  try {
    const images = await Image.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(images);
  } catch (err) {
    res.status(500).json({ message: err.message || "Server error" });
  }
};

const deleteImage = async (req, res) => {
  try {
    const image = await Image.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    await image.deleteOne();
    // (Optional) also delete file from disk if you want

    res.json({ message: "Image deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message || "Server error" });
  }
};

module.exports = { createImage, getMyImages, deleteImage };
