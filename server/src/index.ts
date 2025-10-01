import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path"; 
import connectDB from "./config/db";

import authRoutes from "./routes/authRoutes";
import adminRoutes from "./routes/adminRoutes";
import datasetRoutes from "./routes/datasetRoutes";

dotenv.config();

const app: Application = express();

const startServer = async () => {
  await connectDB();

  app.use(cors());
  app.use(express.json());

  app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

  // --- API Routes ---
  app.use("/api/auth", authRoutes);
  app.use("/api/admin", adminRoutes);
  app.use("/api/datasets", datasetRoutes);

  app.get("/", (req: Request, res: Response) =>
    res.send("Petrii MVP Backend is running!")
  );

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

startServer();
