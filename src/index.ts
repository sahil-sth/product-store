import express from "express";
import { ENV } from "./config/env.js";
const app = express();

app.get("/", (req, res) => res.status(200).json({ success: true }));
app.listen(ENV.PORT, () =>
  console.log(`Server is up and running on port: ` + ENV.PORT),
);
