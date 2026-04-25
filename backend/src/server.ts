import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import { env } from "./config/env";
import { closeDatabaseConnection, connectToDatabase } from "./config/database";

const PORT = env.PORT;

const startServer = async (): Promise<void> => {
  try {
    await connectToDatabase();

    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

const shutdown = async (): Promise<void> => {
  await closeDatabaseConnection();
  process.exit(0);
};

process.on("SIGINT", () => {
  void shutdown();
});

process.on("SIGTERM", () => {
  void shutdown();
});

void startServer();