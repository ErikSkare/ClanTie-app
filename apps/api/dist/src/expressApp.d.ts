declare const io: import("socket.io").Server<import("./io").ClientToServerEvents, import("./io").ServerToClientEvents, import("./io").InterServerEvents, import("./io").SocketData>;
export { io };
