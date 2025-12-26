const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Helper to create JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const register = async (req, res) => {
  const { email, password, name } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ email, password, name });
    const token = generateToken(user._id);

    res.status(201).json({
      _id: user._id,
      email: user.email,
      name: user.name,
      token,
    });
  } catch (err) {
    res.status(500).json({ message: err.message || "Server error" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user._id);

    res.json({
      _id: user._id,
      email: user.email,
      name: user.name,
      token,
    });
  } catch (err) {
    res.status(500).json({ message: err.message || "Server error" });
  }
};

const getMe = async (req, res) => {
  res.json(req.user);
};

module.exports = { register, login, getMe };
