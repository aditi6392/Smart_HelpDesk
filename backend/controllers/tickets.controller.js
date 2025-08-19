// backend/controllers/tickets.controller.js
import Ticket from "../models/Ticket.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

// POST /api/tickets
export const createTicket = asyncHandler(async (req, res) => {
  const { subject, description, requesterEmail, category, priority } = req.body;

  if (!subject || !requesterEmail) {
    res.status(400);
    throw new Error("subject and requesterEmail are required");
  }

  const ticket = await Ticket.create({
    subject,
    description,
    requesterEmail,
    category,
    priority,
  });

  res.status(201).json(ticket);
});

// GET /api/tickets
export const listTickets = asyncHandler(async (req, res) => {
  const tickets = await Ticket.find().sort({ createdAt: -1 });
  res.json(tickets);
});

// GET /api/tickets/:id
export const getTicket = asyncHandler(async (req, res) => {
  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) {
    res.status(404);
    throw new Error("Ticket not found");
  }
  res.json(ticket);
});

// PATCH /api/tickets/:id/status
export const updateStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const allowed = ["open", "in_progress", "waiting", "resolved", "closed"];
  if (!allowed.includes(status)) {
    res.status(400);
    throw new Error(`Invalid status. Allowed: ${allowed.join(", ")}`);
  }
  const ticket = await Ticket.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );
  if (!ticket) {
    res.status(404);
    throw new Error("Ticket not found");
  }
  res.json(ticket);
});
