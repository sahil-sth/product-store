import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { ENV } from "../config/env.js";
import { getUserById } from "../db/queries.js";
export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // extract the token from the cookie
  const token = req.cookies.token;
  // no token should immediately trigger a 401: Unauthorized Access
  if (!token) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
  // variables to hold data coming from token
  let userId: string;

  try {
    const payload = jwt.verify(token, ENV.JWT_SECRET);
    // Reject string payloads; we expect an object containing userId.
    if (typeof payload === "string") {
      return res.status(401).json({ message: "Invalid token payload" });
    }
    userId = payload.userId;

    if (typeof userId !== "string") {
      return res
        .status(401)
        .json({ message: "Missing or invalid ID in token" });
    }
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }

  try {
    const user = await getUserById(userId);
    if (!user) {
      return res.status(401).json({ message: "Invalid userId provided" });
    }
    req.user = user;
    return next();
  } catch (error) {
    return next(error);
  }
};
