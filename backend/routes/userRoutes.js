import express from "express";
import { registerUser, loginUser, updateUserRole } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

// NEW: admin-only route to update a user’s role
router.patch("/role/:id", protect, authorizeRoles("admin"), updateUserRole);

export default router;
