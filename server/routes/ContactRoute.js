import { Router } from "express";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import { getContactForDMList, search } from "../controllers/ContactsController.js";

const contactRoutes = Router();

contactRoutes.post("/search", verifyToken, search);
contactRoutes.get("/get-contacts-for-dm", verifyToken, getContactForDMList);

export default contactRoutes;