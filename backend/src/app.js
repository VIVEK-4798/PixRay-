const express = require("express");
const cors = require("cors");
const path = require("path");
const { errorHandler } = require("./middleware/errorHandler");

const authRoutes = require("./routes/authRoutes");
const imageRoutes = require("./routes/imageRoutes");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);

// Serve uploaded files statically
const uploadDir = process.env.UPLOAD_DIR || "uploads";
app.use("/" + uploadDir, express.static(path.join(__dirname, "..", uploadDir)));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/images", imageRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("PixRay API running");
});

// Error handler
app.use(errorHandler);

module.exports = app;
