import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import ticketsRouter from "./routes/tickets.routes.js";
import usersRouter from "./routes/userRoutes.js"; // <-- ES module import
import { notFound, errorHandler } from "./middleware/errorHandler.js";
import kbRouter from "./routes/kb.routes.js";

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

// Routes
app.use("/api/tickets", ticketsRouter);
app.use("/api/users", usersRouter); // <-- fixed
// Routes
app.use("/api/tickets", ticketsRouter);
app.use("/api/users", usersRouter);
app.use("/api/kb", kbRouter);  // <-- KB routes


// 404 + error handlers
app.use(notFound);
app.use(errorHandler);

// Boot
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
