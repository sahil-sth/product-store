import type { Request, Response } from "express";
import * as queries from "../db/queries.js";

export const getAllProducts = async (req: Request, res: Response) => {
  const products = queries.getAllProducts();
  return res.status(200).json({ products });
};

export const getProductById = async (req: Request, res: Response) => {
  const id = req.body.id;
  if (!id) {
    throw new Error("");
  }
};
