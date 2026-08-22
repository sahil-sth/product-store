import type { Request, Response } from "express";
import * as queries from "../db/queries.js";
import { getAuth } from "@clerk/express";
export const getAllProducts = async (req: Request, res: Response) => {
  const products = await queries.getAllProducts();
  return res.status(200).json({ products });
};

export const getProductById = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const { id } = req.params;

  const product = await queries.getProductById(id);
  if (!product) return res.status(404).json({ error: "Product not found" });

  res.status(200).json(product);
};
// Private route
export const getMyProducts = async (req: Request, res: Response) => {
  const { userId } = getAuth(req);
  if (!userId) {
    res.status(401);
    throw new Error("No authenticated user");
  }

  const products = await queries.getProductsByUserId(userId);
  if (!products) {
    return res.status(200).json({ products: [] });
  }

  res.status(200).json({ products });
};

export const createProduct = async (req: Request, res: Response) => {
  const { userId } = getAuth(req);
  if (!userId) {
    res.status(401);
    throw new Error("Unauthenticated user");
  }

  const { title, description, imageUrl } = req.body;

  if (!title || !description || !imageUrl) {
    res.status(400);
    throw new Error("Title, description, and imageUrl are required");
  }

  const product = await queries.createProduct({
    title,
    description,
    imageUrl,
    userId,
  });

  res.status(201).json({ product });
};
// protected route
export const updateProduct = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const { userId } = getAuth(req);
  const productId = req.params.id;
  const { title, description, imageUrl } = req.body;

  if (!userId) {
    res.status(401);
    throw new Error("Unauthorized access");
  }
  const existingProduct = await queries.getProductById(productId);

  if (!existingProduct) {
    res.status(404);
    throw new Error("No products found");
  }

  if (userId !== existingProduct.userId) {
    res.status(403);
    throw new Error("Cannot modify other user's product");
  }

  const updatedProduct = await queries.updateProduct(productId, {
    title,
    description,
    imageUrl,
  });

  res.status(200).json({ product: updatedProduct });
};
// Authenticated and Authorized
export const deleteProduct = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const { userId } = getAuth(req);
  const productId = req.params.id;

  if (!userId) {
    res.status(401);
    throw new Error("Unauthorised user");
  }

  const existingProduct = await queries.getProductById(productId);

  if (!existingProduct) {
    res.status(404);
    throw new Error(`Product with ID: ${productId} does not exist.`);
  }

  if (existingProduct.userId !== userId) {
    res.status(403);
    throw new Error("User cannot delete other user's products");
  }

  const deletedProduct = await queries.deleteProduct(productId);

  res.status(200).json({ product: deletedProduct });
};
