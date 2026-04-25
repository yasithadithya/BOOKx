import { NextFunction, Request, Response } from "express";
import { ZodTypeAny } from "zod";

type RequestSchema = {
  body?: ZodTypeAny;
  query?: ZodTypeAny;
  params?: ZodTypeAny;
};

export const validateRequest = (schema: RequestSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const validated = {
        body: schema.body ? schema.body.parse(req.body) : req.body,
        query: schema.query ? schema.query.parse(req.query) : req.query,
        params: schema.params ? schema.params.parse(req.params) : req.params,
      };

      res.locals.validated = validated;
      next();
    } catch (error) {
      next(error);
    }
  };
};
