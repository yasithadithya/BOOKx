import { NextFunction, Request, Response } from "express";
import { loginUser, LoginUserInput, registerUser, RegisterUserInput } from "../services/auth.service";

export const register = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const validatedBody = res.locals.validated?.body as RegisterUserInput;
    const result = await registerUser(validatedBody);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const validatedBody = res.locals.validated?.body as LoginUserInput;
    const result = await loginUser(validatedBody);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
