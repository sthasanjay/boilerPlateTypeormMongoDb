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

// export default app;
