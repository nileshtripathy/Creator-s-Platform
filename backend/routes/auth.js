const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const userStore = require("../models/userStore");

// Register
router.post("/register", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ success: false, message: "Missing email or password" });

  const exists = userStore.findUser(email);
  if (exists) return res.status(400).json({ success: false, message: "User already exists" });

  userStore.addUser(email, password);

  const token = jwt.sign({ email }, "your_secret_key", { expiresIn: "1h" });

  res.json({ success: true, token });
});

// Login
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ success: false, message: "Missing email or password" });

  const user = userStore.findUserByCredentials(email, password);
  if (!user) return res.status(401).json({ success: false, message: "Invalid credentials" });

  const token = jwt.sign({ email }, "your_secret_key", { expiresIn: "1h" });

  res.json({ success: true, token });
});

// For tests: expose an endpoint to clear users (only in test env)
if (process.env.NODE_ENV === "test") {
  router.post("/__test__/clear-users", (req, res) => {
    userStore.clearAll();
    res.json({ success: true });
  });
}

module.exports = router;
