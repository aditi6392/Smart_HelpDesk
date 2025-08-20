import asyncHandler from "../middleware/asyncHandler.js";
import Ticket from "../models/Ticket.js";

// Create ticket
const createTicket = asyncHandler(async (req, res) => {
  const { subject, description, category, priority } = req.body;

  if (!req.user) {
    return res.status(401).json({ message: "Not authorized" });
  }
  // Example AI triage (basic rule-based)
ticket.ai.category = category || "general";
ticket.ai.suggestedReply = `Hello, we are reviewing your ${ticket.ai.category} issue.`;
ticket.ai.confidence = 0.8; // Example confidence
await ticket.save();


  // Validate required field
  if (!subject) {
    return res.status(400).json({ message: "Subject is required" });
  }

  const ticket = await Ticket.create({
    subject,
    description: description || "", // default to empty string
    category: category || "general", // default to general
    priority: priority || "medium",  // default to medium
    requester: req.user._id,
    requesterEmail: req.user.email,
  });

  res.status(201).json(ticket);
});

// Get all tickets for logged-in user
const getTickets = asyncHandler(async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authorized" });
  }

  const tickets = await Ticket.find({ requester: req.user._id }).sort({ createdAt: -1 });
  res.json(tickets);
});

// Get ticket by ID
const getTicketById = asyncHandler(async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authorized" });
  }

  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) return res.status(404).json({ message: "Ticket not found" });

  if (
    ticket.requester.toString() !== req.user._id.toString() &&
    (!ticket.assignedTo || ticket.assignedTo.toString() !== req.user._id.toString())
  ) {
    return res.status(403).json({ message: "Not authorized to view this ticket" });
  }

  res.json(ticket);
});

// Update ticket status
const updateTicketStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!req.user) {
    return res.status(401).json({ message: "Not authorized" });
  }

  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) return res.status(404).json({ message: "Ticket not found" });

  if (
    ticket.requester.toString() !== req.user._id.toString() &&
    (!ticket.assignedTo || ticket.assignedTo.toString() !== req.user._id.toString())
  ) {
    return res.status(403).json({ message: "Not authorized to update this ticket" });
  }

  ticket.status = status || ticket.status;
  const updatedTicket = await ticket.save();
  res.json(updatedTicket);
});

export { createTicket, getTickets, getTicketById, updateTicketStatus };
