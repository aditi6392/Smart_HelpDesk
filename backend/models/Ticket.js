// backend/models/Ticket.js
import mongoose from "mongoose";

const TicketSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // link ticket to registered user
      required: true,
    },
    requesterEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ["general", "billing", "technical", "account"],
      default: "general",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    status: {
      type: String,
      enum: ["open", "in_progress", "waiting", "resolved", "closed"],
      default: "open",
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // support agent
      default: null,
    },

    // ✅ New top-level AI reply (so frontend can display easily)
    finalReply: {
      type: String,
      default: null,
    },

    // AI triage details
    ai: {
      category: { type: String, default: null },
      suggestedReply: { type: String, default: null },
      confidence: { type: Number, default: null },
      autoResolved: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

const Ticket = mongoose.model("Ticket", TicketSchema);
export default Ticket;
