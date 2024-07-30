// socket.ts

import { Server, Socket } from "socket.io";
// import { socketConnection } from "./socketConnection"; // Assuming socketConnection handles socket events

// import{Request, Response} from "express"
// export function setupSocket(server: Server) {
//     const io = new Server(server, {
//         cors: {
//             origin: [
//                 "http://topnotch.demo-4u.com",
//                 "http://localhost:3000",
//                 "http://testing.local:8080",
//                 "https://pmscall.netlify.app",
//                 "https://demo-pmscall.netlify.app",
//                 "https://support.naasasecurities.com.np",
//             ],
//             methods: ["GET", "POST"],
//             credentials: true,
//         },
//     });

//     return io;
// }

// socket.ts

import { Server as Servers, ServerOptions } from "socket.io";
import { Server as HttpServer } from "http";

let io: Servers;

export const setupSocket = (httpServer: HttpServer): Servers => {
    io = new Servers(httpServer, {
        // Socket.io configuration options
        cors: {
            origin: "*", // Replace with your specific origins as needed
            methods: ["GET", "POST"],
            credentials: true,
        },
    });

    io.on("connection", (socket) => {
        console.log(`A user connected: ${socket.id}`);
        // Handle socket events as needed
    });

    return io;
};

export const getIO = (): Servers => {
    if (!io) {
        throw new Error("Socket.io not initialized");
    }
    return io;
};
