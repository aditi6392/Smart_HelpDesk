import { Router } from "express";
import {
  createTicket,
  getTickets,
  getTicketById,
  updateTicketStatus,
} from "../controllers/tickets.controller.js";
import { protect } from "../middleware/authMiddleware.js"; // <-- import middleware

const router = Router();

// Protect all ticket routes
router.post("/", protect, createTicket);
router.get("/", protect, getTickets);
router.get("/:id", protect, getTicketById);
router.patch("/:id/status", protect, updateTicketStatus);

export default router;
