import React, { useEffect, useState } from "react";
import axios from "axios";
import { Trash2, Loader2 } from "lucide-react";
import { toast } from "react-toastify";

const ListQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  const BackendURL = import.meta.env.VITE_BACKEND_URL;

  const fetchQuestions = async () => {
    try {
      const res = await axios.get(`${BackendURL}/api/admin/questions`);
      setQuestions(res.data.questions || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load questions");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this question?")) return;
    try {
      await axios.delete(`${BackendURL}/api/admin/questions/${id}`);
      setQuestions((prev) => prev.filter((q) => q.id !== id));
      toast.success("Question deleted successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete question");
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-indigo-600" size={32} />
      </div>
    );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">List of Questions</h2>

      {questions.length === 0 ? (
        <p className="text-gray-600">No questions found.</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow border rounded-xl">
          <table className="w-full border-collapse text-sm text-left">
            <thead className="bg-gray-100 text-gray-800">
              <tr>
                <th className="p-3 border-b">#</th>
                <th className="p-3 border-b">Area</th>
                <th className="p-3 border-b">Question</th>
                <th className="p-3 border-b">Options</th>
                <th className="p-3 border-b text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {questions.map((q, i) => (
                <tr key={q.id} className="hover:bg-gray-50 border-b">
                  <td className="p-3">{i + 1}</td>
                  <td className="p-3">{q.area}</td>
                  <td className="p-3">{q.text}</td>
                  <td className="p-3">
                    <ul className="list-disc ml-4">
                      {q.options?.map((opt, idx) => (
                        <li key={idx}>{opt.text}</li>
                      ))}
                    </ul>
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => handleDelete(q.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ListQuestions;
