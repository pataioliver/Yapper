import { Server } from "socket.io";
import http from "http";
import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [process.env.FRONTEND_URL],
  },
});

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// used to store online users
const userSocketMap = {}; // {userId: socketId}

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) userSocketMap[userId] = socket.id;

  // io.emit() is used to send events to all the connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // --- GROUP CHAT  ---
  socket.on("join", ({ roomId }) => {
    socket.join(roomId);
    // Optionally: console.log(`${userId} joined room ${roomId}`);
    console.log(`${userId} joined room ${roomId}`);
  });

  socket.on("leave", ({ roomId }) => {
    socket.leave(roomId);
    // Optionally: console.log(`${userId} left room ${roomId}`);
    console.log(`${userId} left room ${roomId}`);
  });

  // Listen for group messages
  socket.on("sendGroupMessage", ({ roomId, message }) => {
    // Save message to DB here if needed
    io.to(roomId).emit("newGroupMessage", message);
  });

  // --- DM Message ---
  socket.on("sendDirectMessage", ({ toUserId, message }) => {
    const receiverSocketId = userSocketMap[toUserId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newDirectMessage", message);
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };