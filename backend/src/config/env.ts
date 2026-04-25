import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  MONGO_URI: z.string().url("MONGO_URI must be a valid MongoDB connection string"),
  MONGO_DB_NAME: z.string().trim().min(1).default("bookx"),
  JWT_SECRET: z.string().min(12, "JWT_SECRET must be at least 12 characters"),
  JWT_EXPIRES_IN: z.string().min(1).default("1d"),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("Invalid environment variables", parsedEnv.error.flatten().fieldErrors);
  throw new Error("Environment variable validation failed");
}

export const env = parsedEnv.data;
