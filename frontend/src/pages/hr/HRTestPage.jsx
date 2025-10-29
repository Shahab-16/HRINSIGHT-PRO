import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const HRTestPage = () => {
  const navigate = useNavigate();
  const { testId } = useParams();
  const BackendURL = import.meta.env.VITE_BACKEND_URL;

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});

  const currentQuestion = questions[currentIndex];

  // ✅ Fetch questions
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await axios.get(`${BackendURL}/api/hr/get-all-questions`);
        if (res.data?.questions?.length > 0) {
          const formatted = res.data.questions.map((q) => ({
            id: q.id,
            area: q.area || "General",
            question: q.text || "Untitled Question",
            options: Array.isArray(q.options) ? q.options : [],
          }));
          setQuestions(formatted);
        } else {
          toast.error("No questions found!");
        }
      } catch (err) {
        console.error("Error fetching questions:", err);
        toast.error("Failed to load questions");
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [BackendURL]);

  const handleSelect = (qid, optIdx) => {
    setAnswers((prev) => ({ ...prev, [qid]: optIdx }));
  };

  const handleSubmit = () => {
    if (answers[currentQuestion.id] === undefined) {
      toast.warn("Please select an option before proceeding.");
      return;
    }

    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      finishTest();
    }
  };

  const finishTest = () => {
    console.log("🧩 Final Answers:", answers);
    toast.success("Test submitted successfully!");
    // Example: send answers to backend/GPT API here
    // await axios.post(`${BackendURL}/api/hr/submit-test`, { testId, answers });
    navigate("/hr/dashboard");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full text-gray-600 text-lg font-medium">
        Loading questions...
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full text-gray-600 text-lg font-medium">
        No questions available.
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-indigo-50 to-white flex flex-col items-center">
      {/* Header */}
      <div className="w-full bg-white shadow-sm px-6 md:px-12 py-5 flex justify-between items-center border-b border-gray-200 sticky top-0 z-10">
        <h2 className="text-2xl font-semibold text-gray-800 tracking-tight">
          HR Diagnostic Test
        </h2>
        <p className="text-gray-600 font-medium text-sm md:text-base">
          Question {currentIndex + 1} / {questions.length}
        </p>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center flex-grow w-full px-4 md:px-6 lg:px-8 py-10">
        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-6 md:p-10 transition-all duration-300">
          <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-2 text-center">
            <span className="text-sm text-gray-500 italic">
              ({currentQuestion.area})
            </span>
          </h3>
          <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-8 text-center">
            {currentQuestion.question}
          </h3>

          {/* Options */}
          <div className="flex flex-col gap-3">
            {currentQuestion.options.map((opt, idx) => (
              <label
                key={idx}
                className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                  answers[currentQuestion.id] === idx
                    ? "border-green-500 bg-green-50"
                    : "border-gray-300 hover:bg-gray-100"
                }`}
              >
                <input
                  type="radio"
                  name={`q-${currentQuestion.id}`}
                  checked={answers[currentQuestion.id] === idx}
                  onChange={() => handleSelect(currentQuestion.id, idx)}
                  className="accent-green-600 mt-1"
                />
                <span className="text-gray-700 leading-relaxed">{opt}</span>
              </label>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex justify-end mt-10">
            <button
              onClick={handleSubmit}
              className="px-8 py-3 font-semibold rounded-md text-white bg-green-600 hover:bg-green-700 transition-all duration-200 shadow-sm"
            >
              {currentIndex === questions.length - 1 ? "Submit Test" : "Next"}
            </button>
          </div>
        </div>
      </div>

      <p className="mt-4 mb-8 text-sm text-gray-500 text-center px-4 max-w-2xl">
        Answer all questions carefully before submitting. Once submitted, your answers will be automatically evaluated.
      </p>
    </div>
  );
};

export default HRTestPage;
