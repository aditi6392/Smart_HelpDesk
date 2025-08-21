// src/pages/TicketDetail.jsx
import { useEffect, useState, useContext, useMemo } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";

const STATUS_OPTIONS = ["open", "in_progress", "resolved"];

export default function TicketDetail() {
  const { id } = useParams();
  const { token } = useContext(AuthContext);

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  const [statusSaving, setStatusSaving] = useState(false);
  const [assignSaving, setAssignSaving] = useState(false);

  const [statusError, setStatusError] = useState("");
  const [assignError, setAssignError] = useState("");
  const [pageError, setPageError] = useState("");

  // Agent input (we don't assume a "list agents" endpoint; you can paste an agentId)
  const [agentId, setAgentId] = useState("");

  // Fetch ticket by ID
  useEffect(() => {
    if (!token) return;
    setLoading(true);
    setPageError("");

    api
      .get(`/tickets/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setTicket(res.data))
      .catch((err) => {
        console.error("Error fetching ticket:", err);
        setPageError(
          err.response?.data?.message || "Failed to load ticket details"
        );
      })
      .finally(() => setLoading(false));
  }, [id, token]);

  const isLowPriorityAndUnassigned = useMemo(() => {
    if (!ticket) return false;
    const isLow =
      (ticket.priority || "").toString().toLowerCase() === "low";
    const isUnassigned = !ticket.assignedTo;
    return isLow && isUnassigned;
  }, [ticket]);

  // Update ticket status
  const updateStatus = async (nextStatus) => {
    if (!ticket || !token) return;
    setStatusError("");
    setStatusSaving(true);
    try {
      await api.patch(
        `/tickets/${ticket._id}/status`,
        { status: nextStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Optimistic refresh
      setTicket((t) => ({ ...t, status: nextStatus, updatedAt: new Date().toISOString() }));
    } catch (err) {
      console.error("Status update failed:", err);
      setStatusError(err.response?.data?.message || "Failed to update status");
    } finally {
      setStatusSaving(false);
    }
  };

  // Assign to agent
  const assignToAgent = async () => {
    if (!ticket || !token || !agentId.trim()) {
      setAssignError("Please provide a valid agentId");
      return;
    }
    setAssignError("");
    setAssignSaving(true);
    try {
      const res = await api.patch(
        `/tickets/${ticket._id}/assign`,
        { agentId: agentId.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Backend might return updated ticket; if not, update locally
      const updated = res?.data || {};
      setTicket((t) => ({
        ...t,
        assignedTo:
          updated.assignedTo ??
          t.assignedTo ?? { _id: agentId.trim(), name: "Assigned Agent", email: "" },
        updatedAt: new Date().toISOString(),
      }));
      setAgentId("");
    } catch (err) {
      console.error("Assignment failed:", err);
      setAssignError(err.response?.data?.message || "Failed to assign agent");
    } finally {
      setAssignSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (pageError) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <p className="text-red-600 font-medium">{pageError}</p>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <p className="text-red-600 font-medium">Ticket not found</p>
      </div>
    );
  }

  // Safe render helpers
  const renderPerson = (value) => {
    if (!value) return "N/A";
    if (typeof value === "string") return value;
    if (typeof value === "object") {
      const name = value?.name || "Unknown";
      const email = value?.email ? ` (${value.email})` : "";
      return `${name}${email}`;
    }
    return String(value);
  };

  const cap = (txt) => (txt ? txt.charAt(0).toUpperCase() + txt.slice(1) : "");

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {ticket.subject || ticket.title || "Ticket Detail"}
        </h1>

        {/* Status selector */}
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Status</label>
          <select
            className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={ticket.status || "open"}
            onChange={(e) => updateStatus(e.target.value)}
            disabled={statusSaving}
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {cap(s)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {statusError && (
        <p className="mb-4 text-sm bg-red-50 text-red-700 px-3 py-2 rounded">
          {statusError}
        </p>
      )}

      {/* Info grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <Info label="Ticket ID" value={ticket._id} />
        <Info label="Category" value={cap(ticket.category)} />
        <Info label="Priority" value={cap(ticket.priority)} />
        <Info label="Status" value={cap(ticket.status)} />
        <Info label="Requester" value={renderPerson(ticket.requester)} />
        <Info label="Requester Email" value={ticket.requesterEmail || "N/A"} />
        <Info label="Assigned To" value={renderPerson(ticket.assignedTo)} />
        <Info
          label="Created At"
          value={ticket.createdAt ? new Date(ticket.createdAt).toLocaleString() : "N/A"}
        />
        <Info
          label="Updated At"
          value={ticket.updatedAt ? new Date(ticket.updatedAt).toLocaleString() : "N/A"}
        />
      </div>

      {/* Description */}
      <section className="mt-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
        <p className="text-gray-700 whitespace-pre-line bg-white border rounded-lg p-4">
          {ticket.description || "No description provided"}
        </p>
      </section>

      {/* Quick-assign hint for low priority & unassigned */}
      {isLowPriorityAndUnassigned && (
        <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-emerald-800 font-medium">
            This is a low priority ticket and currently unassigned. You can assign it to a human
            agent below.
          </p>
        </div>
      )}

      {/* Assign panel */}
      <section className="mt-6">
        <h3 className="text-base font-semibold text-gray-900 mb-2">Assign to Agent</h3>
        {assignError && (
          <p className="mb-3 text-sm bg-red-50 text-red-700 px-3 py-2 rounded">
            {assignError}
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={agentId}
            onChange={(e) => setAgentId(e.target.value)}
            placeholder="Enter Agent User ID (e.g., 64fa7e92b4e...)"
            className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={assignToAgent}
            disabled={assignSaving}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition disabled:opacity-60"
          >
            {assignSaving ? "Assigning..." : "Assign Agent"}
          </button>
        </div>
        <p className="mt-2 text-xs text-gray-500">
          This calls <code>PATCH /api/tickets/{ticket._id}/assign</code> with{" "}
          <code>{`{ agentId }`}</code>.
        </p>
      </section>
    </div>
  );
}

/* Small info block that safely renders any primitive/object */
function Info({ label, value }) {
  let display = "N/A";
  if (value !== null && value !== undefined) {
    if (typeof value === "object") {
      // Try to display friendly identity if possible
      if ("name" in value || "email" in value) {
        const name = value?.name || "Unknown";
        const email = value?.email ? ` (${value.email})` : "";
        display = `${name}${email}`;
      } else if ("_id" in value) {
        display = value._id;
      } else {
        display = JSON.stringify(value);
      }
    } else {
      display = String(value);
    }
  }

  return (
    <p className="text-gray-700">
      <span className="font-semibold">{label}:</span> {display}
    </p>
  );
}
