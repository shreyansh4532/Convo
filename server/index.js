import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/AuthRoute.js";
import contactRoutes from "./routes/ContactRoute.js";
import setupSocket from "./socket.js";
import messageRoutes from "./routes/MessagesRoute.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const databaseURL = process.env.DATABASE_URL;

app.use(
  cors({
    origin: [process.env.ORIGIN, process.env.OTHER_ORIGIN],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

app.use("/uploads/profiles", express.static("uploads/profiles"));

app.use(cookieParser());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/messages', messageRoutes);

mongoose
  .connect(databaseURL)
  .then(() => console.log("DB connection successfull"))
  .catch((err) => console.log(err.message));

const server = app.listen(port, () => {
  console.log(`Server running on http://localhost/${port}`);
});

setupSocket(server);