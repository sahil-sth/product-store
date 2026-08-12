import type { Request, Response, NextFunction } from "express";
import { ENV } from "../config/env.js";
export const errorMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (ENV.NODE_ENV == "development") {
    res.status(500).json({
      error:
        "Error happened. Error: " +
        error.message +
        " error stack: " +
        error.stack,
    });
  } else {
    console.error(
      "Error happened. Error: " +
        error.message +
        " error stack: " +
        error.stack,
    );
    res.status(500).json({
      error: "Something went wrong. Please check the longs ",
    });
  }
};
