import { Request, Response } from "express";

export const healthCheck = (_req: Request, res: Response): void => {
  const validatedQuery = res.locals.validated?.query as { name?: string } | undefined;
  const name = validatedQuery?.name;

  res.status(200).json({
    status: "OK",
    message: name ? `TypeScript backend is running, ${name}` : "TypeScript backend is running",
  });
};