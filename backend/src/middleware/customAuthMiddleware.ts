import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { ENV } from "../config/env.js";
import { getUserById } from "../db/queries.js";
export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies.token;
  if (token) {
    const payload = jwt.verify(token, ENV.JWT_SECRET);
    // check if the payload is string or not. It can only be string
    if (typeof payload === "string") {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    const userId = payload.userId;
    if (typeof userId !== "string") {
      return res
        .status(401)
        .json({ message: "Missing or invalid ID in token" });
    }
    const user = await getUserById(userId);

    if (!user) {
      return res.status(401).json({ message: "Invalid userId provided" });
    }

    req.user = user;
    next();
  }

  return res.status(401).json({ message: "Invalid token" });
};
