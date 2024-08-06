import { login, signup } from "../controllers/AuthController.js";
import { Router } from "express";

const authRoutes = Router();

authRoutes.post("/signup", signup);
authRoutes.post("/login", login);
authRoutes.get("/user-info", getUserInfo);

export default authRoutes;
