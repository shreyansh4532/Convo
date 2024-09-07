import { Router } from "express";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import { search } from "../controllers/ContactsController.js";

const contactRoutes = Router();

contactRoutes.post("/search", verifyToken, search);

export default contactRoutes;