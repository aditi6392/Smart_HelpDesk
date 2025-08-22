// src/pages/KnowledgeBase.jsx
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

export default function KnowledgeBase() {
  const [articles, setArticles] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { role, token } = useContext(AuthContext);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/kb", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setArticles(res.data);
      } catch (err) {
        setError("Failed to load Knowledge Base.");
      }
    };
    if (token) fetchArticles();
  }, [token]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this article?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/kb/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setArticles((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete article");
    }
  };

  const filteredArticles = articles.filter(
    (a) =>
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-indigo-600 mb-6 text-center">
          Knowledge Base
        </h2>

        {/* Admin: Create button */}
        {role === "admin" && (
          <div className="flex justify-end mb-4">
            <button
              onClick={() => navigate("/admin/kb/create")}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg shadow"
            >
              + Create Article
            </button>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-600 rounded text-center">
            {error}
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        {/* Articles Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredArticles.length > 0 ? (
            filteredArticles.map((article) => (
              <div
                key={article._id}
                className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
              >
                <h3
                  className="text-lg font-semibold text-gray-800 mb-2 cursor-pointer"
                  onClick={() => navigate(`/kb/${article._id}`)}
                >
                  {article.title}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-3">
                  {article.content}
                </p>
                <p
                  onClick={() => navigate(`/kb/${article._id}`)}
                  className="mt-3 text-indigo-600 text-sm font-medium cursor-pointer"
                >
                  Read more →
                </p>

                {/* Admin controls */}
                {role === "admin" && (
                  <div className="mt-4 flex space-x-2">
                    <button
                      onClick={() => navigate(`/admin/kb/edit/${article._id}`)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(article._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center col-span-full">
              No articles found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
