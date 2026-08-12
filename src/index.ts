import express from "express";
import { ENV } from "./config/env.js";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

// initialize express app
const app = express();

// add middlewares
app.use(cors({ origin: ENV.FRONTEND_URL }));
app.use(clerkMiddleware); // attaches the auth obj to the request
app.use(express.json()); // parse the json body
app.use(express.urlencoded({ extended: true })); // parse form data

// routes
app.get("/", (req, res) => res.status(200).json({ success: true }));
const baseApiUrl = "/api/v1";
app.use(baseApiUrl + "/users", userRoutes);
app.use(baseApiUrl + "/products", productRoutes);
app.use(baseApiUrl + "/comments", commentRoutes);

// error and not found (custom middlewares)
app.use(notFound);
app.use(errorHandler);

// server
app.listen(ENV.PORT, () =>
  console.log(`Server is up and running on port: ` + ENV.PORT),
);
