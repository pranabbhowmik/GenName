import express from "express";
import cors from "cors";
import nameRouter from "./routers/name.router.js";

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.static("public"));

// Import routers
app.use("/api/name", nameRouter);
export default app;
