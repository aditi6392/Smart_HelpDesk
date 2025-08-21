// backend/routes/kb.routes.js
import { Router } from "express";
import { createKB, getKBs,getKBById, updateKB, deleteKB } from "../controllers/kb.controller.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = Router();

// Public route
router.get("/", protect, getKBs);
// Public route to get KB by ID
router.get("/:id", protect, getKBById);


// Admin-only routes
router.post("/", protect, authorizeRoles("admin"), createKB);
router.put("/:id", protect, authorizeRoles("admin"), updateKB);
router.delete("/:id", protect, authorizeRoles("admin"), deleteKB);

export default router;
