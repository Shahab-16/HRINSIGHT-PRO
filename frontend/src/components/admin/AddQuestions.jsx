import React, { useState } from "react";
import * as XLSX from "xlsx";
import axios from "axios";
import { Upload, CheckCircle, FileSpreadsheet } from "lucide-react";

const AddQuestions = () => {
  const [file, setFile] = useState(null);
  const [parsedData, setParsedData] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Handle Excel parsing
  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    setFile(selected);

    const reader = new FileReader();
    reader.onload = (event) => {
      const workbook = XLSX.read(event.target.result, { type: "binary" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet);

      // Extract the data according to your Excel structure
      const questions = rows.map((row, index) => ({
        id: index + 1,
        theme: row["Theme"] || "",
        category: row["Category"] || "",
        question: row["Diagnostic Question"] || "",
        options: [
          row["Leading"] || "",
          row["Established"] || "",
          row["Emerging"] || "",
          row["Absent"] || "",
        ],
        scores: [4, 3, 2, 1],
      }));

      setParsedData(questions.filter((q) => q.question.trim() !== ""));
      setSuccess(false);
    };
    reader.readAsBinaryString(selected);
  };

  const handleUpload = async () => {
    if (parsedData.length === 0) return alert("Please upload a valid file.");
    setUploading(true);
    try {
      await axios.post("/api/admin/upload-questions", { questions: parsedData });
      setSuccess(true);
      setParsedData([]);
      setFile(null);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload questions. Check console for details.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Add Questions</h2>

      {/* Upload Card */}
      <div className="bg-white shadow-md rounded-xl p-6 border flex flex-col items-center justify-center border-dashed border-gray-300 hover:border-indigo-500 transition">
        <FileSpreadsheet size={40} className="text-indigo-600 mb-3" />
        <p className="text-gray-600 mb-3 text-center">
          Upload Excel (.xlsx) file with columns: <br />
          <strong>Theme, Category, Diagnostic Question, Leading, Established, Emerging, Absent</strong>
        </p>

        <input
          type="file"
          accept=".xlsx"
          onChange={handleFileChange}
          className="mb-4 text-sm"
        />

        {file && (
          <p className="text-sm text-gray-700 mb-3">
            Selected File: <strong>{file.name}</strong>
          </p>
        )}

        <button
          disabled={uploading || parsedData.length === 0}
          onClick={handleUpload}
          className={`px-5 py-2 rounded-md text-white font-semibold transition ${
            uploading || parsedData.length === 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {uploading ? "Uploading..." : "Upload to Server"}
        </button>

        {success && (
          <div className="flex items-center gap-2 mt-4 text-green-600 font-medium">
            <CheckCircle size={18} /> Questions uploaded successfully!
          </div>
        )}
      </div>

      {/* Preview */}
      {parsedData.length > 0 && (
        <div className="mt-10">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Preview ({parsedData.length} Questions)
          </h3>

          <div className="bg-white rounded-xl shadow p-4 border max-h-[500px] overflow-y-auto">
            {parsedData.map((q) => (
              <div
                key={q.id}
                className="border-b last:border-b-0 py-4 hover:bg-gray-50 transition"
              >
                <p className="font-medium text-gray-900">
                  {q.theme} › {q.category}
                </p>
                <p className="text-gray-800 font-semibold mt-1">
                  {q.question}
                </p>
                <ul className="list-disc list-inside mt-2 text-gray-700 text-sm">
                  {q.options.map((opt, i) => (
                    <li key={i}>
                      <span className="font-medium text-gray-600 mr-2">
                        {["Leading", "Established", "Emerging", "Absent"][i]}:
                      </span>
                      {opt}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AddQuestions;
