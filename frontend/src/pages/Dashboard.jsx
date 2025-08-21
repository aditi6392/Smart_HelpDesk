import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import TicketCard from "../components/TicketCard";

export default function Dashboard() {
  const { user, token } = useContext(AuthContext);
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    if (token) {
      api
        .get("/tickets", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setTickets(res.data))
        .catch((err) => console.error(err));
    }
  }, [token]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Header row */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <a
          href="/create-ticket"
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 transition"
        >
          + Create Ticket
        </a>
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
  );
}
