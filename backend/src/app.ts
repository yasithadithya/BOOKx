import express, { Application } from "express";
import healthRoutes from "./routes/health.route";
import authRoutes from "./routes/auth.route";
import { notFoundHandler } from "./middlewares/not-found.middleware";
import { errorHandler } from "./middlewares/error.middleware";

const app: Application = express();

app.use(express.json());

app.use("/api", healthRoutes);
app.use("/api/auth", authRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
