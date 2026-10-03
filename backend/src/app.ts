import express from "express";
import tttRoutes from "./routes/gameRoutes.ts";
import { errorHandler } from "./middlewares/errorHandler.ts";
import cors from "cors";
const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }

      const allowedOrigins = [
        "http://localhost:5173",
        "http://192.168.1.105:5173",
      ];

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      callback(new Error("Nicht erlaubte Origin"));
    },
  }),
);

app.use(express.json());

// Routes
app.use("/api/ttt", tttRoutes);

// Global error handler (should be after routes)
app.use(errorHandler);

export default app;
