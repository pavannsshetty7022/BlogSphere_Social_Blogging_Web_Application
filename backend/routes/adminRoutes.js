import express from "express";
import {
    getStats,
    getAllUsers,
    updateUserStatus,
    getAllPosts,
    updatePostStatus,
    deletePost,
    getPostDetails,
    getActiveUsers
} from "../controllers/adminController.js";
import { authMiddleware, adminMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);
router.use(adminMiddleware);


router.get("/stats", getStats);
router.get("/active-users", getActiveUsers);

router.get("/users", getAllUsers);
router.put("/users/:userId/status", updateUserStatus);

router.get("/posts", getAllPosts);
router.get("/posts/:postId", getPostDetails);
router.put("/posts/:postId/status", updatePostStatus);
router.delete("/posts/:postId", deletePost);

export default router;
