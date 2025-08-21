/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";

export default function TicketCard({ ticket }) {
  const navigate = useNavigate();

  // Color logic for priority
  const priorityColors = {
    low: "bg-green-100 text-green-700",
    medium: "bg-yellow-100 text-yellow-700",
    high: "bg-red-100 text-red-700",
  };

  // Color logic for status
  const statusColors = {
    open: "bg-blue-100 text-blue-700",
    in_progress: "bg-orange-100 text-orange-700",
    resolved: "bg-green-100 text-green-700",
    closed: "bg-gray-200 text-gray-600",
  };

  return (
    <div
      className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition cursor-pointer flex flex-col justify-between"
      onClick={() => navigate(`/tickets/${ticket._id}`)}
    >
      {/* Title */}
      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        {ticket.title}
      </h3>

      {/* Description (truncated) */}
      <p className="text-sm text-gray-600 line-clamp-3 mb-4">
        {ticket.description}
      </p>

      {/* Tags (priority + status) */}
      <div className="flex flex-wrap gap-2 mt-auto">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            priorityColors[ticket.priority] || "bg-gray-100 text-gray-600"
          }`}
        >
          {ticket.priority}
        </span>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            statusColors[ticket.status] || "bg-gray-100 text-gray-600"
          }`}
        >
          {ticket.status}
        </span>
      </div>
    </div>
  );
}
