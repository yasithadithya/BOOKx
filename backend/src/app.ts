import express, { Application } from "express";
import healthRoutes from "./routes/health.route";

const app: Application = express();

app.use(express.json());

app.use("/api", healthRoutes);

export default app;
