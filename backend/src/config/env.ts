import dotenv from "dotenv";

dotenv.config();

if (
  !process.env.PORT ||
  !process.env.DB_URL ||
  !process.env.NODE_ENV ||
  !process.env.FRONTEND_URL ||
  !process.env.JWT_SECRET
) {
  throw new Error("Missing required environment variables");
}

export const ENV = {
  PORT: process.env.PORT,
  DB_URL: process.env.DB_URL,
  NODE_ENV: process.env.NODE_ENV,
  JWT_SECRET: process.env.JWT_SECRET,
  FRONTEND_URL: process.env.FRONTEND_URL,
};
