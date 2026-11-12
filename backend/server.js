import dotenv from "dotenv";
dotenv.config();

import { createServer } from "http";
import { Server } from "socket.io";
import app from "./app.js";
import initializeSocket from "./socket/socket.js";
import { connectDB } from "./config/db.js";

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5137",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

initializeSocket(io);

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectDB();

    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log("Socket.IO server initialized");
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();
