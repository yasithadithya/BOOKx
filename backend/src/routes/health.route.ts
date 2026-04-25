import { Router } from "express";
import { z } from "zod";
import { healthCheck } from "../controllers/health.controller";
import { validateRequest } from "../middlewares/validate-request.middleware";

const router = Router();

const healthQuerySchema = z.object({
  name: z.string().trim().min(2, "name must be at least 2 characters").optional(),
});

router.get("/health", validateRequest({ query: healthQuerySchema }), healthCheck);

export default router;