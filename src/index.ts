import express from "express";
import { ENV } from "./config/env.js";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";

// initialize express app
const app = express();

// add middlewares
app.use(cors({ origin: ENV.FRONTEND_URL }));
app.use(clerkMiddleware); // attaches the auth obj to the request
app.use(express.json()); // parse the json body
app.use(express.urlencoded({ extended: true })); // parse form data

// routes
app.get("/", (req, res) => res.status(200).json({ success: true }));

// server
app.listen(ENV.PORT, () =>
  console.log(`Server is up and running on port: ` + ENV.PORT),
);
