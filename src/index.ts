// import http from "http";
// import { setupSocket } from "./socket";

// import { Server, Socket } from "socket.io";
// import { socketConnection } from "./systemSocket";

// // app.ts

// import "reflect-metadata";
// import express, { Application } from "express";
// import morgan from "morgan";
// import helmet from "helmet";
// import cors from "cors";
// import path from "path";
// import cookieParser from "cookie-parser";
// import fileUpload from "express-fileupload";
// import { controllerRouter } from "./route/indexRoute";

// const app: Application = express();

// app.set("trust proxy", true);

// // Set CORS options
// const corsOptions = {
//     origin: [
//         "http://topnotch.demo-4u.com",
//         "http://localhost:3000",
//         "http://testing.local:8080",
//         "https://pmscall.netlify.app",
//         "https://demo-pmscall.netlify.app",
//         "https://support.naasasecurities.com.np",
//     ],
//     optionsSuccessStatus: 200,
// };
// app.use(cors(corsOptions));

// // Set security HTTP headers
// app.use(helmet());

// // Development logging
// if (process.env.NODE_ENV === "development") {
//     app.use(morgan("dev"));
// }

// // Body parser, reading data from body into req.body
// app.use(express.json({ limit: "10kb" }));
// app.use(express.urlencoded({ extended: true, limit: "10kb" }));
// app.use(cookieParser());

// // File upload
// app.use(fileUpload());

// // View engine setup (example using EJS)
// app.set("views", path.join(__dirname, "views"));
// app.set("view engine", "ejs");

// // Serve static files from the 'public' directory
// app.use(express.static(path.join(__dirname, "public")));

// // Routes setup
// app.use("/api", controllerRouter());

// const PORT = process.env.PORT || 9090;

// const server = http.createServer(app);

// server.listen(PORT, async () => {
//     console.log(`Server running on port ${PORT}`);

//     // Additional initialization (e.g., database connection)
// });

// const io = setupSocket(server);

// io.on("connection", (socket: Socket) => {
//     console.log(`User connected: ${socket.id}`);
//     socketConnection(socket, io);
// });
import "reflect-metadata";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import path from "path";
import dotenv from "dotenv";
import { socketConnection } from "./systemSocket";

import { connectToDatabase } from "./db.config/db";
dotenv.config({ path: "./config.env" });

const app = express();
// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    const filePath = path.join(__dirname, "..", "src/public", "index.html");
    return res.send(filePath);
});
// Handle Socket.io connections
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 9090;
server.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    await connectToDatabase();
    io.on("connection", (socket) => {
        console.log(`A user connected: ${socket.id}`);
        socketConnection(socket, io);
    });
});
