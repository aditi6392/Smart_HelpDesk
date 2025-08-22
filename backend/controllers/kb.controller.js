// backend/controllers/kb.controller.js
import asyncHandler from "../middleware/asyncHandler.js";
import KnowledgeBase from "../models/KnowledgeBase.js";

// Create KB article (admin only)
const createKB = asyncHandler(async (req, res) => {
  const { title, content, category } = req.body;
  if (!title || !content) return res.status(400).json({ message: "Title & content required" });

  const kb = await KnowledgeBase.create({
    title,
    content,
    category: category || "general",
    createdBy: req.user._id,
  });

  res.status(201).json(kb);
});

// Get all KB articles
const getKBs = asyncHandler(async (req, res) => {
  const kbs = await KnowledgeBase.find().sort({ createdAt: -1 });
  res.json(kbs);
});
// Get KB by ID
const getKBById = asyncHandler(async (req, res) => {
  const kb = await KnowledgeBase.findById(req.params.id);
  if (!kb) return res.status(404).json({ message: "KB article not found" });

  res.json(kb);
});

// Update KB article (admin only)
const updateKB = asyncHandler(async (req, res) => {
  const kb = await KnowledgeBase.findById(req.params.id);
  if (!kb) return res.status(404).json({ message: "KB article not found" });

  kb.title = req.body.title || kb.title;
  kb.content = req.body.content || kb.content;
  kb.category = req.body.category || kb.category;

  const updatedKB = await kb.save();
  res.json(updatedKB);
});

// Delete KB article (admin only)
const deleteKB = asyncHandler(async (req, res) => {
  const kb = await KnowledgeBase.findByIdAndDelete(req.params.id);
  if (!kb) {
    return res.status(404).json({ message: "KB article not found" });
  }
  res.json({ message: "KB article deleted" });
});


export { createKB, getKBs, getKBById, updateKB, deleteKB };
