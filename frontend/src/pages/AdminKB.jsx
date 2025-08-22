// src/pages/AdminKB.jsx
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

export default function AdminKB() {
  const { token } = useContext(AuthContext);
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/kb", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setArticles(res.data);
      } catch (err) {
        console.error("Error fetching KB:", err);
      }
    };
    fetchArticles();
  }, [token]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/kb/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setArticles(articles.filter((a) => a._id !== id));
    } catch (err) {
      console.error("Error deleting KB:", err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">📚 Manage Knowledge Base</h1>

      {articles.map((a) => (
        <div
          key={a._id}
          className="border p-3 mb-2 flex justify-between items-center"
        >
          <div>
            <h2 className="font-semibold">{a.title}</h2>
            <p>{a.content}</p>
            <span className="text-sm text-gray-500">{a.category}</span>
          </div>
          <div className="space-x-2">
            <button className="bg-yellow-500 text-white px-3 py-1 rounded">
              Edit
            </button>
            <button
              onClick={() => handleDelete(a._id)}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
