import React, { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";

const ListQuestions = () => {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    // Dummy questions for frontend testing
    const dummyData = [
      {
        _id: "1",
        theme: "Leadership",
        category: "Employee Engagement",
        question:
          "How often does leadership communicate key organizational goals to employees?",
        options: [
          "Regularly and transparently across all departments.",
          "Occasionally during major events.",
          "Rarely or inconsistently.",
          "No structured communication plan exists.",
        ],
      },
      {
        _id: "2",
        theme: "Culture",
        category: "Learning & Development",
        question:
          "How does the organization encourage continuous learning among employees?",
        options: [
          "Employees have access to curated learning paths with incentives.",
          "Learning is encouraged but not tracked.",
          "Occasional workshops are held.",
          "No formal learning initiatives exist.",
        ],
      },
      {
        _id: "3",
        theme: "Performance",
        category: "Feedback Mechanism",
        question:
          "How is employee feedback incorporated into performance reviews?",
        options: [
          "Structured 360-degree feedback is implemented consistently.",
          "Feedback is collected but not always used.",
          "Feedback is ad-hoc and informal.",
          "No feedback mechanism exists.",
        ],
      },
      {
        _id: "4",
        theme: "Strategy",
        category: "Goal Alignment",
        question:
          "How well are individual goals aligned with organizational strategy?",
        options: [
          "Fully aligned with measurable OKRs.",
          "Partially aligned but lacks clarity.",
          "Minimal alignment exists.",
          "No defined goal alignment process.",
        ],
      },
      {
        _id: "5",
        theme: "People Management",
        category: "Recognition",
        question:
          "How often are employees recognized for their contributions?",
        options: [
          "Recognition is frequent and part of culture.",
          "Occasional recognition happens during events.",
          "Rarely recognized formally.",
          "No recognition structure exists.",
        ],
      },
    ];

    setQuestions(dummyData);
  }, []);

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this question?"))
      return;
    setQuestions((prev) => prev.filter((q) => q._id !== id));
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        List Questions
      </h2>

      <div className="bg-white shadow-md rounded-xl p-6 border">
        {questions.length === 0 ? (
          <p className="text-gray-500 text-center py-10">
            No questions available.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm md:text-base">
              <thead className="bg-gray-100 text-gray-800 font-semibold">
                <tr>
                  <th className="p-3 border-b">#</th>
                  <th className="p-3 border-b">Theme</th>
                  <th className="p-3 border-b">Category</th>
                  <th className="p-3 border-b">Question</th>
                  <th className="p-3 border-b">Options</th>
                  <th className="p-3 border-b text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {questions.map((q, idx) => (
                  <tr
                    key={q._id}
                    className={`border-b hover:bg-gray-50 ${
                      idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <td className="p-3">{idx + 1}</td>
                    <td className="p-3 font-medium text-gray-700">
                      {q.theme}
                    </td>
                    <td className="p-3 text-gray-700">{q.category}</td>
                    <td className="p-3 text-gray-800 font-medium">
                      {q.question}
                    </td>
                    <td className="p-3">
                      <ul className="list-disc ml-5 text-gray-700 text-sm">
                        {q.options.map((opt, i) => (
                          <li key={i}>{opt}</li>
                        ))}
                      </ul>
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => handleDelete(q._id)}
                        className="text-red-500 hover:text-red-700 transition"
                      >
                        <Trash2 size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListQuestions;
