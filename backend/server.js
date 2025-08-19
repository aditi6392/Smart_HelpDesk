// backend/server.js
import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import ticketsRouter from "./routes/tickets.routes.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

dotenv.config();
const app = express();

// Connect DB
connectDB();

// Core middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Health check
app.get("/api/health", (req, res) => {
  res.json({ ok: true, service: "smart-helpdesk-backend", time: new Date().toISOString() });
});

// Tickets API
app.use("/api/tickets", ticketsRouter);

// 404 + error handlers
app.use(notFound);
app.use(errorHandler);

// Boot
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
