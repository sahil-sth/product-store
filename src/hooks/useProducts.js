import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getAllProducts,
  createProduct,
  getProductById,
  deleteProduct,
  getMyProducts,
} from "../lib/api";
export const useProducts = () => {
  return useQuery({
    queryKey: ["allProducts"],
    queryFn: getAllProducts,
  });
};

export const useMyProducts = () => {
  return useQuery({
    queryKey: ["myProducts"],
    queryFn: getMyProducts,
  });
};

export const useCreateProducts = () => {
  return useMutation({
    mutationFn: createProduct,
  });
};

export const useProduct = (productId) => {
  return useQuery({
    queryKey: ["product", productId],
    queryFn: () => getProductById(productId),
    enabled: !!productId,
  });
};

export const useDeleteProduct = () => {
  return useMutation({
    mutationFn: deleteProduct,
  });
};
