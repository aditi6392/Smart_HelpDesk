import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function TicketDetail() {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [status, setStatus] = useState("");
  const [agentId, setAgentId] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/tickets/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTicket(res.data);
        setStatus(res.data.status);
      } catch (err) {
        setError("Failed to fetch ticket details.");
      }
    };
    fetchTicket();
  }, [id, token]);

  const updateStatus = async () => {
    try {
      await axios.patch(
        `http://localhost:5000/api/tickets/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate("/dashboard");
    } catch (err) {
      setError("Failed to update ticket status.");
    }
  };

  const assignAgent = async () => {
    try {
      await axios.patch(
        `http://localhost:5000/api/tickets/${id}/assign`,
        { agentId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate("/dashboard");
    } catch (err) {
      setError("Failed to assign agent.");
    }
  };

  if (!ticket) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600">
        Loading ticket details...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center px-4">
      <div className="w-full max-w-2xl bg-white shadow-md rounded-xl p-6">
        <h2 className="text-2xl font-bold text-indigo-600 mb-4">
          Ticket Details
        </h2>

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-600 rounded">{error}</div>
        )}

        <div className="space-y-3">
          <p>
            <span className="font-semibold">Title:</span> {ticket.title}
          </p>
          <p>
            <span className="font-semibold">Description:</span>{" "}
            {ticket.description}
          </p>
          <p>
            <span className="font-semibold">Priority:</span>{" "}
            <span
              className={`px-2 py-1 rounded text-white ${
                ticket.priority === "high"
                  ? "bg-red-500"
                  : ticket.priority === "medium"
                  ? "bg-yellow-500"
                  : "bg-green-500"
              }`}
            >
              {ticket.priority}
            </span>
          </p>
          <p>
            <span className="font-semibold">Status:</span> {ticket.status}
          </p>
        </div>

        {/* Update status */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Update Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
          <button
            onClick={updateStatus}
            className="mt-3 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Save Status
          </button>
        </div>

        {/* Assign agent (admin only placeholder) */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Assign Agent (Admin only)
          </label>
          <input
            type="text"
            value={agentId}
            onChange={(e) => setAgentId(e.target.value)}
            placeholder="Enter Agent User ID"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={assignAgent}
            className="mt-3 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
          >
            Assign Agent
          </button>
        </div>
      </div>
    </div>
  );
}
