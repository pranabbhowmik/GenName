import express from "express";
import {
  createName,
  getNameMeaning,
  generateNamePDF,
} from "../controller/name.controller.js";
import nameSchema from "../validator/name-validator.js";
import { z } from "zod";

const nameRouter = express.Router();

// Middleware to validate request body with Zod
const validateName = (schema) => async (req, res, next) => {
  try {
    await schema.parseAsync(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors = error.errors.map((err) => ({
        path: err.path.join("."),
        message: err.message,
      }));
      return res.status(400).json({ errors: formattedErrors });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

nameRouter.post("/create-name", validateName(nameSchema), createName);
nameRouter.post("/name-meaning", validateName(nameSchema), getNameMeaning);
nameRouter.post("/generate-pdf", validateName(nameSchema), generateNamePDF);

export default nameRouter;
