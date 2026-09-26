import axiosService from "./axios";

export const syncUser = async (userData) => {
  const { data } = await axiosService.post("/users/sync", userData);
  return data;
};

export const getAllProducts = async () => {
  const { data } = await axiosService.get("/products");
  return data.products;
};

export const getProductById = async (productId) => {
  const { data } = await axiosService.get(`/products/${productId}`);
  return data;
};

export const getMyProducts = async () => {
  const { data } = await axiosService.get("/products/my");
  return data;
};

export const createProduct = async (productData) => {
  const { data } = await axiosService.post("/products", productData);
  return data;
};

export const updateProduct = async ({ productId, ...productData }) => {
  const { data } = await axiosService.put(
    `/products/${productId}`,
    productData,
  );
  return data;
};

export const deleteProduct = async (productId) => {
  const { data } = await axiosService.delete(`/products/${productId}`);
  return data;
};

export const createComment = async ({ productId, content }) => {
  const { data } = await axiosService.post(`comments/${productId}`, {
    content,
  });
  return data;
};

export const deleteComment = async ({ commentId }) => {
  const { data } = await axiosService.delete(`/comments/${commentId}`);
  return data;
};

export const me = async () => {
  try {
    const { data } = await axiosService.get("/users/me");
    return data.user;
  } catch (error) {
    // 401 means that the user is not logged in/authenticated
    if (error.response?.status === 401) {
      return null;
    }

    // this is a network/server error
    throw error;
  }
};

export const login = async ({ email, password }) => {
  const { data } = await axiosService.post("/users/login", {
    email,
    password,
  });
  return data.user;
};
