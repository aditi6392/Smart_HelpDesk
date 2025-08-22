import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

export default function AdminTickets() {
  const { token } = useContext(AuthContext);
  const [tickets, setTickets] = useState([]);

  const fetchTickets = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/tickets", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTickets(res.data);
    } catch (err) {
      console.error("Fetch error:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [token]);

  const handleStatusUpdate = async (id, status) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/tickets/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchTickets();
    } catch (err) {
      console.error("Update error:", err.response?.data || err.message);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">🎫 All Tickets (Admin)</h1>

      {tickets.length === 0 ? (
        <p className="text-gray-600">No tickets found.</p>
      ) : (
        <div className="space-y-4">
          {tickets.map((t) => (
            <div
              key={t._id}
              className="border rounded-lg p-4 shadow flex flex-col gap-2"
            >
              <div className="flex justify-between">
                <h2 className="font-semibold">{t.subject}</h2>
                <span
                  className={`px-2 py-1 rounded text-sm ${
                    t.status === "resolved"
                      ? "bg-green-200 text-green-800"
                      : t.status === "open"
                      ? "bg-red-200 text-red-800"
                      : "bg-yellow-200 text-yellow-800"
                  }`}
                >
                  {t.status}
                </span>
              </div>

              <p className="text-sm text-gray-700">{t.description}</p>

              <div className="text-xs text-gray-600">
                <p>
                  <strong>Requester:</strong> {t.requesterEmail}
                </p>
                <p>
                  <strong>Priority:</strong> {t.priority}
                </p>
                <p>
                  <strong>Category:</strong> {t.category}
                </p>
              </div>

              {t.finalReply && (
                <p className="text-xs bg-gray-50 p-2 rounded">
                  <strong>AI Reply:</strong> {t.finalReply}
                </p>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => handleStatusUpdate(t._id, "resolved")}
                  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                >
                  Mark Resolved
                </button>
                <button
                  onClick={() => handleStatusUpdate(t._id, "open")}
                  className="bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700"
                >
                  Reopen
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
