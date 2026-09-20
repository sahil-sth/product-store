import express from "express";
import { ENV } from "./config/env.js";
import cors from "cors";
import path from "path";
import { clerkMiddleware } from "@clerk/express";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

// initialize express app
const app = express();

// add middlewares
app.use(cors({ origin: ENV.FRONTEND_URL, credentials: true }));
app.use(clerkMiddleware()); // attaches the auth obj to the request
app.use(express.json()); // parse the json body
app.use(express.urlencoded({ extended: true })); // parse form data

// routes
const baseApiUrl = "/api/v1";
app.get(baseApiUrl + "/health", (req, res) =>
  res.status(200).json({ message: "API for product-store" }),
);
app.use(baseApiUrl + "/users", userRoutes);
app.use(baseApiUrl + "/products", productRoutes);
app.use(baseApiUrl + "/comments", commentRoutes);

if (ENV.NODE_ENV === "production") {
  const ___dirname = path.resolve();
  // serve static files from frontend/dist
  app.use(express.static(path.join(___dirname, "../frontend/dist")));

  // handle SPA routing --send al non-API routes to index.html: our react app
  app.get("/{*any}/", (req, res) => {
    res.sendFile(path.join(___dirname, "../frontend/dist/index.html"));
  });
}

// this is not used because if a user calls any unknown routes the code above already triggers them
// app.use(notFound);

// error (custom middlewares)
app.use(errorHandler);

// server
app.listen(ENV.PORT, () =>
  console.log(`Server is up and running on port: ` + ENV.PORT),
);
