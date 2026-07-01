const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Mount auth routes
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

// Health endpoint
app.get("/api/test", (req, res) => {
  res.json({ message: "REST API working ✅" });
});

module.exports = app;
