// backend/routes/tickets.routes.js
import { Router } from "express";
import { createTicket, listTickets, getTicket, updateStatus } from "../controllers/tickets.controller.js";

const router = Router();

router.post("/", createTicket);
router.get("/", listTickets);
router.get("/:id", getTicket);
router.patch("/:id/status", updateStatus);

export default router;
