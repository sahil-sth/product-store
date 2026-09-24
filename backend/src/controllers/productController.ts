import type { Request, Response } from "express";
import * as queries from "../db/queries.js";

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

  return res.status(200).json(product);
};
// Private route
export const getMyProducts = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthenticated User" });
  }
  const { id: userId } = req.user;
  if (!userId) {
    return res.status(401).json({ error: "Unauthenticated User" });
  }

  const products = await queries.getProductsByUserId(userId);
  if (!products) {
    return res.status(200).json({ products: [] });
  }

  res.status(200).json({ products });
};

export const createProduct = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthenticated User" });
  }
  const { id: userId } = req.user;
  if (!userId) {
    return res.status(401).json({ error: "Unauthenticated User" });
  }
  const { title, description, imageUrl } = req.body;

  if (!title || !description || !imageUrl) {
    return res
      .status(400)
      .json({ error: "Title, description, and imageUrl are required" });
  }

  const product = await queries.createProduct({
    title,
    description,
    userId,
    imageUrl,
  });

  return res.status(201).json({ product });
};
// protected route
export const updateProduct = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthenticated User" });
  }
  const { id: userId } = req.user;
  if (!userId) {
    return res.status(401).json({ error: "Unauthenticated User" });
  }
  const productId = req.params.id;
  const { title, description, imageUrl } = req.body;

  const existingProduct = await queries.getProductById(productId);

  if (!existingProduct) {
    return res.status(404).json({ error: "No products found" });
  }

  if (userId !== existingProduct.userId) {
    return res
      .status(403)
      .json({ error: "Cannot modify other user's product" });
  }

  const updatedProduct = await queries.updateProduct(productId, {
    title,
    description,
    imageUrl,
  });

  return res.status(200).json({ product: updatedProduct });
};
// Authenticated and Authorized
export const deleteProduct = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthenticated User" });
  }
  const { id: userId } = req.user;
  if (!userId) {
    return res.status(401).json({ error: "Unauthenticated User" });
  }
  const productId = req.params.id;

  const existingProduct = await queries.getProductById(productId);

  if (!existingProduct) {
    return res
      .status(404)
      .json({ error: `Product with ID: ${productId} does not exist.` });
  }

  if (existingProduct.userId !== userId) {
    return res
      .status(403)
      .json({ error: "User cannot delete other user's products" });
  }

  const deletedProduct = await queries.deleteProduct(productId);

  return res.status(200).json({ product: deletedProduct });
};
