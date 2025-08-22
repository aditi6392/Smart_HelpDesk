/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

export default function ArticleCard({ article, onDelete }) {
  const navigate = useNavigate();
  const { role, token } = useContext(AuthContext);

  const handleDelete = async (e) => {
    e.stopPropagation(); // prevent navigate
    if (!window.confirm("Are you sure you want to delete this article?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/kb/${article._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (onDelete) onDelete(article._id); // refresh parent list
    } catch (err) {
      console.error(err);
      alert("Failed to delete article.");
    }
  };

  return (
    <div
      className="bg-white rounded-xl shadow p-6 hover:shadow-lg hover:scale-[1.02] transition cursor-pointer flex flex-col justify-between"
      onClick={() => navigate(`/kb/${article._id}`)}
    >
      {/* Title */}
      <h3 className="text-lg font-semibold text-indigo-600 mb-2">
        {article.title}
      </h3>

      {/* Content preview (truncated) */}
      <p className="text-sm text-gray-600 line-clamp-3 mb-4">
        {article.content}
      </p>

      {/* Footer row */}
      <div className="flex items-center justify-between mt-auto">
        <span className="text-indigo-500 text-sm font-medium hover:underline">
          Read more →
        </span>

        {/* Admin actions */}
        {role === "admin" && (
          <div className="flex space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/admin/kb/edit/${article._id}`);
              }}
              className="text-yellow-600 hover:text-yellow-700 text-sm"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="text-red-600 hover:text-red-700 text-sm"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
