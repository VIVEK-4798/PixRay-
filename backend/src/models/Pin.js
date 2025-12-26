const mongoose = require("mongoose");

const PinSchema = new mongoose.Schema({
  _id: { type: String, required: true }, 

  title: String,
  imageUrl: String,
  about: String,
  destination: String,

  isFromAPI: { type: Boolean, default: false },

  postedBy: {
    _id: String,
    userName: String,
    image: String,
  },

  category: { type: String, default: "general" },

  saves: [
    {
      userId: String,
      savedAt: { type: Date, default: Date.now },
    },
  ],

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Pin", PinSchema);
