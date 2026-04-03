module.exports = (io) => {
  const express = require("express");
  const router = express.Router();
  const auth = require("../middleware/auth");

  // Create Post
  router.post("/create", auth, (req, res) => {
    const { title } = req.body;

    const newPost = {
      title,
      user: req.user.email,
      createdAt: new Date()
    };

    // 🔥 Emit real-time event
    io.emit("newPost", newPost);

    res.json({
      message: "Post created",
      post: newPost
    });
  });

  return router;
};