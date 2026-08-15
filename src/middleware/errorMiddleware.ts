import type { Request, Response, NextFunction } from "express";
import { ENV } from "../config/env.js";
const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  if (err.name === "CastError") {
    statusCode = 404;
    message = "Resource not found";
  }

  res.status(statusCode).json({
    message,
    stack: ENV.NODE_ENV === "production" ? null : err.stack,
  });

  console.error("Error: " + err.message + ", Error stack: " + err.stack);
};

export { errorHandler, notFound };
