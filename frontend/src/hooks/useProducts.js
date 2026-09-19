import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAllProducts,
  createProduct,
  getProductById,
  deleteProduct,
  getMyProducts,
  updateProduct,
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
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myProducts"] });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProduct,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["allProducts"] });
      queryClient.invalidateQueries({
        queryKey: ["product", variables.productId],
      });
      queryClient.invalidateQueries({ queryKey: ["myProducts"] });
    },
  });
};
