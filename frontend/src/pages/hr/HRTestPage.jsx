import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Clock } from "lucide-react";
import { toast } from "react-toastify";

const HRTestPage = () => {
  const navigate = useNavigate();
  const { testId } = useParams();
  const BackendURL = import.meta.env.VITE_BACKEND_URL;

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timer, setTimer] = useState(30);
  const timerRef = useRef(null);

  const currentQuestion = questions[currentIndex];

  // Fetch questions (expects { questions: [{ id, area, text, options: [string] }] })
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await axios.get(`${BackendURL}/api/hr/get-all-questions`);
        if (res.data && Array.isArray(res.data.questions) && res.data.questions.length > 0) {
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

  // Fullscreen + ESC confirm to end test
  useEffect(() => {
    const enableFullscreen = async () => {
      try {
        if (!document.fullscreenElement) {
          await document.documentElement.requestFullscreen();
        }
      } catch (err) {
        console.error("Fullscreen error:", err);
      }
    };
    enableFullscreen();

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        const confirmExit = window.confirm(
          "⚠️ Pressing ESC will end your test. Do you really want to exit?"
        );
        if (confirmExit) {
          finishTest();
        } else {
          e.preventDefault();
        }
      }
    };

    const onExit = () => {
      if (!document.fullscreenElement) navigate("/hr/dashboard");
    };

    document.addEventListener("fullscreenchange", onExit);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("fullscreenchange", onExit);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [navigate]);

  // 30s timer per question
  useEffect(() => {
    if (!questions.length) return;
    setTimer(30);
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          handleSkip();
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, questions]);

  const handleSelect = (qid, optIdx) => {
    setAnswers({ ...answers, [qid]: optIdx });
  };

  const handleSubmit = () => {
    if (answers[currentQuestion.id] === undefined) return;
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      finishTest();
    }
  };

  const handleSkip = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      finishTest();
    }
  };

  const finishTest = () => {
    clearInterval(timerRef.current);
    try { document.exitFullscreen(); } catch {}
    console.log("Final Answers →", answers);
    toast.success("Test submitted successfully!");
    navigate("/hr/dashboard");
  };

  useEffect(() => {
    const warnBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", warnBeforeUnload);
    return () => window.removeEventListener("beforeunload", warnBeforeUnload);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center w-screen h-screen text-gray-600 text-lg font-medium">
        Loading questions...
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="flex items-center justify-center w-screen h-screen text-gray-600 text-lg font-medium">
        No questions available.
      </div>
    );
  }

  return (
    <div className="w-screen h-screen overflow-y-auto overflow-x-hidden bg-gradient-to-br from-indigo-50 to-white flex flex-col items-center justify-start py-8">
      {/* Header */}
      <div className="w-full max-w-5xl bg-white shadow-md rounded-t-xl px-6 py-4 flex justify-between items-center border-b border-gray-200 sticky top-0 z-10">
        <h2 className="text-xl font-semibold text-gray-800">HR Diagnostic Test</h2>
        <div className="flex items-center gap-6">
          <p className="text-gray-600 font-medium">
            Question {currentIndex + 1} / {questions.length}
          </p>
          <div className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-1.5 rounded-full font-semibold">
            <Clock size={18} />
            {timer}s
          </div>
        </div>
      </div>

      {/* Question Card */}
      <div className="w-full max-w-5xl bg-white shadow-lg rounded-b-xl p-8 mt-6">
        <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-2">
          <span className="text-sm text-gray-500 italic">
            ({currentQuestion.area})
          </span>
        </h3>
        <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-6">
          {currentQuestion.question}
        </h3>

        {/* Options (exact order from backend/Excel) */}
        <div className="flex flex-col gap-3">
          {currentQuestion.options.map((opt, idx) => (
            <label
              key={idx}
              className={`flex items-start gap-3 p-3 rounded-md border cursor-pointer transition-all duration-200 ${
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
              <span className="text-gray-700">{opt}</span>
            </label>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex justify-end mt-10 gap-4">
          <button
            onClick={handleSkip}
            className="px-6 py-2 bg-gray-200 text-gray-700 font-medium rounded-md hover:bg-gray-300 transition"
          >
            Skip
          </button>
          <button
            onClick={handleSubmit}
            disabled={answers[currentQuestion.id] === undefined}
            className={`px-6 py-2 font-semibold rounded-md text-white transition ${
              answers[currentQuestion.id] === undefined
                ? "bg-green-300 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            Submit
          </button>
        </div>
      </div>

      <p className="mt-6 mb-4 text-sm text-gray-500 text-center px-4">
        Each question has a 30-second timer. You can either submit or skip — no returning to previous questions.
      </p>
    </div>
  );
};

export default HRTestPage;
