import express from "express";
import itemRoutes from "./routes/itemRoutes.ts";
import tttRoutes from "./routes/tttRoutes.ts";
import { errorHandler } from "./middlewares/errorHandler.ts";
import cors from "cors";
const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }

      if (origin.startsWith("http://localhost:")) {
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
