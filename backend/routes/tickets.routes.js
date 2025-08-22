// backend/routes/tickets.routes.js
import { Router } from "express";
import {
  createTicket,
  getTickets,
  getTicketById,
  updateTicketStatus,
  assignTicketToHuman,
  retryAIForTicket,
} from "../controllers/tickets.controller.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = Router();

// Create + list + read
router.post("/", protect, createTicket);
router.get("/", protect, getTickets);
router.get("/:id", protect, getTicketById);

// Status update (admin/agent)
router.patch(
  "/:id/status",
  protect,
  authorizeRoles("admin", "agent"),
  updateTicketStatus
);

// Assign to agent (admin only)
router.patch(
  "/:id/assign",
  protect,
  authorizeRoles("admin"),
  assignTicketToHuman
);

// Re-run AI (admin/agent)
router.post(
  "/:id/ai/retry",
  protect,
  authorizeRoles("admin", "agent"),
  retryAIForTicket
);

export default router;
