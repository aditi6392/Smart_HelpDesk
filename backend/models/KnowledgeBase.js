// backend/models/KnowledgeBase.js
import mongoose from "mongoose";

const KBSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, enum: ["general", "billing", "technical", "account"], default: "general" },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // admin who created it
}, { timestamps: true });

const KnowledgeBase = mongoose.model("KnowledgeBase", KBSchema);
export default KnowledgeBase;
