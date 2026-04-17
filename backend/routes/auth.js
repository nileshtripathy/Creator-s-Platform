const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

// Simple in-memory user store for testing
const users = [];

// Register
router.post("/register", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ success: false, message: "Missing email or password" });

  const exists = users.find((u) => u.email === email);
  if (exists) return res.status(400).json({ success: false, message: "User already exists" });

  users.push({ email, password });

  const token = jwt.sign({ email }, "your_secret_key", { expiresIn: "1h" });

  res.json({ success: true, token });
});

// Login
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ success: false, message: "Missing email or password" });

  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ success: false, message: "Invalid credentials" });

  const token = jwt.sign({ email }, "your_secret_key", { expiresIn: "1h" });

  res.json({ success: true, token });
});

module.exports = router;
