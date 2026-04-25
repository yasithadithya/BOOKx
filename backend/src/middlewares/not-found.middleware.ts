import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/app-error";

export const notFoundHandler = (req: Request, _res: Response, next: NextFunction): void => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
};
