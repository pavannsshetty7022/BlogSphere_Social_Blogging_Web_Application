import express from "express";
import { register, login, updateProfile, logout } from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import uploadMiddleware from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.put("/profile", authMiddleware, uploadMiddleware.single("profile"), updateProfile);

export default router;
