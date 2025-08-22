// src/pages/Dashboard.jsx
import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import TicketCard from "../components/TicketCard";

export default function Dashboard() {
  const { user, role, token } = useContext(AuthContext);
  const [tickets, setTickets] = useState([]);

  // Fetch tickets only if user is normal user
  useEffect(() => {
    if (role === "user" && token) {
      api
        .get("/tickets", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setTickets(res.data))
        .catch((err) => console.error("Error fetching tickets:", err));
    }
  }, [role, token]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Welcome back, {user?.name} 👋
      </h1>

      {/* 🔹 Admin View */}
      {role === "admin" && (
        <div className="space-y-4">
          <p className="text-gray-700">
            You are logged in as <strong>Admin</strong>.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              to="/admin/kb"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 rounded-lg shadow text-center"
            >
              📚 Manage Knowledge Base
            </Link>
            <Link
              to="/admin/tickets"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-lg shadow text-center"
            >
              🎫 Manage All Tickets
            </Link>
          </div>
        </div>
      )}

      {/* 🔹 User View */}
      {role === "user" && (
        <div>
          {/* Header row */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">My Tickets</h2>
            <Link
              to="/create-ticket"
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 transition"
            >
              + Create Ticket
            </Link>
          </div>

          {/* Ticket list */}
          {tickets.length === 0 ? (
            <p className="text-gray-600">No tickets found. Create one!</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tickets.map((ticket) => (
                <TicketCard key={ticket._id} ticket={ticket} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
