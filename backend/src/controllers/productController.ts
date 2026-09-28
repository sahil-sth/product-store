import type { Request, Response } from "express";
import * as queries from "../db/queries.js";
import { uploadImage } from "../utils/uploadImage.js";
import cloudinary from "../cloudinary/index.js";

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
  const { title, description } = req.body;

  if (!title || !description || !req.file) {
    return res
      .status(400)
      .json({ error: "Title, description, and an image are required" });
  }

  const image = await uploadImage(req.file.buffer);

  let product;

  try {
    product = await queries.createProduct({
      title,
      description,
      userId: req.user.id,
      imageUrl: image.secure_url,
      imagePublicId: image.public_id,
    });
  } catch (error) {
    try {
      await cloudinary.uploader.destroy(image.public_id);
    } catch (imageCleanupError) {
      console.error("Failed to clean up uploaded image", imageCleanupError);
    }
    throw error;
  }

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

  const existingProduct = await queries.getProductById(productId);

  if (!existingProduct) {
    return res.status(404).json({ error: "No product found" });
  }

  if (userId !== existingProduct.userId) {
    return res
      .status(403)
      .json({ error: "Cannot modify other user's product" });
  }
  const { title, description } = req.body ?? {};

  if (title !== undefined && (typeof title !== "string" || !title.trim())) {
    return res.status(400).json({ error: "Title cannot be empty" });
  }

  if (
    description !== undefined &&
    (typeof description !== "string" || !description.trim())
  ) {
    return res.status(400).json({
      error: "Description cannot be empty",
    });
  }
  // only upload when the user selected a replacement
  const newImage = req.file ? await uploadImage(req.file.buffer) : null;
  let updatedProduct;
  try {
    updatedProduct = await queries.updateProduct(productId, {
      ...(title !== undefined ? { title: title.trim() } : {}),
      ...(description !== undefined ? { description: description.trim() } : {}),
      ...(newImage
        ? { imageUrl: newImage.secure_url, imagePublicId: newImage.public_id }
        : {}),
    });

    if (!updatedProduct) {
      throw new Error("Product disappeared before it could be updated");
    }
  } catch (error) {
    // Saving failed: remove the new upload, keep the old image.
    if (newImage) {
      try {
        await cloudinary.uploader.destroy(newImage.public_id);
      } catch (cleanupImageError) {
        console.error("Failed to remove new image", cleanupImageError);
      }
    }

    throw error;
  }

  // Saving succeeded: the old image is no longer needed.
  if (
    newImage &&
    existingProduct.imagePublicId &&
    existingProduct.imagePublicId !== newImage.public_id
  ) {
    try {
      await cloudinary.uploader.destroy(existingProduct.imagePublicId);
    } catch (cleanupError) {
      // The product update succeeded; don't report it as a failure.
      console.error("Failed to remove previous image", cleanupError);
    }
  }

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
