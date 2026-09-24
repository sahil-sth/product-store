import { db } from "./index.js";
import { eq } from "drizzle-orm";
import {
  users,
  products,
  comments,
  type NewUser,
  type NewProduct,
  type NewComment,
} from "./schema.js";

// the fields that can actually be returned from the query
const publicUserFields = {
  id: users.id,
  email: users.email,
  name: users.name,
  createdAt: users.createdAt,
  updatedAt: users.updatedAt,
};

// User Queries
export const createUser = async (data: NewUser) => {
  const [user] = await db
    .insert(users)
    .values(data)
    .returning(publicUserFields);
  return user;
};

export const getUserByEmail = async (email: string) => {
  return await db.query.users.findFirst({
    where: eq(users.email, email),
    columns: { passwordHash: false },
  });
};

export const getUserById = async (id: string) => {
  return await db.query.users.findFirst({
    where: eq(users.id, id),
    columns: { passwordHash: false },
  });
};

export const updateUser = async (id: string, data: Partial<NewUser>) => {
  const existingUser = await db.query.users.findFirst({
    where: eq(users.id, id),
    columns: { id: true },
  });
  if (!existingUser) {
    throw new Error(`User with id: ${id} does not exist to update.`);
  }
  const [user] = await db
    .update(users)
    .set(data)
    .where(eq(users.id, id))
    .returning(publicUserFields);
  return user;
};

export const upsertUser = async (data: NewUser) => {
  //   const existingUser = await getUserById(data.id); // get the user with the id
  //   // if the id already exists, then update and if not then create a new user.
  //   if (existingUser) {
  //     return updateUser(data.id, data);
  //   }
  //   return await createUser(data);

  const [user] = await db
    .insert(users)
    .values(data)
    .onConflictDoUpdate({
      target: users.id,
      set: data,
    })
    .returning(publicUserFields);
  return user;
};

// Product Queries
export const createProduct = async (data: NewProduct) => {
  const [product] = await db.insert(products).values(data).returning();
  return product;
};

export const getAllProducts = async () => {
  return db.query.products.findMany({
    with: { user: { columns: { passwordHash: false } } },
    orderBy: (products, { desc }) => [desc(products.createdAt)],
  });
};

export const getProductById = async (id: string) => {
  return db.query.products.findFirst({
    with: {
      user: { columns: { passwordHash: false } },
      comments: {
        with: { user: { columns: { passwordHash: false } } },
        orderBy: (comments, { desc }) => [desc(comments.createdAt)],
      },
    },
    where: eq(products.id, id),
  });
};

export const getProductsByUserId = async (userId: string) => {
  return db.query.products.findMany({
    where: eq(products.userId, userId),
    with: {
      user: { columns: { passwordHash: false } },
    },
    orderBy: (products, { desc }) => [desc(products.createdAt)],
  });
};

export const updateProduct = async (id: string, data: Partial<NewProduct>) => {
  const existingProduct = await db.query.products.findFirst({
    where: eq(products.id, id),
  });
  // if the product does not exist, then throw an error
  if (!existingProduct) {
    throw new Error(`Product with id: ${id} does not exist to update.`);
  }
  const [product] = await db
    .update(products)
    .set(data)
    .where(eq(products.id, id))
    .returning();

  return product;
};

export const deleteProduct = async (id: string) => {
  const existingProduct = await db.query.products.findFirst({
    where: eq(products.id, id),
  });
  if (!existingProduct) {
    throw new Error(`Product with ${id} does not exist to delete.`);
  }
  const [product] = await db
    .delete(products)
    .where(eq(products.id, id))
    .returning();
  return product;
};

// Comment Queries
export const createComment = async (data: NewComment) => {
  const [comment] = await db.insert(comments).values(data).returning();
  return comment;
};

export const deleteComment = async (id: string) => {
  const existingComment = await db.query.comments.findFirst({
    where: eq(comments.id, id),
  });
  if (!existingComment) {
    throw new Error(`Comment with ${id} does not exist to delete.`);
  }
  const [comment] = await db
    .delete(comments)
    .where(eq(comments.id, id))
    .returning();
  return comment;
};

export const getCommentById = async (id: string) => {
  const comment = await db.query.comments.findFirst({
    where: eq(comments.id, id),
    with: { user: { columns: { passwordHash: false } } },
  });
  return comment;
};
