// src/pages/AdminDashboard.jsx
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

export default function AdminDashboard() {
  const { token } = useContext(AuthContext);
  const [articles, setArticles] = useState([]);
  const [editingArticle, setEditingArticle] = useState(null);

  // fetch KB articles
  useEffect(() => {
    const fetchArticles = async () => {
      const res = await axios.get("http://localhost:5000/api/kb", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setArticles(res.data);
    };
    fetchArticles();
  }, [token]);

  // delete KB
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this article?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/kb/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setArticles((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      console.error("Delete error:", err.response?.data || err.message);
    }
  };

  // update KB
  const handleUpdate = async () => {
    try {
      const { _id, title, content, category } = editingArticle;
      const res = await axios.put(
        `http://localhost:5000/api/kb/${_id}`,
        { title, content, category },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setArticles((prev) =>
        prev.map((a) => (a._id === _id ? res.data : a))
      );
      setEditingArticle(null);
    } catch (err) {
      console.error("Update error:", err.response?.data || err.message);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">📚 Knowledge Base (Admin)</h1>

      {articles.map((article) => (
        <div
          key={article._id}
          className="border p-3 mb-2 flex justify-between items-center"
        >
          <div>
            <h2 className="font-semibold">{article.title}</h2>
            <p>{article.content}</p>
            <span className="text-sm text-gray-500">{article.category}</span>
          </div>
          <div className="space-x-2">
            <button
              onClick={() => setEditingArticle(article)}
              className="bg-yellow-500 text-white px-3 py-1 rounded"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(article._id)}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      ))}

      {/* Edit Modal */}
      {editingArticle && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4">✏️ Edit Article</h2>
            <input
              type="text"
              value={editingArticle.title}
              onChange={(e) =>
                setEditingArticle({ ...editingArticle, title: e.target.value })
              }
              className="border w-full mb-2 p-2"
              placeholder="Title"
            />
            <textarea
              value={editingArticle.content}
              onChange={(e) =>
                setEditingArticle({ ...editingArticle, content: e.target.value })
              }
              className="border w-full mb-2 p-2"
              placeholder="Content"
            />
            <input
              type="text"
              value={editingArticle.category}
              onChange={(e) =>
                setEditingArticle({ ...editingArticle, category: e.target.value })
              }
              className="border w-full mb-2 p-2"
              placeholder="Category"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setEditingArticle(null)}
                className="bg-gray-400 text-white px-3 py-1 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="bg-blue-600 text-white px-3 py-1 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
