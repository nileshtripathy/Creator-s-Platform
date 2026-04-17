module.exports = (io) => {
  const express = require("express");
  const router = express.Router();
  const auth = require("../middleware/auth");

  // In-memory posts store (id is incremental)
  const posts = [];
  let nextId = 1;

  // Get all posts
  router.get("/", auth, (req, res) => {
    res.json({ success: true, posts });
  });

  // Create Post
  router.post("/create", auth, (req, res) => {
    const { title } = req.body;

    const newPost = {
      id: nextId++,
      title,
      user: req.user.email,
      createdAt: new Date()
    };

    posts.push(newPost);

    // 🔥 Emit real-time event
    io.emit("newPost", newPost);

    res.json({ message: "Post created", post: newPost });
  });

  // Update Post
  router.put("/:id", auth, (req, res) => {
    const id = Number(req.params.id);
    const { title } = req.body;

    const post = posts.find((p) => p.id === id);
    if (!post) return res.status(404).json({ success: false, message: "Post not found" });

    if (post.user !== req.user.email) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    post.title = title ?? post.title;
    post.updatedAt = new Date();

    io.emit("updatePost", post);

    res.json({ success: true, post });
  });

  // Delete Post
  router.delete("/:id", auth, (req, res) => {
    const id = Number(req.params.id);
    const index = posts.findIndex((p) => p.id === id);
    if (index === -1) return res.status(404).json({ success: false, message: "Post not found" });

    const post = posts[index];
    if (post.user !== req.user.email) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    posts.splice(index, 1);

    io.emit("deletePost", { id });

    res.json({ success: true, message: "Post deleted" });
  });

  return router;
};