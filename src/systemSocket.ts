import { Server, Socket } from "socket.io";

export const socketConnection = (socket: Socket, io: Server) => {
    // Handle user disconnection
    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
    });

    // Handle incoming messages
    socket.on("sendMessage", (message: string) => {
        console.log(`Received message: ${message} from ${socket.id}`);

        // Broadcast the user's message to all clients
        io.emit("receiveMessage", `User: ${message}`);

        // Send automatic responses in sequence
        socket.emit("receiveMessage", "Server: Hello");

        // Adding a delay before sending the next message
        setTimeout(() => {
            socket.emit("receiveMessage", "Server: How may I help you?");
        }, 1000); // 1000 milliseconds delay for a more realistic interaction
    });
};
