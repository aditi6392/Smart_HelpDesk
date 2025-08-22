import Ticket from "../models/Ticket.js";
import User from "../models/User.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { triageAndAnswer } from "../services/aiService.js";

/**
 * 🔹 Helper: Decide if AI can auto-resolve
 */
function canAutoResolve(aiResult) {
  return (
    aiResult.autoResolved ||
    (aiResult.category === "account" && aiResult.confidence >= 0.8) ||
    (aiResult.category === "billing" && aiResult.confidence >= 0.7) ||
    (aiResult.category === "technical" && aiResult.confidence >= 0.75)
  );
}

/**
 * @desc    Create new ticket (AI triage + optional auto-resolve)
 * @route   POST /api/tickets
 * @access  Private
 */
export const createTicket = asyncHandler(async (req, res) => {
  const { subject, description, category, priority } = req.body;

  if (!subject || !description) {
    res.status(400);
    throw new Error("Please add subject and description");
  }

  // Run AI triage
  const aiResult = await triageAndAnswer({ subject, description });
  const finalCategory = category || aiResult.category || "general";
  const shouldAutoResolve = canAutoResolve(aiResult);

  const ticket = new Ticket({
    subject,
    description,
    category: finalCategory,
    priority: priority || "medium",
    requester: req.user._id,
    requesterEmail: req.user.email,
    status: shouldAutoResolve ? "resolved" : "open",
    assignedTo: null,
    finalReply: shouldAutoResolve ? aiResult.suggestedReply : null,
    ai: {
      category: aiResult.category,
      suggestedReply: aiResult.suggestedReply,
      confidence: aiResult.confidence,
      autoResolved: shouldAutoResolve,
    },
  });

  // If not auto-resolved → assign to first agent
  if (!shouldAutoResolve) {
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
 * @desc    Get tickets (admin/agent see all, users see their own)
 * @route   GET /api/tickets
 * @access  Private
 */
export const getTickets = asyncHandler(async (req, res) => {
  const { role, _id } = req.user;

  const query =
    role === "admin" || role === "agent"
      ? {}
      : { requester: _id };

  const tickets = await Ticket.find(query)
    .sort({ createdAt: -1 })
    .populate("requester", "name email")
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
    .populate("requester", "name email")
    .populate("assignedTo", "name email");

  if (!ticket) {
    res.status(404);
    throw new Error("Ticket not found");
  }

  if (
    req.user.role !== "admin" &&
    req.user.role !== "agent" &&
    String(ticket.requester) !== String(req.user._id)
  ) {
    res.status(403);
    throw new Error("Not authorized to view this ticket");
  }

  res.json(ticket);
});

/**
 * @desc    Update ticket status (admin/agent only)
 * @route   PATCH /api/tickets/:id/status
 * @access  Private/Admin|Agent
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
 * @desc    Assign ticket to a human agent (admin only)
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

export const assignTicketToHuman = assignTicket;

/**
 * @desc    Re-run AI on an existing ticket (admin/agent only)
 * @route   POST /api/tickets/:id/ai/retry
 * @access  Private/Admin|Agent
 */
export const retryAIForTicket = asyncHandler(async (req, res) => {
  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) {
    res.status(404);
    throw new Error("Ticket not found");
  }

  const aiResult = await triageAndAnswer({
    subject: ticket.subject,
    description: ticket.description,
  });

  const shouldAutoResolve = canAutoResolve(aiResult);

  ticket.ai = {
    category: aiResult.category,
    suggestedReply: aiResult.suggestedReply,
    confidence: aiResult.confidence,
    autoResolved: shouldAutoResolve,
  };

  if (shouldAutoResolve) {
    ticket.status = "resolved";
    ticket.finalReply = aiResult.suggestedReply;
  }

  await ticket.save();

  res.json({ message: "AI re-triage complete", ticket });
});
