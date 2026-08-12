import type { Request, Response } from "express";
import * as queries from "../db/queries.js";
import { getAuth } from "@clerk/express";

export const syncUser = async (req: Request, res: Response) => {
  const { userId } = getAuth(req);
  if (!userId) {
    res.status(401);
    throw new Error("Unauthorized");
  }

  const { email, name, imageUrl } = req.body;

  if (!email || !name || !imageUrl) {
    res.status(400);
    throw new Error("Email, Name, and Image Url are required in the body");
  }

  const user = await queries.upsertUser({
    id: userId,
    email,
    name,
    imageUrl,
  });

  res.status(200).json({ user });
};
