import type { getUserById } from "../db/queries.js";

type AuthUser = NonNullable<Awaited<ReturnType<typeof getUserById>>>;

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export {};
