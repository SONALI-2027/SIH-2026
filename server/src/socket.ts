import { Server } from "socket.io";

export function setupSocket(io: Server): void {
  io.on("connection", (socket) => {
    console.log(`🔌 Client connected: ${socket.id}`);

    socket.on("test", (payload) => {
      console.log(`📨 Test event from ${socket.id}:`, payload);
      socket.emit("test", payload);
    });

    socket.on("disconnect", (reason) => {
      console.log(`❌ Client disconnected: ${socket.id} (${reason})`);
    });
  });
}
