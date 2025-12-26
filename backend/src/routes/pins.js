const express = require("express");
const router = express.Router();
const Pin = require("../models/Pin");

// Save pin (Unsplash or user pin)
router.post("/save", async (req, res) => {
  try {
    const { pin, userId } = req.body;

    if (!pin || !pin._id)
      return res.status(400).json({ success: false, message: "Invalid pin data" });

    // 1. Check if pin exists
    let existingPin = await Pin.findById(pin._id);

    if (!existingPin) {
      console.log("Pin does not exist, creating new document");

      existingPin = await Pin.create({
        _id: pin._id,
        title: pin.title,
        about: pin.about,
        imageUrl: pin.imageUrl,
        destination: pin.destination,
        isFromAPI: pin.isFromAPI,
        postedBy: pin.postedBy,
        category: pin.category,
      });
    }

    // 2. Prevent duplicate saves
    const alreadySaved = existingPin.saves.some((s) => s.userId === userId);

    if (!alreadySaved) {
      existingPin.saves.push({ userId });
      await existingPin.save();
    }

    res.json({
      success: true,
      message: "Pin saved successfully",
      pin: existingPin,
    });

  } catch (err) {
    console.error("Save pin error:", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

// Get all saved pins for a specific user
router.get("/saved/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const savedPins = await Pin.find({
      "saves.userId": userId,
    });

    res.json({
      success: true,
      pins: savedPins,
    });

  } catch (err) {
    console.error("Fetch saved pins error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

// Get a specific pin by ID
router.get("/:pinId", async (req, res) => {
  try {
    const { pinId } = req.params;

    const pin = await Pin.findById(pinId);

    if (!pin) {
      return res.status(404).json({
        success: false,
        message: "Pin not found",
      });
    }

    res.json({
      success: true,
      pin,
    });

  } catch (err) {
    console.error("Get single pin error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});


module.exports = router;
