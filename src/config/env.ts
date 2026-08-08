import dotenv from "dotenv";

dotenv.config();

if (
  !process.env.PORT ||
  !process.env.DB_URL ||
  !process.env.NODE_ENV ||
  !process.env.FRONTEND_URL
) {
  throw new Error("Missing required environment variables");
}

export const ENV = {
  PORT: process.env.PORT,
  DB_URL: process.env.DB_URL,
  NODE_ENV: process.env.NODE_ENV,
  FRONTEND_URL: process.env.FRONTEND_URL,
};
