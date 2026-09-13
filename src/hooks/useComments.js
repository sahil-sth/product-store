import { useMutation } from "@tanstack/react-query";
import { createComment } from "../lib/api";

export const useCreateComment = () => {
  return useMutation({
    mutationFn: createComment,
  });
};
