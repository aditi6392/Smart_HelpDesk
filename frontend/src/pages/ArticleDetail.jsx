import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function ArticleDetail() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

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
    fetchArticle();
  }, [id, token]);

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
        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
          {article.content}
        </p>
      </div>
    </div>
  );
}
