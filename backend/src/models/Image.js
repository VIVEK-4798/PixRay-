const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    filename: {
      type: String,
      required: true,
    },
    originalName: {
      type: String,
    },
    url: {
      type: String, // if you serve from /uploads or a CDN
      required: true,
    },
    prompt: {
      type: String,
    },
  },
  { timestamps: true }
);

const Image = mongoose.model("Image", imageSchema);

module.exports = Image;
