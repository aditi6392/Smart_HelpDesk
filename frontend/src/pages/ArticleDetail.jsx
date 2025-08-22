// src/pages/ArticleDetail.jsx
import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

export default function ArticleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [error, setError] = useState("");

  const { role, token } = useContext(AuthContext);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/kb/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setArticle(res.data);
      } catch (err) {
        setError("Failed to load article.");
      }
    };
    if (token) fetchArticle();
  }, [id, token]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this article?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/kb/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/kb");
    } catch (err) {
      console.error(err);
      alert("Failed to delete article");
    }
  };

  if (!article) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600">
        {error || "Loading article..."}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow">
        <h2 className="text-2xl font-bold text-indigo-600 mb-4">
          {article.title}
        </h2>
        <p className="text-gray-700 leading-relaxed whitespace-pre-line mb-6">
          {article.content}
        </p>

        {/* Admin controls */}
        {role === "admin" && (
          <div className="flex space-x-3">
            <button
              onClick={() => navigate(`/admin/kb/edit/${article._id}`)}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
