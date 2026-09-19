import { ENV } from "../config/env.js";
import { Pool } from "pg";
import * as schema from "./schema.js";
import { drizzle } from "drizzle-orm/node-postgres";

const pool = new Pool({ connectionString: ENV.DB_URL });

pool.on("connect", () => {
  console.log("✅ Database connection successful");
});

pool.on("error", (error) => {
  console.log("❌ Database connection failed. Error: " + error);
});

export const db = drizzle({ client: pool, schema });
