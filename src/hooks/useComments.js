import { useMutation } from "@tanstack/react-query";
import { createComment, deleteComment } from "../lib/api";

export const useCreateComment = () => {
  return useMutation({
    mutationFn: createComment,
  });
};

export const useDeleteComment = () => {
  return useMutation({
    mutationFn: deleteComment,
  });
};
