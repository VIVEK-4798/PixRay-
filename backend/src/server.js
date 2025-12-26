const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

require("dotenv").config();

const pinRoutes = require("./routes/pins");

const app = express();
app.use(cors());
app.use(express.json());

// Database
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB error:", err));

// Routes
app.use("/api/pins", pinRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
