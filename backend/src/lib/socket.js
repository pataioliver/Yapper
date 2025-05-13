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

// Add this helper function to emit to a room except a specific socket
export function emitToRoomExceptSender(roomId, eventName, data, senderSocketId) {
  if (!roomId || !eventName || !data) return;
  
  if (senderSocketId) {
    // Get all socket ids in the room
    const roomSockets = io.sockets.adapter.rooms.get(roomId);
    if (roomSockets) {
      // Emit to each socket in the room except the sender
      roomSockets.forEach(socketId => {
        if (socketId !== senderSocketId) {
          io.to(socketId).emit(eventName, data);
        }
      });
    }
  } else {
    // If no sender socket ID, emit to the whole room
    io.to(roomId).emit(eventName, data);
  }
}

// used to store online users
const userSocketMap = {}; // {userId: socketId}

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) {
    userSocketMap[userId] = socket.id;
    // Add user to their personal room for targeted messages
    socket.join(`user:${userId}`);
  }

  // io.emit() is used to send events to all the connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // --- GROUP CHAT  ---
  socket.on("join", ({ roomId }) => {
    socket.join(roomId);
    console.log(`${userId} joined room ${roomId}`);
  });

  socket.on("leave", ({ roomId }) => {
    socket.leave(roomId);
    console.log(`${userId} left room ${roomId}`);
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