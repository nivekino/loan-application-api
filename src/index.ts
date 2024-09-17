import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { json } from "body-parser";
import creditRoutes from "./routes/credit.routes";
import logger from "./utils/logger";
import { connectToDatabase } from "./database";
import dotenv from "dotenv";

dotenv.config();

try {
  logger.info("Server is up and running");

  connectToDatabase();

  const app = express();
  const port = process.env.PORT || 3000;

  const corsOptions = {
    origin: process.env.ALLOWED_ORIGINS || "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  };

  app.use(cors(corsOptions));
  app.use(helmet());
  app.use(morgan("dev"));
  app.use(json());

  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message:
      "Too many requests from this IP, please try again after 15 minutes",
  });

  app.use(limiter);

  app.get("/", (req, res) => {
    res.status(200).json({ msg: "Server is up and running" });
  });

  app.use("/api", creditRoutes);

  app.use((err, req, res, next) => {
    logger.error(`Error: ${err.message}`);
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  });

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
} catch (error) {
  logger.error(`Error starting the server: ${error}`);
  process.exit(1);
}
