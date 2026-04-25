import { Router } from "express";
import { z } from "zod";
import { login, register } from "../controllers/auth.controller";
import { validateRequest } from "../middlewares/validate-request.middleware";
import { USER_ROLES } from "../types/user.types";

const router = Router();

const registerBodySchema = z.object({
  userName: z.string().trim().min(2, "userName must be at least 2 characters").max(80),
  email: z.string().trim().email("A valid email is required").transform((value) => value.toLowerCase()),
  password: z.string().min(6, "password must be at least 6 characters").max(128),
  Role: z.enum(USER_ROLES),
});

const loginBodySchema = z.object({
  email: z.string().trim().email("A valid email is required").transform((value) => value.toLowerCase()),
  password: z.string().min(6, "password must be at least 6 characters").max(128),
});

router.post("/register", validateRequest({ body: registerBodySchema }), register);
router.post("/login", validateRequest({ body: loginBodySchema }), login);

export default router;
