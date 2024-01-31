import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from 'dotenv';
import { router } from "./router.js";
dotenv.config();

const port = 5000;

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "https://cdes-backend.vercel.app"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// connect to mongodb 
const connectToDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};

connectToDB();

app.use(express.json());
app.use(cors());
app.use("/api" , router)
app.get("/", (req, res) => {
  res.send("Hello World! And port is Working");
});

io.on("connection", (socket) => {
  // console.log("User Connected", socket.id);

  socket.on("message", ({  model, roomName }) => {
    // console.log({  model, roomName });
    // console.log("model=> ", model)
    socket.to(roomName).emit("receive-message", model);
  });

  socket.on("join-room", (room) => {
    socket.join(room);
    // console.log(`User joined room ${room}`);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});