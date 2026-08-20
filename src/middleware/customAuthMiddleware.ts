import type { NextFunction, Request, Response } from "express";
import { getAuth } from "@clerk/express";

export const protect = (req: Request, res: Response, next: NextFunction) => {
  const { isAuthenticated } = getAuth(req);
  if (!isAuthenticated) {
    return res.status(401).json({ error: "Unauthenticated user" });
  }

  next();
};
