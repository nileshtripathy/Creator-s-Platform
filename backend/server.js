const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Sample REST API (to prove it still works)
app.get("/api/test", (req, res) => {
  res.json({ message: "REST API working ✅" });
});

// Create HTTP server
const httpServer = http.createServer(app);

// Attach Socket.io
const io = new Server(httpServer, {
  cors: {
    origin: "*", // change to frontend URL later
    methods: ["GET", "POST"]
  }
});

// Socket connection
io.on("connection", (socket) => {
  console.log("🟢 Connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("🔴 Disconnected:", socket.id);
  });
});

// Start server
const PORT = 3000;

httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});