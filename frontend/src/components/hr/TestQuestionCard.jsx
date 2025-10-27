import React from "react";

const TestQuestionCard = ({ question, selected, onSelect }) => {
  return (
    <div>
      <h3 className="text-lg font-medium text-gray-800 mb-4">
        {question.question}
      </h3>
      <div className="flex flex-col gap-3">
        {question.options.map((option, index) => (
          <label
            key={index}
            className={`flex items-center gap-3 p-3 rounded-md border cursor-pointer transition-all duration-200 ${
              selected === index
                ? "border-indigo-500 bg-indigo-50"
                : "border-gray-300 hover:bg-gray-100"
            }`}
          >
            <input
              type="radio"
              name={`question-${question.id}`}
              checked={selected === index}
              onChange={() => onSelect(question.id, index)}
              className="accent-indigo-600"
            />
            <span className="text-gray-700">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default TestQuestionCard;
