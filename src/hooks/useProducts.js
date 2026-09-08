import { useMutation, useQuery } from "@tanstack/react-query";
import { getAllProducts, createProduct } from "../lib/api";
export const useProducts = () => {
  return useQuery({
    queryKey: ["allProducts"],
    queryFn: getAllProducts,
  });
};

export const useCreateProducts = () => {
  return useMutation({
    mutationFn: createProduct,
  });
};
