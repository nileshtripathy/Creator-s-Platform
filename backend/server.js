const http = require("http");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

// Import the app
const app = require("./app");

// Create http server and socket.io
const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*"
  }
});

io.use((socket, next) => {
  try {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error("Authentication error"));
    }

    const decoded = jwt.verify(token, "your_secret_key");

    socket.user = decoded;

    next();
  } catch (err) {
    next(new Error("Authentication error"));
  }
});

io.on("connection", (socket) => {
  console.log("🟢 Connected:", socket.id);
  console.log("👤 User:", socket.user.email);

  socket.on("disconnect", () => {
    console.log("🔴 Disconnected:", socket.id);
  });
});

// Mount post routes with real io
const postRoutes = require("./routes/post")(io);
app.use("/api/posts", postRoutes);

const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});