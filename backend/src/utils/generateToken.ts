import jwt from "jsonwebtoken";
import { Response } from "express";
import { ENV } from "../config/env.js";

const generateTokenAndSendAsCookie = (userId: string, res: Response) => {
  if (!userId) {
    throw new Error("userId cannot be empty to create a json web token");
  }

  const token = jwt.sign({ userId }, ENV.JWT_SECRET, {
    expiresIn: "30d",
  });
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
};

export default generateTokenAndSendAsCookie;
