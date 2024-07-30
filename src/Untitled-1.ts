

import express from "express";
import http from "http";
import { Server } from "socket.io";
import path from "path";
import dotenv from "dotenv";
import { socketConnection } from "./socket";

// dotenv.config({ path: "./config.env" });


// // Serve static files from the 'public' directory
// app.use(express.static(path.join(__dirname, "public")));

// app.get("/", (req, res) => {
//     // const filePath = path.join(__dirname, "..", "src/public", "index.html");
//     res.send("Hello World");
// });
// // Handle Socket.io connections
// io.on("connection", (socket) => {
//     console.log(`A user connected: ${socket.id}`);
//     socketConnection(socket, io);
// });

// const PORT = process.env.PORT || 9090;
// server.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });





// import "reflect-metadata";

// // import { systemSocket } from "./controllers/socketController";
// // import { app } from "./app";

// import { connectToDatabase } from "./db.config/db";

// import express from "express";
// import http from "http";
// import { Server, Socket } from "socket.io";
// import path from "path";
// import dotenv from "dotenv";
// import { socketConnection } from "./socket";

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server);

// dotenv.config({ path: "./config.env" });
// // app.use(express.static(path.join(__dirname, "public")));
// app.get("/", (req, res) => {
//     const filePath = path.join(__dirname, "..", "src/public", "index.html");
//     return res.sendFile(filePath);
// });

// io.on("connection", (socket: Socket) => {
//     console.log(`A user connected: ${socket.id}`);
//     socketConnection(socket, io);
// });

// const port = process.env.PORT || 900;
// server.listen(port, async () => {
//     await connectToDatabase();
//     console.log(`App running on port ${port}...`);
// });

// process.on("uncaughtException", (err: Error) => {
//     console.error("UNCAUGHT EXCEPTION! 💥 Shutting down...");
//     console.error(err);
//     console.error(err.name, err.message);
//     process.exit(1);
// });

// process.on("unhandledRejection", (err: Error) => {
//     console.error("UNHANDLED REJECTION! 💥 Shutting down...");
//     console.error("err", err);
//     console.error(err.name, err.message);
//     server.close(() => {
//         process.exit(1);
//     });
// });
