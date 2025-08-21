// backend/controllers/tickets.controller.js
import Ticket from "../models/Ticket.js";
import User from "../models/User.js";
import asyncHandler from "../middleware/asyncHandler.js";

/**
 * @desc    Create new ticket
 * @route   POST /api/tickets
 * @access  Private
 */
export const createTicket = asyncHandler(async (req, res) => {
  const { title, description, category, priority } = req.body;

  if (!title || !description) {
    res.status(400);
    throw new Error("Please add title and description");
  }

  // simulate AI handling
  let autoResolved = false;
  let aiResponse = "";

  if (description.toLowerCase().includes("password")) {
    autoResolved = true;
    aiResponse = "It looks like a password issue. Please reset your password.";
  }

  const ticket = new Ticket({
    title,
    description,
    category,
    priority,
    user: req.user._id,
    status: autoResolved ? "resolved" : "open",
    ai: {
      autoResolved,
      response: aiResponse,
    },
  });

  // ✅ auto-assign to human if AI fails
  if (!autoResolved) {
    const agent = await User.findOne({ role: "agent" });
    if (agent) {
      ticket.assignedTo = agent._id;
      ticket.status = "in_progress";
    }
  }

  const createdTicket = await ticket.save();
  res.status(201).json(createdTicket);
});

/**
 * @desc    Get all tickets
 * @route   GET /api/tickets
 * @access  Private/Admin
 */
export const getTickets = asyncHandler(async (req, res) => {
  const tickets = await Ticket.find()
    .populate("user", "name email")
    .populate("assignedTo", "name email");
  res.json(tickets);
});

/**
 * @desc    Get single ticket by ID
 * @route   GET /api/tickets/:id
 * @access  Private
 */
export const getTicketById = asyncHandler(async (req, res) => {
  const ticket = await Ticket.findById(req.params.id)
    .populate("user", "name email")
    .populate("assignedTo", "name email");

  if (ticket) {
    res.json(ticket);
  } else {
    res.status(404);
    throw new Error("Ticket not found");
  }
});

/**
 * @desc    Update ticket status
 * @route   PATCH /api/tickets/:id/status
 * @access  Private/Admin
 */
export const updateTicketStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) {
    res.status(404);
    throw new Error("Ticket not found");
  }

  ticket.status = status || ticket.status;
  await ticket.save();

  res.json({ message: "Ticket status updated", ticket });
});

/**
 * @desc    Assign ticket to a human agent manually
 * @route   PATCH /api/tickets/:id/assign
 * @access  Private/Admin
 */
export const assignTicket = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { agentId } = req.body;

  const ticket = await Ticket.findById(id);
  if (!ticket) {
    res.status(404);
    throw new Error("Ticket not found");
  }

  const agent = await User.findById(agentId);
  if (!agent || agent.role !== "agent") {
    res.status(400);
    throw new Error("Invalid agent ID or user is not an agent");
  }

  ticket.assignedTo = agentId;
  ticket.status = "in_progress";

  await ticket.save();

  res.json({
    message: "Ticket assigned successfully",
    ticket,
  });
});

// ✅ Alias export (fix naming mismatch)
export const assignTicketToHuman = assignTicket;
