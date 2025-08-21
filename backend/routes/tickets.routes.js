import { Router } from "express";
import {
  createTicket,
  getTickets,
  getTicketById,
  updateTicketStatus,
  assignTicketToHuman,   // <-- new controller
} from "../controllers/tickets.controller.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

// Protect all ticket routes
router.post("/", protect, createTicket);
router.get("/", protect, getTickets);
router.get("/:id", protect, getTicketById);
router.patch("/:id/status", protect, updateTicketStatus);

// NEW: Assign ticket to a human agent
router.patch("/:id/assign", protect, assignTicketToHuman);

export default router;
