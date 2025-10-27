import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Clock } from "lucide-react";

const HRTestPage = () => {
  const navigate = useNavigate();
  const { testId } = useParams();

  // --- Dummy Questions (10)
  const questions = [
    {
      id: 1,
      question: "How often does your organization conduct employee engagement surveys?",
      options: ["Never", "Once a year", "Twice a year", "Quarterly or more"],
    },
    {
      id: 2,
      question: "How actively does leadership sponsor HR initiatives?",
      options: ["Rarely", "Occasionally", "Frequently", "Always"],
    },
    {
      id: 3,
      question: "How would you rate your learning culture?",
      options: ["Poor", "Developing", "Good", "Excellent"],
    },
    {
      id: 4,
      question: "How are employees recognized for performance?",
      options: ["Never", "Sometimes", "Often", "Consistently"],
    },
    {
      id: 5,
      question: "How clear are career progression paths in your company?",
      options: ["Not defined", "Somewhat clear", "Mostly clear", "Very clear"],
    },
    {
      id: 6,
      question: "How effective is internal communication?",
      options: ["Ineffective", "Average", "Good", "Very Effective"],
    },
    {
      id: 7,
      question: "How satisfied are employees with HR policies?",
      options: ["Unsatisfied", "Neutral", "Satisfied", "Highly satisfied"],
    },
    {
      id: 8,
      question: "How well does management handle feedback?",
      options: ["Poorly", "Acceptably", "Well", "Very well"],
    },
    {
      id: 9,
      question: "How transparent are performance evaluations?",
      options: ["Not transparent", "Somewhat transparent", "Transparent", "Highly transparent"],
    },
    {
      id: 10,
      question: "How aligned are HR goals with organizational strategy?",
      options: ["Not aligned", "Partially aligned", "Mostly aligned", "Fully aligned"],
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timer, setTimer] = useState(30);
  const timerRef = useRef(null);

  const currentQuestion = questions[currentIndex];

  // --- Auto fullscreen
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

    const onExit = () => {
      if (!document.fullscreenElement) navigate("/hr/dashboard");
    };
    document.addEventListener("fullscreenchange", onExit);
    return () => document.removeEventListener("fullscreenchange", onExit);
  }, [navigate]);

  // --- 30s timer per question
  useEffect(() => {
    setTimer(30);
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          handleSkip(); // auto skip when time expires
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex]);

  // --- Record answer
  const handleSelect = (qid, optIdx) => {
    setAnswers({ ...answers, [qid]: optIdx });
  };

  // --- Submit current question
  const handleSubmit = () => {
    if (answers[currentQuestion.id] === undefined) return; // must select before submit
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      finishTest();
    }
  };

  // --- Skip current question
  const handleSkip = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      finishTest();
    }
  };

  // --- Finish test
  const finishTest = () => {
    clearInterval(timerRef.current);
    document.exitFullscreen();
    console.log("Final Answers →", answers);
    navigate("/hr/dashboard");
  };

  // --- Prevent accidental reload
  useEffect(() => {
    const warnBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", warnBeforeUnload);
    return () => window.removeEventListener("beforeunload", warnBeforeUnload);
  }, []);

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-indigo-50 to-white flex flex-col items-center justify-center">
      {/* Header */}
      <div className="w-full max-w-5xl bg-white shadow-md rounded-t-xl px-6 py-4 flex justify-between items-center border-b border-gray-200">
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
      <div className="w-full max-w-5xl bg-white shadow-lg rounded-b-xl p-8">
        <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-6">
          {currentQuestion.question}
        </h3>

        {/* Options */}
        <div className="flex flex-col gap-3">
          {currentQuestion.options.map((opt, idx) => (
            <label
              key={idx}
              className={`flex items-center gap-3 p-3 rounded-md border cursor-pointer transition-all duration-200 ${
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
                className="accent-green-600"
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

      <p className="mt-6 text-sm text-gray-500">
        Each question has a 30 second timer. You can either submit or skip — no returning to previous questions.
      </p>
    </div>
  );
};

export default HRTestPage;
