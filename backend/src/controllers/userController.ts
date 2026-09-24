import type { Request, Response } from "express";
import bcrypt from "bcrypt";

import * as queries from "../db/queries.js";
import { ENV } from "../config/env.js";
import generateToken from "../utils/generateToken.js";

export const signUp = async (req: Request, res: Response) => {
  // when body is missing
  if (!req.body) {
    return res
      .status(400)
      .json({ error: "Missing required fields to create a new user" });
  }
  const { email, name, password } = req.body;
  // check if all the data is provided
  if (!email || !name || !password) {
    return res
      .status(400)
      .json({ error: "Missing required fields to create a new user" });
  }
  // get the user with the email provided (if any)
  const existingUser = await queries.getUserByEmail(email);

  // if the user is there, return a 400 error
  if (existingUser) {
    return res.status(400).json({ error: "Email address is already in use" });
  }
  // hash the password
  const passwordHash = await bcrypt.hash(password, ENV.BCRYPT_SALT_ROUND);

  // send the body to the user
  const user = await queries.createUser({ email, passwordHash, name });
  const token = generateToken(user.id, res);
  res.status(201).json({ user });
};
// login functionality
export const login = async (req: Request, res: Response) => {
  // when body is missing
  if (!req.body) {
    return res
      .status(400)
      .json({ error: "Missing required fields to authenticate a user" });
  }
  const { email, password } = req.body;
  // check if all the data is provided
  if (!email || !password) {
    return res
      .status(400)
      .json({ error: "Missing required fields to authenticate a user" });
  }

  const user = await queries.getUserForLogin(email);

  if (!user) {
    return res.status(401).json({ error: "Incorrect email or password" });
  }

  const isPasswordMatched = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordMatched) {
    res.status(401).json({ error: "Incorrect email or password" });
  }

  generateToken(user.id, res);
  // Exclude the password hash from the response.
  const { passwordHash, ...sanitizedUser } = user;
  return res.status(200).json({ user: sanitizedUser });
};

export const logout = (req: Request, res: Response) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "User logged out" });
};
