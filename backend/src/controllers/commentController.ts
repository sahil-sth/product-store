import type { Request, Response } from "express";
import * as queries from "../db/queries.js";

export const createComment = async (
  req: Request<{ productId: string }>,
  res: Response,
) => {
  if (!req.user) {
    return res.status(401).json({ error: "No authenticated user" });
  }
  const { id: userId } = req.user;
  if (!userId) {
    return res.status(401).json({ error: "No authenticated user" });
  }

  const { productId } = req.params;
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ error: "Content cannot be empty" });
  }

  const product = await queries.getProductById(productId);

  if (!product) {
    return res.status(404).json({
      error: `Product with id: ${productId} cannot be found to create comment`,
    });
  }

  // everything is good, call the query to add comment
  const comment = await queries.createComment({ productId, userId, content });

  return res.status(201).json({ comment });
};

export const deleteComment = async (
  req: Request<{ commentId: string }>,
  res: Response,
) => {
  if (!req.user) {
    return res.status(401).json({ error: "No authenticated user" });
  }
  const { id: userId } = req.user;
  if (!userId) {
    return res.status(401).json({ error: "No authenticated user" });
  }

  const { commentId } = req.params;
  const comment = await queries.getCommentById(commentId);

  if (!comment) {
    return res
      .status(404)
      .json({ error: `Comment with id: ${commentId} cannot be found` });
  }

  if (userId !== comment.userId) {
    return res
      .status(403)
      .json({ error: "User cannot delete someone else's comments" });
  }

  const deletedComment = await queries.deleteComment(commentId);
  res.status(200).json({ deletedComment });
};
