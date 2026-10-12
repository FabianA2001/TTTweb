import express from "express";
import tttRoutes from "./routes/gameRoutes.ts";
import { errorHandler } from "./middlewares/errorHandler.ts";
import { FRONTEND_PORT, IP } from "@tttweb/shared";
import cors from "cors";
const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }

      const allowedOrigins = [
        `http://${IP}:${FRONTEND_PORT}`,
        `http://localhost:${FRONTEND_PORT}`,
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
