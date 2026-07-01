import { useEffect, useState } from "react";
import { socket } from "../services/socket";
import toast from "react-hot-toast";

function Dashboard() {
  const [title, setTitle] = useState("");

  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      console.log("🟢 Connected:", socket.id);
    });

    // 🔥 Listen for new post
    socket.on("newPost", (data) => {
      toast.success(`New post: ${data.title}`);
    });

    return () => {
      socket.off("newPost");
      socket.disconnect();
    };
  }, []);

  const createPost = async () => {
    const token = localStorage.getItem("token");

    await fetch("http://localhost:3000/api/posts/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ title })
    });

    setTitle("");
  };

  return (
    <div>
      <h1>Dashboard</h1>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter post title"
      />

      <button onClick={createPost}>Create Post</button>
    </div>
  );
}

export default Dashboard;